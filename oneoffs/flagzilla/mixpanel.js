/**
 * Flagzilla - Mixpanel integration
 * Feature flag diagnostics for a project with ~2,000 flags.
 *
 * Load order: inline stub (index.html) → this file → jsonlogic.js → script.js.
 * This file runs before lib.min.js finishes loading, so it can wrap
 * window.fetch: the flags module captures window.fetch when it is built and
 * every SDK /flags/ request then passes through the recorder below.
 */

/* global mixpanel, MIXPANEL_TOKEN, MIXPANEL_PROXY */

(function () {
	"use strict";

	const params = new URLSearchParams(location.search);
	const TOKEN = params.get("token") || MIXPANEL_TOKEN;
	const DEBUG = params.has("debug");
	const PROJECT_ID = 4081152;
	const RUN_ID = `fz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

	const listeners = {};
	const FZ = (window.FZ = {
		TOKEN,
		DEBUG,
		PROJECT_ID,
		RUN_ID,
		PROXY: MIXPANEL_PROXY,
		DIRECT: "https://api.mixpanel.com",
		AUTH: "Basic " + btoa(TOKEN + ":"),
		marks: { scriptStart: performance.now() }, // performance.now() timestamps
		sdkFetches: [], // one record per SDK /flags/ request
		exposures: 0, // $experiment_started events seen by the before_send hook
		sdkLatencyFromExposure: null, // "Variant fetch latency (ms)" on the first exposure
		trackRequests: 0, // /track requests seen by resource timing
		resourceEntries: [], // /flags/ resource timing entries
		manifest: null,
		persona: null,
		mp: null,
		nativeFetch: window.fetch.bind(window),
		on(name, fn) { (listeners[name] ||= []).push(fn); },
		emit(name, detail) { (listeners[name] || []).forEach((fn) => fn(detail)); },
	});

	// ---------- SDK /flags/ request recorder ----------
	const FLAGS_RE = /\/flags\/?\?/;
	window.fetch = function (input, init) {
		const url = typeof input === "string" ? input : input && input.url;
		if (!url || !FLAGS_RE.test(url)) return FZ.nativeFetch(input, init);

		let context = null;
		try { context = JSON.parse(new URL(url).searchParams.get("context")); } catch (e) { context = { parseError: String(e) }; }
		const rec = {
			id: FZ.sdkFetches.length + 1,
			source: "sdk",
			url,
			context,
			distinct_id: context && context.distinct_id,
			startAt: performance.now(),
			headersAt: null, endAt: null, sdkJsonAt: null,
			status: null, bytes: null, parseMs: null, json: null, error: null,
		};
		FZ.sdkFetches.push(rec);
		FZ.emit("sdk-fetch-start", rec);

		return FZ.nativeFetch(input, init).then((res) => {
			rec.headersAt = performance.now();
			rec.status = res.status;
			res.clone().text().then((text) => {
				rec.endAt = performance.now();
				rec.bytes = new TextEncoder().encode(text).length;
				const t0 = performance.now();
				try { rec.json = JSON.parse(text); } catch (e) { rec.error = `JSON parse failed: ${e.message}`; }
				rec.parseMs = performance.now() - t0;
				FZ.emit("sdk-fetch", rec);
			}, (err) => {
				rec.endAt = performance.now();
				rec.error = `body read failed: ${err.message || err}`;
				FZ.emit("sdk-fetch", rec);
			});
			// Time the SDK's own res.json() so the timeline can mark "JSON parsed".
			const ownJson = res.json.bind(res);
			res.json = () => ownJson().then((v) => { rec.sdkJsonAt = performance.now(); FZ.emit("sdk-json", rec); return v; });
			return res;
		}, (err) => {
			rec.endAt = performance.now();
			rec.error = `request failed: ${err.message || err}`;
			FZ.emit("sdk-fetch", rec);
			throw err;
		});
	};

	// ---------- resource timing: /flags/, /track, lib.min.js ----------
	if ("PerformanceObserver" in window) {
		const po = new PerformanceObserver((list) => {
			for (const e of list.getEntries()) {
				if (FLAGS_RE.test(e.name)) { FZ.resourceEntries.push(e); FZ.emit("flags-resource", e); }
				else if (/\/track\/?(\?|$)/.test(e.name)) { FZ.trackRequests++; FZ.emit("track-request", e); }
				else if (/lib\.min\.js/.test(e.name)) { FZ.libEntry = e; FZ.emit("lib-resource", e); }
			}
		});
		po.observe({ type: "resource", buffered: true });
	}

	// ---------- persona: ?persona= → meeple hash → localStorage → fz-qa-01 ----------
	// FNV-1a 32-bit: the same MEEPLE_ID always maps to the same persona.
	function hashIndex(str, n) {
		let h = 0x811c9dc5;
		for (let i = 0; i < str.length; i++) {
			h ^= str.charCodeAt(i);
			h = Math.imul(h, 0x01000193);
		}
		return (h >>> 0) % n;
	}

	function pickPersonaId(m) {
		const fromUrl = params.get("persona");
		if (fromUrl) return fromUrl;
		// npc-mixpanel meeples start with empty storage; spread them over the fz-user-* personas.
		const meepleId = params.get("MEEPLE_ID");
		if (params.get("IS_MEEPLE") === "true" && meepleId) {
			const users = m.personas.filter((p) => !m.qaUsers.includes(p.distinct_id));
			if (users.length) return users[hashIndex(meepleId, users.length)].distinct_id;
		}
		try { const saved = localStorage.getItem("fz-persona"); if (saved) return saved; } catch (e) { /* storage blocked: use the default */ }
		return "fz-qa-01";
	}

	// ---------- runtime properties sent as flags context ----------
	// A flag Date condition matches only an RFC3339 runtime value. The manifest stores
	// date properties as epoch ms, so by default the app converts them before sending.
	// ?dates=epoch sends the manifest values unchanged. Profiles in Mixpanel are not touched.
	FZ.dateMode = params.get("dates") === "epoch" ? "epoch" : (() => {
		try { return localStorage.getItem("fz-dates") === "epoch" ? "epoch" : "rfc3339"; } catch (e) { return "rfc3339"; }
	})();
	FZ.dateKeys = [];
	FZ.contextProps = function (persona) {
		const props = { ...persona.properties };
		if (FZ.dateMode !== "rfc3339") return props;
		for (const k of FZ.dateKeys) {
			if (typeof props[k] === "number") props[k] = new Date(props[k]).toISOString().replace(".000Z", "Z");
		}
		return props;
	};

	// ---------- events ----------
	FZ.track = function (name, props) {
		mixpanel.track(name, props || {});
	};

	// ---------- init: wait for the manifest so the first fetch carries the persona's properties ----------
	FZ.marks.manifestStart = performance.now();
	FZ.manifestReady = FZ.nativeFetch("manifest.json")
		.then((res) => {
			if (!res.ok) throw new Error(`manifest.json: HTTP ${res.status}`);
			return res.json();
		})
		.then((m) => {
			FZ.marks.manifestEnd = performance.now();
			FZ.manifest = m;
			FZ.dateKeys = Object.entries(m.vocabulary || {}).filter(([, v]) => typeof v === "string" && /epoch ms/.test(v)).map(([k]) => k);
			const wanted = pickPersonaId(m);
			FZ.persona = m.personas.find((p) => p.distinct_id === wanted) || m.personas[0];
			try { localStorage.setItem("fz-persona", FZ.persona.distinct_id); } catch (e) { /* storage blocked: the choice lasts for this page only */ }
			initMixpanel();
			return m;
		});
	FZ.manifestReady.catch((err) => { FZ.manifestError = err; FZ.emit("manifest-error", err); });

	function initMixpanel() {
		FZ.marks.initCalled = performance.now();
		mixpanel.init(TOKEN, {
			api_host: MIXPANEL_PROXY,
			debug: DEBUG,
			ignore_dnt: true,
			persistence: "localStorage",
			autocapture: { pageview: "full-url", click: true, input: false, scroll: false, submit: true, capture_text_content: false },
			// Replay starts after the first flags fetch, so recording does not skew the lifecycle timings.
			record_sessions_percent: 0,
			record_mask_text_selector: "nope",
			batch_flush_interval_ms: 0,
			api_payload_format: "json",
			api_transport: "XHR",
			flags: { context: { custom_properties: FZ.contextProps(FZ.persona) } },
			hooks: {
				before_send_events(data) {
					if (data && data.event === "$experiment_started") {
						FZ.exposures++;
						if (FZ.sdkLatencyFromExposure === null && data.properties) {
							FZ.sdkLatencyFromExposure = data.properties["Variant fetch latency (ms)"] ?? null;
							FZ.emit("exposure-latency", FZ.sdkLatencyFromExposure);
						}
					}
					return data;
				},
			},
			loaded(mp) {
				FZ.marks.loaded = performance.now();
				FZ.mp = mp;
				mp.register({ run_id: RUN_ID, fz_tool: "flagzilla-diagnostics", fz_date_mode: FZ.dateMode });
				if (mp.get_distinct_id() !== FZ.persona.distinct_id) {
					FZ.marks.identifyAt = performance.now();
					mp.identify(FZ.persona.distinct_id);
				}
				console.log("%c\n=======================================================\n   FLAGZILLA · feature flag diagnostics\n   Mixpanel project " + PROJECT_ID + "\n=======================================================", "color:#3fc9c9;font-weight:bold;font-size:12px;");
				console.log("%cProject: %chttps://mixpanel.com/project/" + PROJECT_ID, "color:#6B7280;", "color:#3B82F6;");
				console.log("%cTip: %cType %cRESET()%c to clear user data and start fresh", "color:#A855F7;font-weight:bold;", "color:#6B7280;", "color:#EF4444;font-family:monospace;", "color:#6B7280;");
				FZ.emit("loaded", mp);
			},
		});
	}

	// ---------- reset (copied from the feature-flags-console one-off) ----------
	async function resetUser() {
		console.log("RESETTING USER SESSION");
		const overlay = document.getElementById("fadeOverlay");
		if (overlay) overlay.classList.add("active");
		if (window.mixpanel && window.mixpanel.track) mixpanel.track("FZ User Reset");
		await new Promise((resolve) => setTimeout(resolve, 500));
		nuke();
	}

	function nuke() {
		if (window.mixpanel) {
			try {
				if (window.mixpanel.stop_session_recording) window.mixpanel.stop_session_recording();
				if (window.mixpanel.reset) window.mixpanel.reset();
				window.mixpanel = null;
			} catch (error) {
				console.error("Error destroying Mixpanel:", error);
			}
		}
		try { localStorage.clear(); } catch (e) { console.error("localStorage clear failed:", e); }
		try { sessionStorage.clear(); } catch (e) { console.error("sessionStorage clear failed:", e); }
		try {
			for (const cookie of document.cookie.split(";")) {
				const eq = cookie.indexOf("=");
				const name = eq > -1 ? cookie.substring(0, eq).trim() : cookie.trim();
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
				document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + location.hostname;
			}
		} catch (e) { console.error("Cookie clear failed:", e); }
		const jobs = [];
		if (window.indexedDB && indexedDB.databases) {
			jobs.push(indexedDB.databases().then((dbs) => dbs.forEach((db) => db.name && indexedDB.deleteDatabase(db.name))));
		}
		if (window.caches) jobs.push(caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n)))));
		Promise.allSettled(jobs).then(() => {
			const url = new URL(location.href);
			url.searchParams.delete("persona");
			location.replace(url.toString());
		});
	}

	window.RESET = resetUser;
	window.resetUser = resetUser;
	window.nuke = nuke;
})();
