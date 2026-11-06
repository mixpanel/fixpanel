/**
 * Flagzilla - app logic: panels, runners, verifier.
 * Reads window.FZ (mixpanel.js) and window.FZLogic (jsonlogic.js).
 */
/* global FZ, FZLogic, wonk, wonkData, wonkCharts, Plot, mixpanel */

document.addEventListener("DOMContentLoaded", () => {
	"use strict";
	const fmt = wonk.fmt;
	const $ = (id) => document.getElementById(id);
	wonk.theme.init();

	// The project was built 2026-11-05 ~21:00 UTC. Cohort mismatches inside a day read "possible sync lag".
	const PROJECT_BUILT_AT = Date.parse("2026-11-05T21:00:00Z");
	const projectIsYoung = () => Date.now() - PROJECT_BUILT_AT < 86400000;
	const PAGE_SIZE = 50;

	// ---------- small helpers ----------
	function el(tag, cls, text) {
		const n = document.createElement(tag);
		if (cls) n.className = cls;
		if (text !== undefined && text !== null) n.textContent = text;
		return n;
	}
	const ms = (v) => (v === null || v === undefined || Number.isNaN(v) ? "—" : `${fmt.num(v)} ms`);
	const kb = (v) => {
		if (v === null || v === undefined) return "—";
		if (v >= 1048576) return `${(v / 1048576).toFixed(2)} MB`;
		return `${fmt.num(v / 1024)} KB`;
	};
	function quantile(xs, p) {
		if (!xs.length) return null;
		const s = [...xs].sort((a, b) => a - b);
		return s[Math.min(s.length - 1, Math.floor(p * s.length))];
	}
	function wilson(k, n, z = 1.96) {
		if (!n) return [0, 1];
		const p = k / n, d = 1 + (z * z) / n, c = p + (z * z) / (2 * n);
		const m = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
		return [Math.max(0, (c - m) / d), Math.min(1, (c + m) / d)];
	}
	function kv(dl, pairs) {
		dl.replaceChildren();
		for (const [term, value, tip] of pairs) {
			const dt = el("dt", null, term);
			if (tip) { dt.dataset.tip = tip; dt.classList.add("wonk-term"); }
			const dd = el("dd", "fz-mono");
			if (value instanceof Node) dd.append(value); else dd.textContent = value;
			dl.append(dt, dd);
		}
		wonk.init(dl);
	}
	const payloadBytes = (v) => new TextEncoder().encode(JSON.stringify(v === undefined ? null : v)).length;
	const preview = (v) => { const s = JSON.stringify(v); return s && s.length > 60 ? s.slice(0, 57) + "…" : s; };
	const sinceNav = (t) => (t === null || t === undefined ? null : Math.round(t));

	// ---------- state ----------
	const S = {
		M: null, byKey: new Map(), byId: new Map(),
		persona: null,
		served: null, // flags object for the active persona
		servedRec: null, // the fetch record that produced it
		verify: null,
		fetchLog: [], // every flags fetch on this page: {source, ms, ttfb, bytes, served, persona}
		proxyOk: null,
		sdkVersion: null,
		readyAt: null, firstVariantAt: null,
		pageLoadedTracked: false,
		sdkAgreement: null,
		defs: [],
		inv: { page: 0, sort: { key: "n", dir: "asc" }, rows: [] },
	};

	// ---------- expectations ----------
	const PASS = (note) => ({ v: "pass", note: note || "" });
	const FAIL = (note) => ({ v: "fail", note: note || "" });
	const AGG = (note) => ({ v: "aggregate", note: note || "checked by the sweep" });
	const activeArms = (e) => Object.entries(e.variants || {}).filter(([, s]) => s > 0).map(([k]) => k);

	function firstMatch(groups, props) {
		for (const g of groups) {
			if (g.rule === null || FZLogic.truthy(g.rule, props)) return g.variant;
		}
		return null;
	}

	/** What the manifest says persona p should get for flag f. */
	function expected(f, p, sent) {
		const e = f.expect, props = sent || FZ.contextProps(p); // what the request sends; cohorts read the profile below
		switch (e.kind) {
			case "deterministic":
				return {
					want: e.valueKey ? `${e.variant} (_fz)` : e.variant, p: 1, must: true,
					check: (g) => {
						if (!g) return FAIL("absent");
						if (g.variant_key !== e.variant) return FAIL(`variant ${g.variant_key}`);
						if (e.valueKey && (!g.variant_value || g.variant_value._fz !== e.valueKey)) return FAIL("variant_value._fz differs");
						return PASS();
					},
				};
			case "test-users": {
				const pinned = e.users[p.distinct_id];
				if (pinned) return { want: pinned, p: 1, must: true, check: (g) => (g && g.variant_key === pinned ? PASS() : FAIL(g ? `variant ${g.variant_key}` : "absent")) };
				return { want: "absent", p: 0, must: false, check: (g) => (g ? FAIL(`served ${g.variant_key} to a non-QA user`) : PASS()) };
			}
			case "rule": {
				let want;
				try { want = firstMatch(e.groups, props); } catch (err) { return { want: "?", p: 0, must: false, check: () => ({ v: "error", note: err.message }) }; }
				if (want === null) return { want: "absent", p: 0, must: false, check: (g) => (g ? FAIL(`served ${g.variant_key}, no rule matches`) : PASS()) };
				return { want, p: 1, must: true, check: (g) => (g && g.variant_key === want ? PASS() : FAIL(g ? `variant ${g.variant_key}` : "absent")) };
			}
			case "rule-percent": {
				let match;
				try { match = FZLogic.truthy(e.rule, props); } catch (err) { return { want: "?", p: 0, must: false, check: () => ({ v: "error", note: err.message }) }; }
				if (!match) return { want: "absent", p: 0, must: false, check: (g) => (g ? FAIL(`served ${g.variant_key}, rule does not match`) : PASS()) };
				const arms = activeArms(e);
				return { want: `≈${fmt.pct(e.rollout)} ${arms.join("/")}`, p: e.rollout, must: e.rollout === 1, check: (g) => (g && !arms.includes(g.variant_key) ? FAIL(`variant ${g.variant_key}`) : AGG()) };
			}
			case "percent": {
				const arms = activeArms(e), r = e.rollout;
				const want = r === 0 ? "absent" : `${r === 1 ? "" : "≈" + fmt.pct(r) + " "}${arms.length > 3 ? arms.length + " arms" : arms.join("/")}`;
				return {
					want, p: r, must: r === 1,
					check: (g) => {
						if (g && !arms.includes(g.variant_key)) return FAIL(`variant ${g.variant_key}`);
						if (r === 0) return g ? FAIL("served at 0% rollout") : PASS();
						if (r === 1) return g ? PASS() : FAIL("absent at 100% rollout");
						return AGG();
					},
				};
			}
			case "cohort": {
				const match = p.properties[e.profileProperty] === e.equals;
				const want = match ? e.variant : "absent";
				return {
					want, p: match ? 1 : 0, must: match,
					check: (g) => {
						const ok = match ? g && g.variant_key === e.variant : !g;
						if (ok) return PASS();
						const note = match ? (g ? `variant ${g.variant_key}` : "absent") : `served ${g.variant_key}`;
						return projectIsYoung() ? { v: "lag", note: `possible sync lag: ${note}` } : FAIL(note);
					},
				};
			}
			case "first-event":
				return {
					want: `absent until ${e.event}`, p: 0, must: false,
					check: (g) => {
						if (!g) return PASS("waiting for the trigger");
						return g.variant_key === e.variant ? PASS("On: trigger already tracked") : FAIL(`variant ${g.variant_key}`);
					},
				};
			default:
				return { want: "?", p: 0, must: false, check: () => ({ v: "error", note: `unknown expect.kind ${e.kind}` }) };
		}
	}

	const VERDICT_BADGE = {
		pass: ["✓ pass", "ok"], fail: ["✗ fail", "err"], lag: ["△ lag", "warn"],
		aggregate: ["Σ aggregate", "info"], error: ["! error", "err"], unknown: ["? not in manifest", "warn"],
	};

	/** Check one flags response for one persona. */
	function verify(flags, p) {
		const rows = [];
		let expectedLive = 0, variance = 0;
		const counts = {};
		const sent = FZ.contextProps(p);
		for (const f of S.M.flags) {
			const ex = expected(f, p, sent);
			const got = flags[f.key];
			const res = ex.check(got);
			expectedLive += ex.p;
			variance += ex.p * (1 - ex.p);
			const kind = f.expect.kind;
			const c = (counts[kind] ||= { kind, flags: 0, pass: 0, fail: 0, lag: 0, aggregate: 0, error: 0 });
			c.flags++; c[res.v]++;
			const [label, badgeKind] = VERDICT_BADGE[res.v];
			rows.push({
				id: f.key, key: f.key, n: f.n, shape: f.shape, team: f.team, serving_method: f.serving_method, kind,
				served: !!got, variant: got ? got.variant_key : "absent",
				preview: got ? preview(got.variant_value) : "",
				bytes: got ? payloadBytes(got.variant_value) : null,
				want: ex.want, must: ex.must, verdictV: res.v, verdict: label, verdictKind: badgeKind, note: res.note,
				got: got || null, expect: f.expect, persona: p.distinct_id,
			});
		}
		for (const [key, got] of Object.entries(flags)) {
			if (S.byKey.has(key)) continue;
			const [label, badgeKind] = VERDICT_BADGE.unknown;
			rows.push({ id: key, key, n: null, shape: "(none)", team: "", serving_method: "", kind: "", served: true, variant: got.variant_key, preview: preview(got.variant_value), bytes: payloadBytes(got.variant_value), want: "", must: false, verdictV: "unknown", verdict: label, verdictKind: badgeKind, note: "", got, expect: null, persona: p.distinct_id });
		}
		const served = Object.keys(flags).length;
		const mismatches = rows.filter((r) => r.verdictV === "fail" || r.verdictV === "error");
		const lag = rows.filter((r) => r.verdictV === "lag");
		return { rows, counts, served, expectedLive, sigma: Math.sqrt(variance), mismatches, lag, persona: p.distinct_id };
	}

	// ---------- boot ----------
	FZ.on("manifest-error", (err) => renderFatal(err));
	if (FZ.manifestError) renderFatal(FZ.manifestError);
	FZ.manifestReady.then((m) => {
		S.M = m;
		for (const f of m.flags) S.byKey.set(f.key, f);
		for (const p of m.personas) S.byId.set(p.distinct_id, p);
		S.persona = FZ.persona;
		setupFilters();
		setupPersonaSelect();
		setupFirstEvent();
		renderPersona();
		renderVerdict();
		// Replay anything mixpanel.js recorded before this script ran.
		if (FZ.mp) onLoaded(FZ.mp);
		FZ.sdkFetches.filter((r) => r.endAt !== null).forEach(onSdkFetch);
	}, () => { /* renderFatal handles it */ });

	FZ.on("loaded", (mp) => { if (S.M) onLoaded(mp); });
	FZ.on("sdk-fetch", (rec) => { if (S.M) onSdkFetch(rec); });
	FZ.on("sdk-fetch-start", () => renderLifecycle());
	FZ.on("flags-resource", () => renderLifecycle());
	FZ.on("exposure-latency", () => renderLifecycle());

	function renderFatal(err) {
		const list = $("verdict-list");
		list.replaceChildren();
		const art = el("article", "wonk-state");
		art.dataset.state = "error";
		art.append(el("h3", null, "The manifest did not load."), el("p", null, `${err.message || err}. Nothing can be verified without it. Check that manifest.json sits next to index.html.`));
		list.append(art);
	}

	let loadedOnce = false;
	function onLoaded(mp) {
		if (loadedOnce) return;
		loadedOnce = true;
		renderProjectLink();
		renderLifecycle();
		// flags ready: check each frame until the SDK reports ready.
		const tick = () => {
			if (mp.flags && mp.flags.are_flags_ready()) { S.readyAt = performance.now(); renderLifecycle(); return; }
			if (performance.now() - FZ.marks.loaded > 60000) return;
			requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
		const probeKey = S.M.flags.find((f) => f.shape === "gate-100").key;
		mp.flags.get_variant(probeKey, null).then(() => { S.firstVariantAt = performance.now(); renderLifecycle(); });
	}

	// ---------- SDK fetch handling ----------
	const sameProps = (a, b) => JSON.stringify(a || {}) === JSON.stringify(b || {});
	const matchesPersona = (rec, p) => rec.context && rec.distinct_id === p.distinct_id && sameProps(rec.context.custom_properties, FZ.contextProps(p));
	const resourceFor = (rec) => FZ.resourceEntries.find((e) => e.name === rec.url) || null;

	function onSdkFetch(rec) {
		if (rec._handled) return;
		rec._handled = true;
		if (!S.sdkVersion) { try { S.sdkVersion = new URL(rec.url).searchParams.get("$lib_version"); } catch (e) { S.sdkVersion = null; } }
		const ok = rec.status === 200 && rec.json && rec.json.flags;
		if (S.proxyOk === null || ok) S.proxyOk = !!ok;
		const served = ok ? Object.keys(rec.json.flags).length : null;
		const p = S.byId.get(rec.distinct_id);
		const exp = ok && p ? verify(rec.json.flags, p) : null;
		rec.served = served;
		S.fetchLog.push({ id: `sdk-${rec.id}`, source: "sdk", persona: rec.distinct_id || "(anonymous)", status: rec.status ?? "error", ms: rec.endAt - rec.startAt, ttfb: rec.headersAt ? rec.headersAt - rec.startAt : null, bytes: rec.bytes, served, parseMs: rec.parseMs, error: rec.error });
		const res = resourceFor(rec);
		FZ.track("FZ Flags Fetched", {
			source: "sdk", fetch_n: rec.id, status: rec.status, error: rec.error || undefined,
			latency_ms: Math.round(rec.endAt - rec.startAt), ttfb_ms: rec.headersAt ? Math.round(rec.headersAt - rec.startAt) : null,
			bytes_transfer: res && res.transferSize ? res.transferSize : null, bytes_decoded: rec.bytes,
			served_count: served, expected_live: exp ? Math.round(exp.expectedLive) : null,
			persona: rec.distinct_id, parse_ms: rec.parseMs === null ? null : Math.round(rec.parseMs * 10) / 10,
		});
		renderLifecycle();

		// Wait until no SDK fetch is pending, then adopt the newest response for the active persona.
		if (FZ.sdkFetches.some((r) => r.endAt === null)) return;
		settleSdk();
	}

	function settleSdk() {
		const matching = FZ.sdkFetches.filter((r) => r.json && r.json.flags && matchesPersona(r, S.persona));
		const latest = matching.sort((a, b) => b.endAt - a.endAt)[0];
		if (latest) adopt(latest.json.flags, latest);
		else if (S.proxyOk === false && !S.served) fallbackDirect();
		checkSdkAgreement();
		renderVerdict();
		if (!S.pageLoadedTracked && FZ.mp) {
			S.pageLoadedTracked = true;
			FZ.track("FZ Page Loaded", { sdk_version: S.sdkVersion, proxy_ok: S.proxyOk, persona: S.persona.distinct_id, sdk_fetches: FZ.sdkFetches.length });
			FZ.mp.start_session_recording();
		}
	}

	async function fallbackDirect() {
		try {
			const r = await directFlags(FZ.DIRECT, S.persona);
			adopt(r.flags, { source: "direct", id: "fallback", distinct_id: S.persona.distinct_id });
		} catch (err) {
			wonk.toast(`Direct fallback failed too: ${err.message}`, "err");
		}
	}

	function adopt(flags, rec) {
		S.served = flags;
		S.servedRec = rec;
		S.verify = verify(flags, S.persona);
		const v = S.verify;
		FZ.track("FZ Verify Run", {
			persona: S.persona.distinct_id, checked: v.rows.filter((r) => r.verdictV !== "aggregate").length,
			mismatches: v.mismatches.length, lag: v.lag.length,
			mismatch_shapes: [...new Set(v.mismatches.map((r) => r.shape))], source: rec.source || "sdk",
		});
		renderInventory();
		renderVerifier();
		renderVerdict();
	}

	function checkSdkAgreement() {
		if (!FZ.mp || !FZ.mp.flags || !S.served || typeof FZ.mp.flags.get_all_variants_sync !== "function") { S.sdkAgreement = null; return; }
		const sdk = FZ.mp.flags.get_all_variants_sync();
		let differ = 0;
		const keys = new Set([...sdk.keys(), ...Object.keys(S.served)]);
		const rows = [];
		for (const k of keys) {
			const a = sdk.get(k), b = S.served[k];
			const av = a ? a.key : "absent", bv = b ? b.variant_key : "absent";
			if (av !== bv) { differ++; rows.push({ id: k, key: k, sdk: av, raw: bv }); }
		}
		S.sdkAgreement = { sdkSize: sdk.size, rawSize: Object.keys(S.served).length, differ, rows };
	}

	// ---------- direct fetch (no SDK, no exposures) ----------
	function hostBase(choice) {
		if (choice === "direct") return FZ.DIRECT;
		return S.proxyOk === false ? FZ.DIRECT : FZ.PROXY;
	}

	async function directFlags(base, p, signal) {
		const ctx = { distinct_id: p.distinct_id, device_id: `fz-diag-${FZ.RUN_ID}`, custom_properties: FZ.contextProps(p) };
		const url = `${base}/flags/?context=${encodeURIComponent(JSON.stringify(ctx))}&token=${FZ.TOKEN}&mp_lib=web`;
		const t0 = performance.now();
		const res = await FZ.nativeFetch(url, { headers: { Authorization: FZ.AUTH }, signal, credentials: "omit" });
		const ttfb = performance.now() - t0;
		const text = await res.text();
		const total = performance.now() - t0;
		const bytes = new TextEncoder().encode(text).length;
		if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`), { status: res.status, ms: total });
		const t1 = performance.now();
		const json = JSON.parse(text);
		const parseMs = performance.now() - t1;
		if (!json.flags) throw new Error("response has no flags object");
		return { flags: json.flags, pending: json.pending_first_time_events || [], ms: total, ttfb, bytes, parseMs, status: res.status, served: Object.keys(json.flags).length };
	}

	// ---------- 1. verdict strip ----------
	const ST = { ok: ["✓", "OK", "ok"], fail: ["✗", "FAIL", "err"], warn: ["△", "CHECK", "warn"], wait: ["…", "WAIT", ""], info: ["·", "MEASURED", "info"] };

	function verdictLine(state, label, value, drill, tip) {
		const [icon, word, kind] = ST[state];
		const li = el("li", `fz-verdict fz-verdict--${state}`);
		const ic = el("span", "fz-verdict-icon", icon);
		ic.setAttribute("aria-hidden", "true");
		const badge = el("span", `wonk-badge${kind ? " wonk-badge--" + kind : ""}`, word);
		const lab = el("span", "fz-verdict-label", label);
		if (tip) { lab.dataset.tip = tip; lab.classList.add("wonk-term"); }
		let val;
		if (drill) {
			val = el("button", "wonk-value-link", value);
			val.type = "button";
			val.addEventListener("click", () => wonkData.inline($("verdict-drill"), { ...drill(), opener: val }));
		} else {
			val = el("span", "fz-mono", value);
		}
		li.append(ic, badge, lab, val);
		return li;
	}

	const FETCH_COLS = [
		{ key: "source", label: "source" }, { key: "persona", label: "persona" }, { key: "status", label: "status" },
		{ key: "ms", label: "latency", type: "num", format: { digits: 0 } }, { key: "ttfb", label: "ttfb", type: "num" },
		{ key: "bytes", label: "bytes", type: "num" }, { key: "served", label: "served", type: "num" },
	];
	const FLAG_COLS = [
		{ key: "key", label: "key", render: (r) => el("span", "fz-key", r.key) },
		{ key: "shape", label: "shape" }, { key: "serving_method", label: "serving method" },
		{ key: "want", label: "expected" }, { key: "variant", label: "got" },
		{ key: "verdict", label: "verdict", type: "badge" }, { key: "note", label: "note" },
	];

	function renderVerdict() {
		const list = $("verdict-list");
		if (!S.M) return;
		list.replaceChildren();
		// proxy
		if (S.proxyOk === null) list.append(verdictLine("wait", "Proxy reachable", "waiting for the first SDK request"));
		else if (S.proxyOk) list.append(verdictLine("ok", "Proxy reachable", "SDK /flags/ answered through the proxy"));
		else list.append(verdictLine("fail", "Proxy reachable", "SDK request failed. Direct runners use api.mixpanel.com", null, "The SDK request through the proxy failed. Sweep, first-event and definitions fall back to api.mixpanel.com."));

		// fetched
		const rec = S.servedRec;
		if (!rec) list.append(verdictLine("wait", "Flags fetched", `persona ${S.persona.distinct_id}`));
		else list.append(verdictLine("ok", "Flags fetched", `${rec.source === "direct" ? "direct fallback" : "SDK request #" + rec.id}, ${fmt.num(Object.keys(S.served).length)} flags${rec.endAt ? ", " + ms(rec.endAt - rec.startAt) : ""}`));

		const v = S.verify;
		if (v) {
			// served vs expected
			const diff = v.served - v.expectedLive;
			const within = Math.abs(diff) <= 3 * v.sigma + 1;
			list.append(verdictLine(within ? "ok" : "warn", "Served vs expected live",
				`${fmt.num(v.served)} served · about ${fmt.num(v.expectedLive)} ± ${fmt.num(3 * v.sigma)} expected`,
				() => ({ title: "Served flags", subtitle: `persona ${v.persona}`, columns: FLAG_COLS, rows: v.rows.filter((r) => r.served), limit: 50, download: "served-flags.csv" }),
				"Expected live = deterministic, test-user, rule and cohort flags this persona must get, plus each percent rollout's probability. The band is 3 standard deviations of the percent part."));
			// mismatches
			const nMis = v.mismatches.length, nLag = v.lag.length;
			list.append(verdictLine(nMis ? "fail" : nLag ? "warn" : "ok", "Mismatches",
				`${fmt.num(nMis)} fail${nLag ? ` · ${fmt.num(nLag)} possible sync lag` : ""}`,
				() => ({ title: "Mismatches", subtitle: `persona ${v.persona}`, columns: FLAG_COLS, rows: [...v.mismatches, ...v.lag], empty: "No mismatches for this persona.", download: "mismatches.csv" })));
		}
		// SDK agreement
		const ag = S.sdkAgreement;
		if (ag) {
			list.append(verdictLine(ag.differ ? "fail" : "ok", "SDK state matches response",
				ag.differ ? `${fmt.num(ag.differ)} flags differ (SDK holds ${fmt.num(ag.sdkSize)}, response has ${fmt.num(ag.rawSize)})` : `${fmt.num(ag.sdkSize)} flags in get_all_variants_sync()`,
				ag.differ ? () => ({ title: "SDK state vs latest response", columns: [{ key: "key", label: "key" }, { key: "sdk", label: "SDK" }, { key: "raw", label: "response" }], rows: ag.rows }) : null,
				"Compares the SDK's in-memory flags with the newest response for this persona. A difference means an older response replaced a newer one."));
		}
		// latency
		const lat = S.fetchLog.filter((f) => typeof f.ms === "number" && !f.error).map((f) => f.ms);
		if (lat.length) {
			list.append(verdictLine("info", "Fetch latency p50 / p90",
				`${ms(quantile(lat, 0.5))} / ${ms(quantile(lat, 0.9))} over ${fmt.num(lat.length)} requests`,
				() => ({ title: "Flags requests on this page", columns: FETCH_COLS, rows: S.fetchLog, sort: { key: "ms", dir: "desc" }, limit: 50, download: "flags-requests.csv" }),
				"Request start to last body byte, measured in the page. Includes SDK, sweep and first-event polls."));
		}
		// response size
		if (rec && rec.bytes) {
			const res = resourceFor(rec);
			const transfer = res && res.transferSize ? kb(res.transferSize) : "hidden (no Timing-Allow-Origin)";
			list.append(verdictLine("info", "Response size", `${kb(rec.bytes)} decoded · transfer ${transfer}`));
		}
		// definitions
		const lastDefs = S.defs.filter((d) => d.count !== null).at(-1);
		if (lastDefs) {
			const stale = lastDefs.count < S.M.count;
			list.append(verdictLine(stale ? "warn" : "ok", "Definitions freshness",
				`${lastDefs.host}: ${fmt.num(lastDefs.count)} of ${fmt.num(S.M.count)} manifest flags`,
				null, "Count from /flags/definitions vs the manifest. Fewer means a stale CDN snapshot."));
		}
		wonk.init(list);
	}

	// ---------- 2. lifecycle ----------
	let lifecycleQueued = false;
	function renderLifecycle() {
		if (lifecycleQueued) return;
		lifecycleQueued = true;
		requestAnimationFrame(() => { lifecycleQueued = false; drawLifecycle(); });
	}

	function drawLifecycle() {
		const m = FZ.marks;
		const spans = [], points = [];
		if (FZ.libEntry) spans.push({ label: "lib.min.js", phase: "page", x1: FZ.libEntry.startTime, x2: FZ.libEntry.responseEnd });
		if (m.manifestEnd) spans.push({ label: "manifest.json", phase: "page", x1: m.manifestStart, x2: m.manifestEnd });
		if (m.loaded) spans.push({ label: "init → loaded", phase: "page", x1: m.initCalled, x2: m.loaded });
		for (const r of FZ.sdkFetches) {
			const name = `flags #${r.id}${r.distinct_id && r.distinct_id !== (S.persona && S.persona.distinct_id) ? " (other id)" : ""}`;
			if (r.headersAt) spans.push({ label: name, phase: "waiting", x1: r.startAt, x2: r.headersAt });
			else spans.push({ label: name, phase: "waiting", x1: r.startAt, x2: performance.now() });
			if (r.headersAt && r.endAt) spans.push({ label: name, phase: "body", x1: r.headersAt, x2: r.endAt });
			const res = resourceFor(r);
			if (res) spans.push({ label: `${name} resource`, phase: "resource", x1: res.startTime, x2: res.responseEnd });
			if (r.sdkJsonAt) points.push({ label: name, phase: "milestone", x: r.sdkJsonAt, what: "JSON parsed by SDK" });
		}
		if (S.readyAt) points.push({ label: "flags ready", phase: "milestone", x: S.readyAt, what: "are_flags_ready() true" });
		if (S.firstVariantAt) points.push({ label: "first get_variant", phase: "milestone", x: S.firstVariantAt, what: "get_variant resolved" });
		const labels = [...new Set([...spans, ...points].map((d) => d.label))];

		const first = FZ.sdkFetches[0];
		$("lifecycle-status").textContent = first ? `${FZ.sdkFetches.length} SDK flags ${FZ.sdkFetches.length === 1 ? "request" : "requests"}` : "waiting for the SDK";

		if (spans.length) {
			wonkCharts.plot($("lifecycle-chart"), (t) => ({
				height: Math.max(140, labels.length * 26 + 50), marginLeft: 150,
				x: { label: "ms since navigation", grid: true },
				y: { domain: labels, label: null },
				color: { domain: ["page", "waiting", "body", "resource", "milestone"], range: t.series.slice(0, 5), legend: true },
				marks: [
					Plot.barX(spans, { y: "label", x1: "x1", x2: "x2", fill: "phase", inset: 3, tip: { format: { x1: (v) => ms(v), x2: (v) => ms(v) } } }),
					Plot.dot(points, { y: "label", x: "x", fill: "phase", r: 5, stroke: t.ground, title: (d) => `${d.what} at ${ms(d.x)}`, tip: true }),
				],
			}), {
				label: "Lifecycle timeline of this page load",
				table: { columns: [{ key: "label", label: "step" }, { key: "phase", label: "phase" }, { key: "x1", label: "start ms", type: "num" }, { key: "x2", label: "end ms", type: "num" }], rows: [...spans, ...points.map((p) => ({ label: `${p.label}: ${p.what}`, phase: p.phase, x1: p.x, x2: p.x }))] },
			});
		}

		const primary = FZ.sdkFetches.find((r) => S.persona && r.distinct_id === S.persona.distinct_id) || first;
		kv($("lifecycle-kv"), [
			["script loaded", FZ.libEntry ? ms(sinceNav(FZ.libEntry.responseEnd)) : "—", "lib.min.js responseEnd (resource timing)"],
			["manifest ready", ms(sinceNav(m.manifestEnd))],
			["init called", ms(sinceNav(m.initCalled))],
			["loaded callback", ms(sinceNav(m.loaded))],
			["flags request start", primary ? ms(sinceNav(primary.startAt)) : "—", "First SDK request for the active persona"],
			["first byte", primary && primary.headersAt ? ms(sinceNav(primary.headersAt)) : "—", "fetch() resolved with headers"],
			["response end", primary && primary.endAt ? ms(sinceNav(primary.endAt)) : "—"],
			["JSON parsed", primary && primary.sdkJsonAt ? ms(sinceNav(primary.sdkJsonAt)) : "—", "The SDK's res.json() resolved"],
			["are_flags_ready() true", ms(sinceNav(S.readyAt))],
			["first get_variant resolved", ms(sinceNav(S.firstVariantAt))],
		]);

		// latency, three ways
		const wrapper = primary && primary.endAt ? primary.endAt - primary.startAt : null;
		const ttfb = primary && primary.headersAt ? primary.headersAt - primary.startAt : null;
		const res = primary ? resourceFor(primary) : null;
		const sdkLat = FZ.sdkLatencyFromExposure;
		kv($("latency-kv"), [
			["page: start → last byte", ms(wrapper), "Measured around the SDK's fetch call"],
			["page: start → first byte", ms(ttfb)],
			["SDK: Variant fetch latency", sdkLat === null ? "— (no exposure yet)" : ms(sdkLat), "From the first $experiment_started event"],
			["resource timing duration", res ? ms(res.duration) : "—", "PerformanceResourceTiming startTime → responseEnd"],
			["resource requestStart / responseStart", res ? (res.responseStart ? `${ms(res.requestStart)} / ${ms(res.responseStart)}` : "hidden (no Timing-Allow-Origin)") : "—"],
			["JSON.parse of the body", primary && primary.parseMs !== null ? ms(Math.round(primary.parseMs * 10) / 10) : "—"],
		]);
		const note = $("latency-note");
		if (sdkLat !== null && wrapper !== null && ttfb !== null) {
			const nearTtfb = Math.abs(sdkLat - ttfb) < Math.abs(sdkLat - wrapper);
			note.textContent = nearTtfb
				? `Finding: the SDK's latency (${ms(sdkLat)}) is close to first byte. It leaves out about ${ms(Math.round(wrapper - sdkLat))} of body download and parse.`
				: `The SDK's latency (${ms(sdkLat)}) is close to the full request (${ms(Math.round(wrapper))}).`;
		} else note.textContent = "";

		// fetch table
		const host = $("sdk-fetch-table");
		const rows = FZ.sdkFetches.map((r) => ({ id: r.id, n: r.id, persona: r.distinct_id || "(none)", props: r.context && r.context.custom_properties ? (S.persona && sameProps(r.context.custom_properties, FZ.contextProps(S.persona)) ? "active persona" : "other") : "none", status: r.status ?? (r.endAt ? "error" : "pending"), ms: r.endAt ? r.endAt - r.startAt : null, ttfb: r.headersAt ? r.headersAt - r.startAt : null, bytes: r.bytes, served: r.json && r.json.flags ? Object.keys(r.json.flags).length : null }));
		if (host.wonkDataTable) host.wonkDataTable.setRows(rows);
		else wonkData.table(host, { columns: [{ key: "n", label: "#", type: "num" }, { key: "persona", label: "distinct_id" }, { key: "props", label: "custom_properties", hint: "Whether the request carried the active persona's properties" }, { key: "status", label: "status" }, { key: "ms", label: "latency ms", type: "num" }, { key: "ttfb", label: "ttfb ms", type: "num" }, { key: "bytes", label: "bytes", type: "num" }, { key: "served", label: "served", type: "num" }], rows, caption: "SDK flags requests", captionHidden: true, empty: "No SDK flags request yet." });
	}
	FZ.on("exposure-latency", () => { renderLifecycle(); });

	// ---------- 3. served inventory ----------
	function setupFilters() {
		const fill = (id, values) => { const s = $(id); for (const v of values) s.append(new Option(v, v)); };
		fill("f-shape", Object.keys(S.M.shapes));
		fill("f-team", [...new Set(S.M.flags.map((f) => f.team))].sort());
		fill("f-method", [...new Set(S.M.flags.map((f) => f.serving_method))].sort());
		const vs = $("f-verdict");
		for (const [v, [label]] of Object.entries(VERDICT_BADGE)) vs.append(new Option(label, v));
		for (const id of ["f-status", "f-shape", "f-team", "f-method", "f-verdict"]) $(id).addEventListener("change", () => { S.inv.page = 0; renderInventory(); });
		let timer;
		$("f-search").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => { S.inv.page = 0; renderInventory(); }, 150); });
	}

	const INV_COLS = [
		{ key: "n", label: "#", type: "num", hint: "Flag number in the manifest" },
		{ key: "key", label: "key", render: (r) => el("span", "fz-key", r.key) },
		{ key: "shape", label: "shape" }, { key: "team", label: "team" },
		{ key: "serving_method", label: "serving method" },
		{ key: "variant", label: "variant" },
		{ key: "preview", label: "value", sortable: false },
		{ key: "bytes", label: "payload B", type: "num", hint: "UTF-8 bytes of variant_value as JSON" },
		{ key: "want", label: "expected" },
		{ key: "verdict", label: "verdict", type: "badge", value: (r) => r.verdictV },
	];

	function sortRows(rows, { key, dir }) {
		const col = INV_COLS.find((c) => c.key === key);
		const num = col && col.type === "num" || key === "n";
		const val = (r) => (col && col.value ? col.value(r) : r[key]);
		const mul = dir === "desc" ? -1 : 1;
		return [...rows].sort((a, b) => {
			const x = val(a), y = val(b);
			if (x === null || x === undefined) return 1;
			if (y === null || y === undefined) return -1;
			const c = num ? x - y : String(x).localeCompare(String(y));
			return c ? c * mul : (a.n || 0) - (b.n || 0);
		});
	}

	function filteredInventory() {
		if (!S.verify) return [];
		const st = $("f-status").value, shape = $("f-shape").value, team = $("f-team").value, method = $("f-method").value, verdict = $("f-verdict").value, q = $("f-search").value.trim();
		return S.verify.rows.filter((r) =>
			(st === "all" || (st === "served" ? r.served : !r.served)) &&
			(!shape || r.shape === shape) && (!team || r.team === team) && (!method || r.serving_method === method) &&
			(!verdict || r.verdictV === verdict) && (!q || r.key.includes(q)));
	}

	function invDetail(row) {
		return () => {
			const pre = el("pre", "wonk-pre");
			pre.textContent = JSON.stringify({ key: row.key, expect: row.expect, served: row.got, note: row.note || undefined }, null, 2);
			return pre;
		};
	}

	function renderInventory() {
		const host = $("inventory-table");
		const rows = sortRows(filteredInventory(), S.inv.sort);
		S.inv.rows = rows;
		const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
		S.inv.page = Math.min(S.inv.page, pages - 1);
		const start = S.inv.page * PAGE_SIZE;
		const pageRows = rows.slice(start, start + PAGE_SIZE);
		$("inventory-count").textContent = S.verify ? `${fmt.num(S.verify.served)} served · ${fmt.num(rows.length)} match the filters` : "—";
		$("inventory-range").textContent = rows.length ? `rows ${fmt.num(start + 1)}–${fmt.num(start + pageRows.length)} of ${fmt.num(rows.length)}` : "";
		if (host.wonkDataTable) {
			host.wonkDataTable.setRows(pageRows);
		} else {
			host.addEventListener("wonk-data:sort", (e) => {
				if (e.target !== host) return;
				S.inv.sort = e.detail;
				S.inv.page = 0;
				renderInventory();
			});
			wonkData.table(host, { columns: INV_COLS, rows: pageRows, rowKey: "id", sort: S.inv.sort, caption: "Served inventory", captionHidden: true, detail: invDetail, foldKey: (r) => r.key, empty: "No flags match these filters." });
		}
		renderPager(pages);
		renderMissing();
	}

	function renderPager(pages) {
		const nav = $("inventory-pages");
		nav.replaceChildren();
		const btn = (label, page, opts = {}) => {
			const b = el("button", "wonk-page", label);
			b.type = "button";
			if (opts.current) b.setAttribute("aria-current", "page");
			if (opts.disabled) b.disabled = true;
			if (opts.aria) b.setAttribute("aria-label", opts.aria);
			b.addEventListener("click", () => { S.inv.page = page; renderInventory(); $("inventory").scrollIntoView({ block: "start" }); });
			nav.append(b);
		};
		const cur = S.inv.page;
		btn("←", cur - 1, { disabled: cur === 0, aria: "Previous page" });
		const set = new Set([0, pages - 1, cur - 2, cur - 1, cur, cur + 1, cur + 2].filter((p) => p >= 0 && p < pages));
		let prev = -1;
		for (const p of [...set].sort((a, b) => a - b)) {
			if (p - prev > 1) nav.append(el("span", "fz-gap", "…"));
			btn(String(p + 1), p, { current: p === cur });
			prev = p;
		}
		btn("→", cur + 1, { disabled: cur >= pages - 1, aria: "Next page" });
	}

	function groupCount(rows, key) {
		const m = new Map();
		for (const r of rows) {
			const g = m.get(r[key]) || { id: r[key], group: r[key], expected: 0, missing: 0, served: 0, flags: 0 };
			g.flags++;
			if (r.must) g.expected++;
			if (r.must && !r.served) g.missing++;
			if (r.served) g.served++;
			m.set(r[key], g);
		}
		return [...m.values()];
	}

	function renderMissing() {
		if (!S.verify) return;
		const manifestRows = S.verify.rows.filter((r) => r.expect);
		const cols = (label) => [{ key: "group", label }, { key: "expected", label: "must serve", type: "num" }, { key: "missing", label: "missing", type: "num" }];
		const mk = (id, key, label) => {
			const rows = groupCount(manifestRows, key).filter((g) => g.expected > 0);
			const host = $(id);
			if (host.wonkDataTable) host.wonkDataTable.setRows(rows);
			else wonkData.table(host, { columns: cols(label), rows, sort: { key: "missing", dir: "desc" }, caption: `Expected but not served, by ${label}`, captionHidden: true });
		};
		mk("missing-by-shape", "shape", "shape");
		mk("missing-by-method", "serving_method", "serving method");
		const byMethod = groupCount(manifestRows, "serving_method").map((g) => ({ ...g, share: g.served / g.flags }));
		const host = $("by-method");
		if (host.wonkDataTable) host.wonkDataTable.setRows(byMethod);
		else wonkData.table(host, { columns: [{ key: "group", label: "serving method" }, { key: "flags", label: "flags in manifest", type: "num" }, { key: "served", label: "served", type: "num" }, { key: "share", label: "served share", type: "pct", format: { digits: 1 } }, { key: "expected", label: "must serve", type: "num" }, { key: "missing", label: "missing", type: "num" }], rows: byMethod, sort: { key: "flags", dir: "desc" }, caption: "Served by serving method", captionHidden: true });
	}

	// ---------- 4. persona switcher ----------
	function setupPersonaSelect() {
		const sel = $("persona-select");
		const qa = el("optgroup"); qa.label = "QA users";
		const users = el("optgroup"); users.label = "Personas";
		for (const p of S.M.personas) {
			const o = new Option(`${p.distinct_id} · ${p.properties.plan} · ${p.properties.country} · ${p.properties.platform}`, p.distinct_id);
			(S.M.qaUsers.includes(p.distinct_id) ? qa : users).append(o);
		}
		sel.append(qa, users);
		sel.value = S.persona.distinct_id;
		sel.addEventListener("change", () => renderPersonaProps(S.byId.get(sel.value)));
		$("persona-apply").addEventListener("click", () => applyPersona(sel.value));
		const dm = $("date-mode");
		dm.value = FZ.dateMode;
		dm.addEventListener("change", () => {
			FZ.dateMode = dm.value;
			try { localStorage.setItem("fz-dates", dm.value); } catch (e) { /* storage blocked: the choice lasts for this page only */ }
			if (FZ.mp) FZ.mp.register({ fz_date_mode: dm.value });
			applyPersona(S.persona.distinct_id);
		});
	}

	function renderPersonaProps(p) {
		kv($("persona-props"), Object.entries(FZ.contextProps(p)).map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") || "(none)" : String(v)]));
	}

	const PROFILE_BASE = "https://mixpanel.com/project/4081152/view/4577838/app/profile#distinct_id=";
	function renderProjectLink() {
		const a = $("open-project");
		if (!a.hasAttribute("href")) return; // ?token= override: the link would point at the wrong project
		const id = FZ.mp && FZ.mp.get_distinct_id ? FZ.mp.get_distinct_id() : null;
		if (id) {
			a.href = PROFILE_BASE + encodeURIComponent(id);
			a.dataset.tip = `Open the Mixpanel profile of ${id}`;
		} else {
			a.href = "https://mixpanel.com/project/4081152";
			a.dataset.tip = "Open the Mixpanel project";
		}
	}

	function renderPersona() {
		renderProjectLink();
		$("persona-label").textContent = `persona: ${S.persona.distinct_id}`;
		$("persona-status").textContent = S.M.qaUsers.includes(S.persona.distinct_id) ? "QA user" : "persona";
		renderPersonaProps(S.persona);
	}

	function whenSettled(recs, timeoutMs = 60000) {
		return new Promise((resolve) => {
			const t0 = performance.now();
			const check = () => {
				if (recs().every((r) => r.endAt !== null) || performance.now() - t0 > timeoutMs) return resolve();
				setTimeout(check, 25);
			};
			check();
		});
	}

	async function applyPersona(id) {
		if (!FZ.mp) { wonk.toast("The SDK has not loaded yet.", "warn"); return; }
		const p = S.byId.get(id);
		const btn = $("persona-apply");
		btn.disabled = true;
		$("persona-status").textContent = "applying";
		S.persona = p;
		try { localStorage.setItem("fz-persona", id); } catch (e) { /* storage blocked: the choice lasts for this page only */ }
		const url = new URL(location.href); url.searchParams.set("persona", id); history.replaceState(null, "", url);
		renderPersona();

		const before = FZ.sdkFetches.length;
		const t0 = performance.now();
		FZ.mp.identify(id);
		renderProjectLink();
		try {
			await FZ.mp.flags.update_context({ custom_properties: FZ.contextProps(p) }, { replace: true });
		} catch (err) {
			wonk.toast(`update_context failed: ${err.message || err}`, "err");
		}
		await whenSettled(() => FZ.sdkFetches.slice(before));
		const t1 = performance.now();
		const recs = FZ.sdkFetches.slice(before);
		const match = recs.filter((r) => matchesPersona(r, p) && r.json).sort((a, b) => b.endAt - a.endAt)[0];
		settleSdk();
		const ag = S.sdkAgreement;
		kv($("persona-result"), [
			["switch time", ms(Math.round(t1 - t0)), "Click to the last flags response this switch started"],
			["requests started", fmt.num(recs.length), "identify() with a new id and update_context() each start a request"],
			["matching request latency", match ? ms(Math.round(match.endAt - match.startAt)) : "—"],
			["served", match ? fmt.num(Object.keys(match.json.flags).length) : "—"],
			["SDK state", ag ? (ag.differ ? `${fmt.num(ag.differ)} flags differ from the newest response` : "matches the newest response") : "—"],
			["mismatches", S.verify ? fmt.num(S.verify.mismatches.length) : "—"],
		]);
		$("persona-status").textContent = `applied in ${ms(Math.round(t1 - t0))}`;
		btn.disabled = false;
		renderLifecycle();
	}

	// ---------- 5. verifier ----------
	function renderVerifier() {
		const v = S.verify;
		if (!v) return;
		$("verifier-status").textContent = `${S.persona.distinct_id} · ${fmt.num(v.mismatches.length)} mismatches`;
		const sum = $("verifier-summary");
		const rows = Object.values(v.counts).map((c) => ({ id: c.kind, ...c }));
		if (sum.wonkDataTable) sum.wonkDataTable.setRows(rows);
		else wonkData.table(sum, { columns: [{ key: "kind", label: "expect kind" }, { key: "flags", label: "flags", type: "num" }, { key: "pass", label: "pass", type: "num" }, { key: "fail", label: "fail", type: "num" }, { key: "lag", label: "sync lag", type: "num" }, { key: "aggregate", label: "aggregate", type: "num" }, { key: "error", label: "error", type: "num" }], rows, sort: { key: "flags", dir: "desc" }, caption: "Verdicts by expect kind", captionHidden: true });
		const mis = $("verifier-mismatches");
		const mrows = [...v.mismatches, ...v.lag];
		if (mis.wonkDataTable) mis.wonkDataTable.setRows(mrows);
		else wonkData.table(mis, { columns: FLAG_COLS, rows: mrows, rowKey: "id", limit: 50, caption: "Mismatches", captionHidden: true, detail: invDetail, empty: "No mismatches for this persona." });
	}

	// ---------- 6. sweep ----------
	let sweepAbort = null;
	$("sweep-run").addEventListener("click", runSweep);
	$("sweep-stop").addEventListener("click", () => sweepAbort && sweepAbort.abort());

	async function runSweep() {
		if (!S.M) return;
		const N = Math.max(1, Math.min(S.M.personas.length, Number($("sweep-n").value) || 100));
		const C = Math.max(1, Math.min(16, Number($("sweep-c").value) || 4));
		const base = hostBase($("sweep-host").value);
		const personas = S.M.personas.slice(0, N);
		sweepAbort = new AbortController();
		const signal = sweepAbort.signal;
		$("sweep-run").disabled = true; $("sweep-stop").disabled = false;
		$("sweep-status").textContent = "running";
		$("sweep-progress").max = N; $("sweep-progress").value = 0;

		const results = [], mismatchRows = [], errors = [];
		const levels = new Map(); // `${series}|${rollout}` → {series, expected, n, served}
		const arms = new Map(); // key → {variants, total, counts}
		let next = 0, done = 0;
		const t0 = performance.now();
		const bump = (series, r, servedOne) => {
			const k = `${series}|${r}`;
			const L = levels.get(k) || { series, expected: r, n: 0, served: 0 };
			L.n++; if (servedOne) L.served++;
			levels.set(k, L);
		};

		async function worker() {
			while (next < personas.length && !signal.aborted) {
				const p = personas[next++];
				try {
					const r = await directFlags(base, p, signal);
					const v = verify(r.flags, p);
					const sent = FZ.contextProps(p);
					results.push({ id: p.distinct_id, persona: p.distinct_id, ms: r.ms, ttfb: r.ttfb, bytes: r.bytes, served: r.served, mismatches: v.mismatches.length, parseMs: r.parseMs });
					S.fetchLog.push({ id: `sweep-${p.distinct_id}-${results.length}`, source: "sweep", persona: p.distinct_id, status: r.status, ms: r.ms, ttfb: r.ttfb, bytes: r.bytes, served: r.served });
					if (mismatchRows.length < 1000) mismatchRows.push(...v.mismatches.slice(0, 1000 - mismatchRows.length).map((m) => ({ ...m, id: `${p.distinct_id}|${m.key}` })));
					for (const f of S.M.flags) {
						const e = f.expect, got = r.flags[f.key];
						if (e.kind === "percent") {
							bump(f.shape, e.rollout, !!got);
							if (f.shape === "multivariate" && got) {
								const a = arms.get(f.key) || { key: f.key, variants: e.variants, total: 0, counts: {} };
								a.total++; a.counts[got.variant_key] = (a.counts[got.variant_key] || 0) + 1;
								arms.set(f.key, a);
							}
						} else if (e.kind === "rule-percent") {
							let match = false;
							try { match = FZLogic.truthy(e.rule, sent); } catch (err) { match = false; }
							if (match) bump("rule-percent (rule matched)", e.rollout, !!got);
						}
					}
					FZ.track("FZ Flags Fetched", { source: "direct", runner: "sweep", latency_ms: Math.round(r.ms), ttfb_ms: Math.round(r.ttfb), bytes_transfer: null, bytes_decoded: r.bytes, served_count: r.served, expected_live: Math.round(v.expectedLive), persona: p.distinct_id, parse_ms: Math.round(r.parseMs * 10) / 10, host: base === FZ.PROXY ? "proxy" : "direct" });
				} catch (err) {
					if (signal.aborted) break;
					errors.push({ id: p.distinct_id, persona: p.distinct_id, error: err.message || String(err) });
				}
				done++;
				$("sweep-progress").value = done;
				$("sweep-progress-label").textContent = `${fmt.num(done)} / ${fmt.num(N)} personas · ${fmt.num(errors.length)} errors · ${ms(Math.round(performance.now() - t0))} elapsed`;
			}
		}
		await Promise.all(Array.from({ length: C }, worker));
		const stopped = signal.aborted;
		sweepAbort = null;
		$("sweep-run").disabled = false; $("sweep-stop").disabled = true;

		const lat = results.map((r) => r.ms);
		const summary = {
			personas: results.length, concurrency: C,
			p50_ms: Math.round(quantile(lat, 0.5)), p90_ms: Math.round(quantile(lat, 0.9)), p99_ms: Math.round(quantile(lat, 0.99)), max_ms: Math.round(Math.max(...lat)),
			mean_bytes: Math.round(results.reduce((s, r) => s + r.bytes, 0) / (results.length || 1)),
			mismatches: results.reduce((s, r) => s + r.mismatches, 0), errors: errors.length,
			host: base === FZ.PROXY ? "proxy" : "direct", stopped,
		};
		if (results.length) FZ.track("FZ Sweep Completed", summary);
		$("sweep-status").textContent = `${stopped ? "stopped" : "done"} · ${fmt.num(results.length)} personas`;

		const levelRows = [...levels.values()].map((L) => {
			const [lo, hi] = wilson(L.served, L.n);
			return { id: `${L.series}|${L.expected}`, ...L, observed: L.served / L.n, lo, hi, inside: L.expected >= lo && L.expected <= hi ? "inside" : "outside" };
		}).sort((a, b) => a.expected - b.expected);
		const armRows = [];
		const totalSplit = (v) => Object.values(v).reduce((s, x) => s + x, 0);
		for (const a of arms.values()) {
			const tot = totalSplit(a.variants);
			for (const [arm, split] of Object.entries(a.variants)) armRows.push({ id: `${a.key}|${arm}`, key: a.key, arm, expected: split / tot, observed: (a.counts[arm] || 0) / a.total, n: a.total });
		}
		const mad = armRows.length ? armRows.reduce((s, r) => s + Math.abs(r.observed - r.expected), 0) / armRows.length : null;
		const outside = levelRows.filter((r) => r.inside === "outside");

		const link = (text, drill) => {
			const b = el("button", "wonk-value-link", text);
			b.type = "button";
			b.addEventListener("click", () => wonkData.inline($("sweep-drill"), { ...drill(), opener: b }));
			return b;
		};
		kv($("sweep-kv"), [
			["host", summary.host],
			["requests", link(fmt.num(results.length), () => ({ title: "Sweep requests", columns: [{ key: "persona", label: "persona" }, { key: "ms", label: "latency ms", type: "num" }, { key: "ttfb", label: "ttfb ms", type: "num" }, { key: "bytes", label: "bytes", type: "num" }, { key: "served", label: "served", type: "num" }, { key: "mismatches", label: "mismatches", type: "num" }], rows: results, sort: { key: "ms", dir: "desc" }, limit: 50, download: "sweep.csv" }))],
			["latency p50 / p90 / p99 / max", `${ms(summary.p50_ms)} / ${ms(summary.p90_ms)} / ${ms(summary.p99_ms)} / ${ms(summary.max_ms)}`],
			["mean response", kb(summary.mean_bytes)],
			["mismatches", link(fmt.num(summary.mismatches), () => ({ title: "Sweep mismatches", subtitle: mismatchRows.length >= 1000 ? "first 1,000" : "", columns: [{ key: "persona", label: "persona" }, ...FLAG_COLS], rows: mismatchRows, limit: 50, empty: "No mismatches.", download: "sweep-mismatches.csv" }))],
			["errors", link(fmt.num(errors.length), () => ({ title: "Sweep errors", columns: [{ key: "persona", label: "persona" }, { key: "error", label: "error" }], rows: errors, empty: "No errors." }))],
			["rollout levels outside 95% interval", link(`${fmt.num(outside.length)} of ${fmt.num(levelRows.length)}`, () => ({ title: "Rollout levels", columns: [{ key: "series", label: "series" }, { key: "expected", label: "expected", type: "pct" }, { key: "observed", label: "observed", type: "pct", format: { digits: 1 } }, { key: "lo", label: "95% low", type: "pct", format: { digits: 1 } }, { key: "hi", label: "95% high", type: "pct", format: { digits: 1 } }, { key: "n", label: "flag × persona", type: "num" }, { key: "inside", label: "expected is" }], rows: levelRows }))],
			["multivariate arm deviation (mean abs)", mad === null ? "—" : fmt.pct(mad, { digits: 1 })],
		]);
		drawSweepCharts(results, levelRows, armRows);
		renderVerdict();
	}

	function drawSweepCharts(results, levelRows, armRows) {
		if (!results.length) return;
		wonkCharts.plot($("chart-latency"), (t) => ({
			height: 220, y: { grid: true, label: "requests" }, x: { label: "latency ms" },
			marks: [Plot.rectY(results, Plot.binX({ y: "count" }, { x: "ms", fill: t.series[0], inset: 1, tip: true })), Plot.ruleY([0], { stroke: t.grid })],
		}), { label: "Sweep latency distribution", table: { columns: [{ key: "persona", label: "persona" }, { key: "ms", label: "latency ms", type: "num" }], rows: results, sort: { key: "ms", dir: "desc" }, limit: 50 } });

		wonkCharts.plot($("chart-bytes"), (t) => ({
			height: 220, y: { grid: true, label: "response bytes", tickFormat: (v) => fmt.compact(v) }, x: { label: "flags served" },
			marks: [Plot.dot(results, { x: "served", y: "bytes", r: 4, fill: t.series[1], fillOpacity: 0.8, title: (d) => `${d.persona}: ${fmt.num(d.served)} flags, ${kb(d.bytes)}`, tip: true })],
		}), { label: "Response bytes vs flags served", table: { columns: [{ key: "persona", label: "persona" }, { key: "served", label: "served", type: "num" }, { key: "bytes", label: "bytes", type: "num" }], rows: results, limit: 50 } });

		const series = [...new Set(levelRows.map((r) => r.series))];
		wonkCharts.plot($("chart-rollout"), (t) => ({
			height: 280, x: { label: "expected share", domain: [0, 1], tickFormat: (v) => fmt.pct(v) }, y: { label: "observed share", domain: [0, 1], grid: true, tickFormat: (v) => fmt.pct(v) },
			color: { domain: series, range: t.series.slice(0, series.length), legend: true },
			marks: [
				Plot.line([[0, 0], [1, 1]], { stroke: t.muted, strokeDasharray: "4 3", z: null }),
				Plot.ruleX(levelRows, { x: "expected", y1: "lo", y2: "hi", stroke: "series", strokeWidth: 2 }),
				Plot.dot(levelRows, { x: "expected", y: "observed", fill: "series", r: 5, stroke: t.ground, title: (d) => `${d.series} @ ${fmt.pct(d.expected)}: observed ${fmt.pct(d.observed, { digits: 1 })} (n ${fmt.num(d.n)})`, tip: true }),
			],
		}), { label: "Observed vs expected rollout share", table: { columns: [{ key: "series", label: "series" }, { key: "expected", label: "expected", type: "pct" }, { key: "observed", label: "observed", type: "pct", format: { digits: 1 } }, { key: "lo", label: "95% low", type: "pct", format: { digits: 1 } }, { key: "hi", label: "95% high", type: "pct", format: { digits: 1 } }, { key: "n", label: "n", type: "num" }], rows: levelRows } });

		if (armRows.length) {
			wonkCharts.plot($("chart-arms"), (t) => ({
				height: 280, x: { label: "expected arm share", domain: [0, 0.6], tickFormat: (v) => fmt.pct(v) }, y: { label: "observed arm share", domain: [0, 1], grid: true, tickFormat: (v) => fmt.pct(v) },
				marks: [
					Plot.line([[0, 0], [0.6, 0.6]], { stroke: t.muted, strokeDasharray: "4 3", z: null }),
					Plot.dot(armRows, { x: "expected", y: "observed", r: 3, fill: t.series[2], fillOpacity: 0.5, title: (d) => `${d.key.slice(0, 32)} ${d.arm}: ${fmt.pct(d.observed, { digits: 1 })} vs ${fmt.pct(d.expected, { digits: 1 })} (n ${d.n})`, tip: true }),
				],
			}), { label: "Multivariate arm shares", table: { columns: [{ key: "key", label: "flag" }, { key: "arm", label: "arm" }, { key: "expected", label: "expected", type: "pct", format: { digits: 1 } }, { key: "observed", label: "observed", type: "pct", format: { digits: 1 } }, { key: "n", label: "n", type: "num" }], rows: armRows, limit: 50 } });
		}
	}

	// ---------- 7. first-event test ----------
	let feStop = null;
	function setupFirstEvent() {
		const sel = $("fe-trigger");
		for (const ev of S.M.triggerEvents) {
			const deps = S.M.flags.filter((f) => f.expect.kind === "first-event" && f.expect.event === ev);
			const filtered = deps.filter((f) => f.expect.propertyFilter).length;
			sel.append(new Option(`${ev} · ${deps.length} flags (${filtered} need source)`, ev));
		}
		$("fe-run").addEventListener("click", runFirstEvent);
		$("fe-stop").addEventListener("click", () => feStop && feStop());
	}

	async function runFirstEvent() {
		if (!FZ.mp) { wonk.toast("The SDK has not loaded yet.", "warn"); return; }
		const ev = $("fe-trigger").value, withSource = $("fe-source").checked;
		const p = S.persona, base = hostBase("proxy");
		const deps = S.M.flags.filter((f) => f.expect.kind === "first-event" && f.expect.event === ev);
		let stopped = false;
		feStop = () => { stopped = true; };
		$("fe-run").disabled = true; $("fe-stop").disabled = false;
		$("fe-status").textContent = "baseline";

		const rows = deps.map((f) => ({ id: f.key, key: f.key, filter: f.expect.propertyFilter ? "source = diagnostics" : "none", duration: f.expect.duration || "default", shouldFlip: !f.expect.propertyFilter || withSource, before: "—", sdk: "—", server: "waiting", seconds: null, verdict: "…", verdictKind: "" }));
		const host = $("fe-table");
		const cols = [{ key: "key", label: "flag", render: (r) => el("span", "fz-key", r.key) }, { key: "filter", label: "property filter" }, { key: "duration", label: "duration", hint: "How long the flag stays On after the trigger" }, { key: "expectText", label: "expected" }, { key: "before", label: "before" }, { key: "sdk", label: "SDK after track" }, { key: "server", label: "/flags/ now" }, { key: "seconds", label: "seconds to flip", type: "num", format: { digits: 1 } }, { key: "verdict", label: "verdict", type: "badge" }];
		const paint = () => {
			rows.forEach((r) => { r.expectText = r.shouldFlip ? "flips to On" : "stays absent"; });
			if (host.wonkDataTable) host.wonkDataTable.setRows(rows);
			else wonkData.table(host, { columns: cols, rows, caption: "First-event flags", captionHidden: true });
		};
		paint();
		try {
			const b = await directFlags(base, p);
			rows.forEach((r) => { r.before = b.flags[r.key] ? b.flags[r.key].variant_key : "absent"; });
		} catch (err) {
			wonk.toast(`Baseline fetch failed: ${err.message}`, "err");
		}
		paint();

		const tTrack = performance.now();
		FZ.track(ev, withSource ? { source: "diagnostics" } : {});
		$("fe-status").textContent = `tracked ${ev}, polling`;
		setTimeout(() => {
			const sdk = FZ.mp.flags.get_all_variants_sync();
			rows.forEach((r) => { const g = sdk.get(r.key); r.sdk = g ? g.key : "absent"; });
			paint();
		}, 1000);

		const deadline = tTrack + 5 * 60000;
		while (!stopped && performance.now() < deadline) {
			const pending = rows.filter((r) => r.shouldFlip && r.seconds === null);
			if (!pending.length && performance.now() - tTrack > 10000) break;
			try {
				const r = await directFlags(base, p);
				S.fetchLog.push({ id: `fe-${Date.now()}`, source: "first-event poll", persona: p.distinct_id, status: r.status, ms: r.ms, ttfb: r.ttfb, bytes: r.bytes, served: r.served });
				const now = (performance.now() - tTrack) / 1000;
				for (const row of rows) {
					const g = r.flags[row.key];
					row.server = g ? g.variant_key : "absent";
					if (g && g.variant_key === "On" && row.seconds === null && row.before !== "On") {
						row.seconds = now;
						FZ.track("FZ First Event Flip", { trigger: ev, flag_key: row.key, seconds_to_flip: Math.round(now * 10) / 10, with_source: withSource, persona: p.distinct_id });
					}
				}
			} catch (err) {
				$("fe-status").textContent = `poll failed: ${err.message}`;
			}
			paint();
			$("fe-status").textContent = `polling · ${fmt.num((performance.now() - tTrack) / 1000)} s`;
			await new Promise((res) => setTimeout(res, 2000));
		}
		const waited = (performance.now() - tTrack) / 1000;
		for (const row of rows) {
			if (row.before === "On") { row.verdict = "△ already On"; row.verdictKind = "warn"; continue; }
			if (row.shouldFlip) {
				if (row.seconds !== null) { row.verdict = "✓ flipped"; row.verdictKind = "ok"; }
				else {
					row.verdict = stopped ? "· stopped" : "✗ timed out"; row.verdictKind = stopped ? "" : "err";
					if (!stopped) FZ.track("FZ First Event Flip", { trigger: ev, flag_key: row.key, timed_out: true, seconds_waited: Math.round(waited), with_source: withSource, persona: p.distinct_id });
				}
			} else {
				const flipped = row.server === "On";
				row.verdict = flipped ? "✗ flipped without filter match" : "✓ stayed absent"; row.verdictKind = flipped ? "err" : "ok";
			}
		}
		paint();
		const flipped = rows.filter((r) => r.seconds !== null).length;
		$("fe-status").textContent = `${stopped ? "stopped" : "done"} · ${fmt.num(flipped)} flipped · waited ${fmt.num(waited)} s`;
		$("fe-run").disabled = false; $("fe-stop").disabled = true;
		feStop = null;
	}

	// ---------- 8. definitions ----------
	let defsTimer = null;
	$("defs-run").addEventListener("click", fetchDefinitions);
	$("defs-watch").addEventListener("change", (e) => {
		clearInterval(defsTimer); defsTimer = null;
		if (e.target.checked) { fetchDefinitions(); defsTimer = setInterval(fetchDefinitions, 10000); }
	});

	async function fetchOneDefs(hostName) {
		const base = hostName === "direct" ? FZ.DIRECT : hostBase("proxy");
		const t0 = performance.now();
		const at = new Date();
		try {
			const res = await FZ.nativeFetch(`${base}/flags/definitions?token=${FZ.TOKEN}`, { headers: { Authorization: FZ.AUTH }, credentials: "omit" });
			const text = await res.text();
			const latency = performance.now() - t0;
			const bytes = new TextEncoder().encode(text).length;
			if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
			const json = JSON.parse(text);
			const list = Array.isArray(json.flags) ? json.flags : Object.values(json.flags || {});
			const keys = new Set(list.map((f) => f.key));
			const inManifest = S.M.flags.filter((f) => keys.has(f.key)).length;
			const servedNotDefined = S.served ? Object.keys(S.served).filter((k) => !keys.has(k)).length : null;
			const row = { id: `${hostName}-${at.getTime()}`, at: at.toISOString().slice(11, 19), t: at, host: hostName === "direct" ? "api.mixpanel.com" : (base === FZ.PROXY ? "proxy" : "api.mixpanel.com (fallback)"), ms: latency, bytes, count: list.length, enabled: list.filter((f) => f.status === "enabled").length, inManifest, servedNotDefined, error: "" };
			FZ.track("FZ Definitions Fetched", { count: row.count, bytes, latency_ms: Math.round(latency), host: row.host, in_manifest: inManifest, served_not_defined: servedNotDefined });
			return row;
		} catch (err) {
			return { id: `${hostName}-${at.getTime()}`, at: at.toISOString().slice(11, 19), t: at, host: hostName, ms: performance.now() - t0, bytes: null, count: null, enabled: null, inManifest: null, servedNotDefined: null, error: err.message || String(err) };
		}
	}

	async function fetchDefinitions() {
		if (!S.M) return;
		const choice = $("defs-host").value;
		$("defs-status").textContent = "fetching";
		const hosts = choice === "both" ? ["proxy", "direct"] : [choice];
		const rows = await Promise.all(hosts.map(fetchOneDefs));
		S.defs.push(...rows);
		const last = rows.map((r) => (r.error ? `${r.host}: ${r.error}` : `${r.host}: ${fmt.num(r.count)} flags`)).join(" · ");
		$("defs-status").textContent = last;
		const host = $("defs-table");
		const cols = [{ key: "at", label: "time UTC" }, { key: "host", label: "host" }, { key: "ms", label: "latency ms", type: "num" }, { key: "bytes", label: "bytes", type: "num" }, { key: "count", label: "definitions", type: "num" }, { key: "enabled", label: "enabled", type: "num" }, { key: "inManifest", label: "manifest flags present", type: "num", hint: `Out of ${fmt.num(S.M.count)} in the manifest` }, { key: "servedNotDefined", label: "served, not in definitions", type: "num", hint: "Flags /flags/ served to the active persona that the definitions snapshot does not contain" }, { key: "error", label: "error" }];
		const sorted = [...S.defs].reverse();
		if (host.wonkDataTable) host.wonkDataTable.setRows(sorted);
		else wonkData.table(host, { columns: cols, rows: sorted, limit: 20, caption: "Definitions fetches", captionHidden: true });
		const okRows = S.defs.filter((d) => d.count !== null);
		if (okRows.length) {
			const hostsSeen = [...new Set(okRows.map((d) => d.host))];
			wonkCharts.plot($("chart-defs"), (t) => ({
				height: 220, x: { label: "time", type: "time" }, y: { label: "definitions served", grid: true, domain: [0, Math.max(S.M.count, ...okRows.map((d) => d.count)) * 1.05] },
				color: { domain: hostsSeen, range: t.series.slice(0, hostsSeen.length), legend: true },
				marks: [
					Plot.ruleY([S.M.count], { stroke: t.muted, strokeDasharray: "4 3", z: null }),
					Plot.text([S.M.count], { y: (d) => d, frameAnchor: "left", dy: -8, text: () => `manifest ${fmt.num(S.M.count)}`, fill: t.muted }),
					Plot.line(okRows, { x: "t", y: "count", stroke: "host", strokeWidth: 2 }),
					Plot.dot(okRows, { x: "t", y: "count", fill: "host", r: 4, title: (d) => `${d.host} ${d.at}: ${fmt.num(d.count)}`, tip: true }),
				],
			}), { label: "Definitions count over time", table: { columns: cols.slice(0, 5), rows: okRows } });
		}
		renderVerdict();
	}

	// ---------- 9. exposure load ----------
	$("exp-arm").addEventListener("click", () => {
		if (!FZ.mp || !FZ.mp.flags) { wonk.toast("The SDK has not loaded yet.", "warn"); return; }
		$("exp-n").textContent = fmt.num(FZ.mp.flags.get_all_variants_sync().size);
		$("exp-confirm").hidden = false;
		$("exp-go").focus();
	});
	$("exp-cancel").addEventListener("click", () => { $("exp-confirm").hidden = true; $("exp-arm").focus(); });
	$("exp-go").addEventListener("click", runExposure);

	async function runExposure() {
		$("exp-confirm").hidden = true;
		$("exp-arm").disabled = true;
		$("exp-status").textContent = "reading";
		const keys = [...FZ.mp.flags.get_all_variants_sync().keys()];
		const e0 = FZ.exposures, tr0 = FZ.trackRequests;
		const t0 = performance.now();
		for (const k of keys) FZ.mp.flags.get_variant_sync(k, null);
		const loopMs = performance.now() - t0;
		$("exp-status").textContent = "waiting for the queue to drain";
		// The before_send hook counts events as they leave the queue. Wait until the count holds for 3 s (max 60 s).
		let last = -1, stableSince = performance.now();
		const tWait = performance.now();
		while (performance.now() - tWait < 60000) {
			const now = FZ.exposures;
			if (now !== last) { last = now; stableSince = performance.now(); }
			if (performance.now() - stableSince > 3000) break;
			await new Promise((r) => setTimeout(r, 250));
		}
		const exposures = FZ.exposures - e0, batches = FZ.trackRequests - tr0;
		const drainMs = stableSince - t0;
		kv($("exp-kv"), [
			["reads", fmt.num(keys.length)],
			["loop time", ms(Math.round(loopMs * 10) / 10), "Synchronous get_variant_sync loop"],
			["$experiment_started seen", fmt.num(exposures), "Counted by a before_send_events hook. Keys read before on this page do not fire again."],
			["/track requests", fmt.num(batches), "Resource timing entries for /track during the run"],
			["time until the queue drained", ms(Math.round(drainMs))],
		]);
		FZ.track("FZ Exposure Load", { reads: keys.length, exposures_queued: exposures, track_batches: batches, loop_ms: Math.round(loopMs * 10) / 10, drain_ms: Math.round(drainMs) });
		$("exp-status").textContent = `${fmt.num(exposures)} exposures from ${fmt.num(keys.length)} reads`;
		$("exp-arm").disabled = false;
	}

	// ---------- utility bar ----------
	$("reset-btn").addEventListener("click", () => window.RESET());
	const openLinks = () => {
		const tokenOverride = new URLSearchParams(location.search).get("token");
		if (tokenOverride) { $("open-project").removeAttribute("href"); $("open-flags").removeAttribute("href"); }
	};
	openLinks();

	// ---------- egg: type "roar" ----------
	let typed = "";
	document.addEventListener("keydown", (e) => {
		if (e.target.closest("input, select, textarea")) return;
		typed = (typed + e.key.toLowerCase()).slice(-4);
		if (typed === "roar") {
			const g = document.querySelector("[data-wonk-glyph]");
			if (g) g.closest("button").click();
			wonk.toast(S.verify ? `${fmt.num(S.verify.served)} flags served. None of them on fire.` : "Still loading. Even monsters wait on the network.", "info");
		}
	});
});
