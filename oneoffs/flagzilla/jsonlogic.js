/**
 * Flagzilla - small JSONLogic evaluator.
 *
 * Implements exactly the dialect the flagzilla manifest uses:
 *   and, or, ===, ==, !==, <, <=, >, >=, var,
 *   in (list membership [x, [values]] and substring [str, x]),
 *   some / all over a list ({var: ""} is the element),
 *   semver_compare [x, op, "x.y.z"], datetime_compare [x, op, epochMs].
 *
 * An unknown operator throws. The verifier shows that error on the flag row;
 * it never turns into a silent pass or fail.
 */
(function () {
	"use strict";

	function getVar(data, path, fallback) {
		if (path === "" || path === null || path === undefined) return data;
		let cur = data;
		for (const part of String(path).split(".")) {
			if (cur === null || cur === undefined) return fallback === undefined ? null : fallback;
			cur = cur[part];
		}
		return cur === undefined ? (fallback === undefined ? null : fallback) : cur;
	}

	const isMissing = (v) => v === null || v === undefined;

	function compareNum(op, a, b) {
		if (isMissing(a) || isMissing(b)) return false;
		switch (op) {
			case "<": return a < b;
			case "<=": return a <= b;
			case ">": return a > b;
			case ">=": return a >= b;
			case "==": return a == b; // eslint-disable-line eqeqeq
			case "===": return a === b;
			case "!=": return a != b; // eslint-disable-line eqeqeq
			case "!==": return a !== b;
			default: throw new Error(`jsonlogic: unknown comparison "${op}"`);
		}
	}

	function semverParts(v) {
		if (typeof v !== "string") return null;
		const m = v.trim().match(/^v?(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
		return m ? [Number(m[1]), Number(m[2] || 0), Number(m[3] || 0)] : null;
	}

	function semverCmp(a, b) {
		const pa = semverParts(a), pb = semverParts(b);
		if (!pa || !pb) return null;
		for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
		return 0;
	}

	// The runtime value of a Date condition must be an RFC3339 timestamp. Any other
	// format does not match (docs.mixpanel.com/docs/featureflags, "Data types for
	// runtime values"). The rule side may be epoch ms; the server accepts that.
	const RFC3339 = /^\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(\.\d+)?([Zz]|[+-]\d{2}:\d{2})$/;
	function runtimeDate(v) {
		if (typeof v !== "string" || !RFC3339.test(v)) return null;
		const t = Date.parse(v);
		return Number.isNaN(t) ? null : t;
	}

	function toEpoch(v) {
		if (typeof v === "number") return v;
		if (typeof v === "string") {
			const n = Number(v);
			if (!Number.isNaN(n) && v.trim() !== "") return n;
			const t = Date.parse(v);
			return Number.isNaN(t) ? null : t;
		}
		return null;
	}

	function apply(logic, data) {
		if (Array.isArray(logic)) return logic.map((l) => apply(l, data));
		if (logic === null || typeof logic !== "object") return logic;
		const ops = Object.keys(logic);
		if (ops.length !== 1) throw new Error(`jsonlogic: rule object must have one operator, got ${ops.length}`);
		const op = ops[0];
		let args = logic[op];
		if (!Array.isArray(args)) args = [args];

		switch (op) {
			case "var": {
				const path = apply(args[0], data);
				return getVar(data, path, args.length > 1 ? apply(args[1], data) : undefined);
			}
			case "and": {
				let last = true;
				for (const a of args) { last = apply(a, data); if (!last) return last; }
				return last;
			}
			case "or": {
				let last = false;
				for (const a of args) { last = apply(a, data); if (last) return last; }
				return last;
			}
			case "!": return !apply(args[0], data);
			case "===": case "==": case "!==": case "!=": {
				const a = apply(args[0], data), b = apply(args[1], data);
				if (op === "===") return a === b;
				if (op === "!==") return a !== b;
				if (op === "==") return a == b; // eslint-disable-line eqeqeq
				return a != b; // eslint-disable-line eqeqeq
			}
			case "<": case "<=": case ">": case ">=": {
				const vals = args.map((a) => apply(a, data));
				if (vals.length === 3) return compareNum(op, vals[0], vals[1]) && compareNum(op, vals[1], vals[2]);
				return compareNum(op, vals[0], vals[1]);
			}
			case "in": {
				const needle = apply(args[0], data);
				const hay = apply(args[1], data);
				if (Array.isArray(hay)) return hay.includes(needle);
				if (typeof hay === "string" && typeof needle === "string") return hay.includes(needle);
				return false;
			}
			case "some": case "all": {
				const list = apply(args[0], data);
				if (!Array.isArray(list)) return false;
				if (op === "all" && list.length === 0) return false;
				return op === "some" ? list.some((el) => !!apply(args[1], el)) : list.every((el) => !!apply(args[1], el));
			}
			case "semver_compare": {
				const left = apply(args[0], data), cmpOp = args[1], right = apply(args[2], data);
				const c = semverCmp(left, right);
				if (c === null) return false;
				return compareNum(cmpOp, c, 0);
			}
			case "datetime_compare": {
				const left = runtimeDate(apply(args[0], data)), cmpOp = args[1], right = toEpoch(apply(args[2], data));
				if (left === null || right === null) return false;
				return compareNum(cmpOp, left, right);
			}
			default:
				throw new Error(`jsonlogic: unsupported operator "${op}"`);
		}
	}

	function truthy(logic, data) {
		return !!apply(logic, data);
	}

	// Hand cases. Run on load in debug mode (?debug).
	function selfTest() {
		const p = { plan: "free", country: "ID", platform: "ios", build_channel: "beta-2026", segments: ["vip", "beta"], app_version: "4.10.2", account_age_days: 812, tier_score: 63, is_employee: false, signup_ts: 1735689600000, signup_iso: "2025-01-01T00:00:00Z" };
		const cases = [
			[{ "===": [{ var: "plan" }, "free"] }, true],
			[{ "===": [{ var: "plan" }, "pro"] }, false],
			[{ "!==": [{ var: "platform" }, "web"] }, true],
			[{ "==": [{ var: "tier_score" }, "63"] }, true],
			[{ ">": [{ var: "account_age_days" }, 602] }, true],
			[{ "<=": [{ var: "tier_score" }, 62] }, false],
			[{ ">=": [{ var: "tier_score" }, 63] }, true],
			[{ "<": [{ var: "missing" }, 5] }, false],
			[{ in: [{ var: "country" }, ["ID", "GB"]] }, true],
			[{ in: [{ var: "country" }, ["US"]] }, false],
			[{ in: ["beta", { var: "build_channel" }] }, true],
			[{ in: ["nightly", { var: "build_channel" }] }, false],
			[{ some: [{ var: "segments" }, { "===": [{ var: "" }, "vip"] }] }, true],
			[{ some: [{ var: "segments" }, { "===": [{ var: "" }, "merchant"] }] }, false],
			[{ all: [{ var: "segments" }, { in: [{ var: "" }, ["vip", "beta"]] }] }, true],
			[{ semver_compare: [{ var: "app_version" }, ">=", "4.8.0"] }, true],
			[{ semver_compare: [{ var: "app_version" }, "<", "4.9.0"] }, false],
			[{ datetime_compare: [{ var: "signup_iso" }, ">", 1704067200000] }, true],
			[{ datetime_compare: [{ var: "signup_iso" }, "<", 1704067200000] }, false],
			[{ datetime_compare: [{ var: "signup_ts" }, ">", 1704067200000] }, false], // epoch ms is not RFC3339: no match
			[{ datetime_compare: [{ var: "signup_ts" }, "<", 1704067200000] }, false],
			[{ and: [{ "===": [{ var: "plan" }, "free"] }, { or: [{ "===": [{ var: "platform" }, "web"] }, { ">=": [{ var: "tier_score" }, 60] }] }] }, true],
		];
		let failed = 0;
		cases.forEach(([rule, want], i) => {
			const got = truthy(rule, p);
			console.assert(got === want, `jsonlogic case ${i + 1}: ${JSON.stringify(rule)} → ${got}, want ${want}`);
			if (got !== want) failed++;
		});
		let threw = false;
		try { apply({ nope: [1] }, p); } catch (e) { threw = true; }
		console.assert(threw, "jsonlogic: unknown operator must throw");
		if (!threw) failed++;
		console.log(`%cjsonlogic self-test: ${cases.length + 1 - failed}/${cases.length + 1} pass`, failed ? "color:#e5484d" : "color:#30a46c");
		return failed === 0;
	}

	window.FZLogic = Object.freeze({ apply, truthy, semverCmp, selfTest });
	if (/[?&]debug\b/.test(location.search)) selfTest();
})();
