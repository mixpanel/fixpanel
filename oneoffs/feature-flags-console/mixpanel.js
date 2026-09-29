// ==========================
// FEATURE FLAGS CONFIGURATION
// ==========================

const MIXPANEL_TOKEN = "804eda22281bcbb54284ccbd277a5792";
const MIXPANEL_PROXY = `https://express-proxy-lmozz6xkha-uc.a.run.app`;
const MIXPANEL_CUSTOM_LIB_URL = `${MIXPANEL_PROXY}/lib.min.js`;

// Feature Flag Definitions
const FLAGS = {
	featureGate: {
		key: "i-am-feature-gate",
		type: "gate",
		expected: "true or false (50/50)",
		dashboardUrl: "https://mixpanel.com/project/3971270/view/4466983/app/feature-flags/27ebbb77-7bfe-4409-8b35-4e84e59aa731"
	},
	dynamicConfig: {
		key: "i-am-dynamic-config",
		type: "config",
		expected: '{"foo":"bar"} or {"baz":"qux"} (50/50)',
		dashboardUrl: "https://mixpanel.com/project/3971270/view/4466983/app/feature-flags/e4b1b18d-edb1-4142-acb9-e2383a0fdf1e"
	},
	experiment: {
		key: "i-am-experiment",
		type: "experiment",
		expected: "A, B, C, or Control (25/25/25/25)",
		dashboardUrl: "https://mixpanel.com/project/3971270/view/4466983/app/feature-flags/136ad851-6152-4e18-9311-724e4919adc7",
		analysisUrl: "https://mixpanel.com/project/3971270/view/4466983/app/experiments/0de178e9-d243-47fd-b345-cc2335dd67c2"
	},
	runtimeExample: {
		key: "i-am-runtime-example",
		type: "runtime",
		expected: 'foo, bar, or baz (33/33/34) based on URL param',
		dashboardUrl: "https://mixpanel.com/project/3971270/view/4466983/app/feature-flags/b60ce1d8-dbb0-495c-a9b4-fba7de271004"
	},
	cohortExample: {
		key: "i-am-cohort-example",
		type: "cohort",
		expected: 'awesome (100%) of users who did "some trigger event"',
		dashboardUrl: "https://mixpanel.com/project/3971270/view/4466983/app/feature-flags/6777f61b-b643-487a-8c5a-1c0a8e7f891a"
	}
};

// ==========================
// TERMINAL LOGGING SYSTEM
// ==========================

class TerminalLogger {
	constructor() {
		this.terminalElement = null;
		this.originalConsole = {
			log: console.log.bind(console),
			error: console.error.bind(console),
			warn: console.warn.bind(console),
			info: console.info.bind(console),
			debug: console.debug.bind(console)
		};
		this.setupInterceptor();
	}

	setupInterceptor() {
		// Wait for DOM to be ready
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.init());
		} else {
			this.init();
		}
	}

	init() {
		this.terminalElement = document.getElementById('terminalOutput');

		// Intercept console methods
		console.log = (...args) => {
			this.originalConsole.log(...args);
			this.addToTerminal(args, 'info');
		};

		console.error = (...args) => {
			this.originalConsole.error(...args);
			this.addToTerminal(args, 'error');
		};

		console.warn = (...args) => {
			this.originalConsole.warn(...args);
			this.addToTerminal(args, 'warning');
		};

		console.info = (...args) => {
			this.originalConsole.info(...args);
			this.addToTerminal(args, 'debug');
		};

		console.debug = (...args) => {
			this.originalConsole.debug(...args);
			this.addToTerminal(args, 'debug');
		};
	}

	formatValue(value) {
		if (value === undefined) return 'undefined';
		if (value === null) return 'null';
		if (typeof value === 'object') {
			try {
				// Handle circular references
				const seen = new WeakSet();
				return JSON.stringify(value, (_, val) => {
					if (typeof val === 'object' && val !== null) {
						if (seen.has(val)) {
							return '[Circular Reference]';
						}
						seen.add(val);
					}
					// Handle functions
					if (typeof val === 'function') {
						return `[Function: ${val.name || 'anonymous'}]`;
					}
					return val;
				}, 2);
			} catch (e) {
				// Fallback for objects that can't be stringified
				try {
					if (value.constructor && value.constructor.name) {
						return `[Object: ${value.constructor.name}]`;
					}
				} catch (e2) {
					// Ignore
				}
				return String(value);
			}
		}
		return String(value);
	}

	addToTerminal(args, type = 'info') {
		if (!this.terminalElement) return;

		const timestamp = new Date().toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			fractionalSecondDigits: 3
		});

		const message = args.map(arg => this.formatValue(arg)).join(' ');
		const line = document.createElement('div');
		line.className = `terminal-line ${type}`;

		// Check if this is a highlight message
		if (message.includes('🎯') || message.includes('✨') || message.includes('🚀') || message.includes('⚡')) {
			line.className = 'terminal-line highlight';
		}

		line.textContent = `[${timestamp}] ${message}`;

		this.terminalElement.appendChild(line);
		this.terminalElement.scrollTop = this.terminalElement.scrollHeight;
	}

	clear() {
		if (this.terminalElement) {
			this.terminalElement.innerHTML = '<div class="terminal-line info">🚀 Terminal cleared</div>';
		}
	}
}

// Initialize terminal logger
const terminal = new TerminalLogger();

// ==========================
// URL PARAMETER PARSING
// ==========================

function getURLParams() {
	const params = new URLSearchParams(window.location.search);
	const result = {};
	for (const [key, value] of params) {
		result[key] = value;
	}
	return result;
}

const URL_PARAMS = getURLParams();

// ==========================
// MIXPANEL SDK INITIALIZATION
// ==========================

// Load Mixpanel SDK snippet
(function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for (var d = {}, e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);

// Initialize Mixpanel with Feature Flags enabled
console.log("========================================");
console.log("🚀 INITIALIZING MIXPANEL SDK");
console.log("========================================");

// Check for URL parameters
if (URL_PARAMS.runtime === 'true') {
	console.log(`📌 Runtime targeting ENABLED via URL parameter`);
} else if (Object.keys(URL_PARAMS).length > 0) {
	console.log("📌 URL Parameters detected:", URL_PARAMS);
}

// Build runtime properties for targeting
const runtimeProperties = {};

// Set runtime eligibility based on URL param
if (URL_PARAMS.runtime === 'true') {
	runtimeProperties.runtime = 'true';  // User is eligible
	console.log(`🎯 User ELIGIBLE for runtime-targeted flags`);
	console.log(`📡 Sending: custom_properties.runtime = "true"`);
	console.log(`✨ User qualifies for flags that target runtime = "true"`);
} else {
	runtimeProperties.runtime = 'false';  // Default to not eligible
	console.log(`💡 User NOT ELIGIBLE - add ?runtime=true to qualify for runtime-targeted flags`);
	console.log(`📡 Sending: custom_properties.runtime = "false"`);
}

mixpanel.init(MIXPANEL_TOKEN, {
	api_host: MIXPANEL_PROXY,
	debug: true,
	ignore_dnt: true,
	persistence: "localStorage",

	// Initialize Feature Flags with context
	flags: {
		context: {
			// If you have variant assignment keys other than distinct_id/device_id
			// company_id: "demo-company-123",

			// Runtime targeting properties
			custom_properties: runtimeProperties
		}
	},

	loaded: async function (mixpanel) {
		console.log("✨ MIXPANEL SDK LOADED SUCCESSFULLY!");
		console.log("----------------------------------------");

		// Start session recording
		mixpanel.start_session_recording();
		console.log("📹 Session recording started");

		// Track page load
		mixpanel.track("Feature Flags Demo - Page Load");
		console.log("📊 Tracked: Feature Flags Demo - Page Load");

		// Get user identifiers
		const distinctId = mixpanel.get_distinct_id();
		const deviceId = mixpanel.persistence.props.$device_id || 'Unknown';

		console.log(`👤 Distinct ID: ${distinctId}`);
		console.log(`📱 Device ID: ${deviceId}`);
		console.log("----------------------------------------");

		// Store the data globally for the UI to access
		window.mixpanelData = {
			distinctId: distinctId,
			deviceId: deviceId,
			loaded: true
		};

		// Dispatch event for UI update
		const event = new CustomEvent('mixpanelLoaded', {
			detail: {
				distinctId: distinctId || 'Unknown',
				deviceId: deviceId || 'Unknown'
			}
		});
		window.dispatchEvent(event);
	}
});
mixpanel.register({ $mp_user_agent: navigator.userAgent });

// ==========================
// UI UPDATE HELPERS
// ==========================

function updateUIElement(id, value, className = '') {
	const element = document.getElementById(id);
	if (element) {
		element.textContent = value;
		if (className) {
			element.className = `flag-value ${className}`;
		}
	}
}

// ==========================
// FEATURE FLAG OPERATIONS
// ==========================

async function fetchAllFlags() {
	console.log("🎯 Fetching all feature flags...");
	updateUIElement('flagsStatus', '⏳ Loading...');

	// Wait a bit to ensure flags are ready
	await new Promise(resolve => setTimeout(resolve, 500));

	try {
		// 1. FEATURE GATE - Check if enabled
		const gateFallback = false;
		const isGateEnabled = await mixpanel.flags.is_enabled(FLAGS.featureGate.key, gateFallback);
		const gateVariant = await mixpanel.flags.get_variant_value(FLAGS.featureGate.key, gateFallback);
		const gateFallbackUsed = (gateVariant === gateFallback && !isGateEnabled);

		// Update UI
		updateUIElement('gateEnabled', isGateEnabled ? '✅ TRUE' : '❌ FALSE', isGateEnabled ? 'true' : 'false');
		updateUIElement('gateVariant', String(gateVariant));
		updateUIElement('gateFallback', gateFallbackUsed ? 'Yes' : 'No');

		// 2. A/B/C EXPERIMENT
		const experimentFallback = "Control";
		const experimentVariant = await mixpanel.flags.get_variant_value(FLAGS.experiment.key, experimentFallback);

		// Update UI
		updateUIElement('experimentVariant', experimentVariant);
		updateUIElement('experimentExposure', '✅ Tracked');

		// 3. DYNAMIC CONFIG
		const configFallback = JSON.stringify({ default: true });
		const configValue = await mixpanel.flags.get_variant_value(FLAGS.dynamicConfig.key, configFallback);

		// Parse if it's a string
		let parsedConfig = configValue;
		if (typeof configValue === 'string') {
			try {
				parsedConfig = JSON.parse(configValue);
			} catch (e) {
				// Keep as string if not parseable
			}
		}

		// Update UI
		updateUIElement('configValue', typeof parsedConfig === 'object' ?
			JSON.stringify(parsedConfig, null, 2) : String(configValue));

		// 4. RUNTIME EXAMPLE (Runtime Targeting Eligibility)
		// Update URL param display
		updateUIElement('urlRuntimeParam', URL_PARAMS.runtime || 'none');

		// Check if user is eligible
		const isRuntimeEnabled = URL_PARAMS.runtime === 'true';

		const runtimeFallback = "not-targeted";
		const runtimeValue = await mixpanel.flags.get_variant_value(FLAGS.runtimeExample.key, runtimeFallback);

		// Parse if it's a JSON string
		let parsedValue = runtimeValue;
		if (typeof runtimeValue === 'string' && runtimeValue !== runtimeFallback) {
			try {
				parsedValue = JSON.parse(runtimeValue);
			} catch (e) {
				// Not JSON, keep as string
			}
		}

		let variantName = '';
		let displayText = '';

		if (runtimeValue === runtimeFallback) {
			// User is not eligible for the flag
			variantName = 'Not Eligible';
			displayText = '❌ User not eligible for this flag';
		} else {
			// User is eligible and got assigned a variant
			// Extract variant name from the payload if it's an object
			if (typeof parsedValue === 'object' && parsedValue.hello) {
				variantName = `${parsedValue.hello} (eligible)`;
				displayText = `✅ Eligible! Assigned variant: ${parsedValue.hello}\n${JSON.stringify(parsedValue, null, 2)}`;
			} else {
				variantName = `${runtimeValue} (eligible)`;
				displayText = `✅ Eligible! Assigned variant: ${runtimeValue}`;
			}
		}

		updateUIElement('runtimeVariant', variantName);
		updateUIElement('runtimePayload', displayText);

		if (!isRuntimeEnabled) {
			console.log("💡 User not eligible - add ?runtime=true for eligibility");
		} else if (runtimeValue !== runtimeFallback) {
			const display = typeof parsedValue === 'object' ? JSON.stringify(parsedValue) : runtimeValue;
			console.log(`✨ User eligible - assigned variant: ${display}`);
		}

		// 5. COHORT EXAMPLE (Behavioral Targeting)
		const cohortValue = await mixpanel.flags.get_variant_value(FLAGS.cohortExample.key, false);

		let cohortStatus = '';

		if (cohortValue === true) {
			// User is in the cohort (has fired the trigger event)
			cohortStatus = '✅ Eligible';
			updateUIElement('cohortStatus', '✅ Eligible (in cohort)');
			updateUIElement('cohortVariant', 'awesome');
		} else {
			// User is not in the cohort
			cohortStatus = '❌ Not Eligible';
			updateUIElement('cohortStatus', '❌ Not Eligible (not in cohort)');
			updateUIElement('cohortVariant', 'false (not in cohort)');
		}

		console.log(`🎯 Cohort flag: ${cohortValue ? 'User in cohort' : 'User not in cohort'}`);

		// Summary
		const runtimeSummary = runtimeValue === runtimeFallback ? 'Not Eligible' :
			(typeof parsedValue === 'object' && parsedValue.hello ? parsedValue.hello : String(runtimeValue));
		console.log(`✅ Flags fetched - Gate: ${isGateEnabled ? 'Enabled' : 'Disabled'}, Experiment: ${experimentVariant}, Config: ${typeof parsedConfig === 'object' ? 'Object' : configValue}, Runtime: ${runtimeSummary}, Cohort: ${cohortStatus}`);

		updateUIElement('flagsStatus', '✅ Loaded');

	} catch (error) {
		console.error("❌ ERROR FETCHING FLAGS:", error);
		updateUIElement('flagsStatus', '❌ Error');
	}
}

// ==========================
// CONTEXT UPDATE SIMULATION
// ==========================

async function updateContext() {
	console.log("\n========================================");
	console.log("🔧 UPDATING FEATURE FLAG CONTEXT");
	console.log("========================================");

	// Randomly pick a runtime variant to simulate context update
	const variants = ['foo', 'bar', 'baz'];
	const randomVariant = variants[Math.floor(Math.random() * variants.length)];

	const newContext = {
		// Update runtime properties
		custom_properties: {
			runtime_variant: randomVariant
		}
	};

	console.log(`📝 New context - setting runtime_variant to: "${randomVariant}"`);
	console.log("📝 Full context:", newContext);
	console.log("⚡ Calling flags.update_context()...");

	// Update the context
	await mixpanel.flags.update_context(newContext);

	console.log("✅ Context updated successfully!");
	console.log(`🎯 Should now receive variant "${randomVariant}" with payload {"hello": "${randomVariant}"}`);
	console.log("🔄 Re-fetching flags with new context...");

	// Update runtime display
	updateUIElement('runtimeContext', `runtime_variant: ${randomVariant}`);

	// Re-fetch flags with new context
	setTimeout(() => fetchAllFlags(), 500);
}

// ==========================
// RUNTIME TARGETING SIMULATION
// ==========================

async function simulateRuntimeTargeting() {
	console.log("\n========================================");
	console.log("🎯 SIMULATING RUNTIME TARGETING");
	console.log("========================================");

	const scenarios = [
		{
			name: "Foo User Experience",
			variant: "foo",
			expectedPayload: '{"hello": "foo"}'
		},
		{
			name: "Bar User Experience",
			variant: "bar",
			expectedPayload: '{"hello": "bar"}'
		},
		{
			name: "Baz User Experience",
			variant: "baz",
			expectedPayload: '{"hello": "baz"}'
		}
	];

	// Pick a random scenario
	const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

	console.log(`📍 Scenario: "${scenario.name}"`);
	console.log(`🎯 Setting runtime_variant to: "${scenario.variant}"`);
	console.log(`📦 Expected payload: ${scenario.expectedPayload}`);

	const context = {
		custom_properties: {
			runtime_variant: scenario.variant
		}
	};

	console.log("⚡ Updating context for runtime targeting...");

	// Update context with runtime properties
	await mixpanel.flags.update_context(context);

	console.log("✅ Runtime context updated!");
	console.log(`ℹ️  Flag should now return: ${scenario.expectedPayload}`);
	console.log("🔄 Re-fetching flags with runtime context...");

	// Update runtime display
	updateUIElement('runtimeContext', `${scenario.name} (runtime_variant: ${scenario.variant})`);

	// Re-fetch flags
	setTimeout(() => fetchAllFlags(), 500);
}

// ==========================
// BEHAVIORAL TARGETING SIMULATION
// ==========================

async function simulateBehavioralTargeting() {
	console.log("\n========================================");
	console.log("🎯 SIMULATING BEHAVIORAL TARGETING");
	console.log("========================================");

	console.log("📝 Behavioral targeting uses user actions to determine eligibility");
	console.log("🔄 This demo will:");
	console.log("   1. Fire 'some trigger event'");
	console.log("   2. Wait for Mixpanel to process the event");
	console.log("   3. Check if user is now in the cohort");
	console.log("   4. Show the 'awesome' flag variant if eligible");

	console.log("\n🎯 Step 1: Firing trigger event...");
	mixpanel.track('some trigger event', {
		source: 'simulation',
		timestamp: new Date().toISOString()
	});

	updateUIElement('cohortEvent', '✅ Event fired (simulation)');
	console.log("✅ Event 'some trigger event' fired!");

	console.log("\n⏳ Step 2: Waiting for cohort evaluation...");
	console.log("💡 Mixpanel needs to process the event and update cohort membership");

	// Show progress
	for (let i = 1; i <= 3; i++) {
		await new Promise(resolve => setTimeout(resolve, 1000));
		console.log(`⏱️ Waiting... ${i}s`);
	}

	console.log("\n🔄 Step 3: Checking cohort membership...");
	const cohortValue = await mixpanel.flags.get_variant_value(FLAGS.cohortExample.key, false);

	if (cohortValue === true) {
		console.log("\n✅ SUCCESS! User is now in the cohort!");
		console.log("🎉 Flag returned: 'awesome'");
		console.log("📝 The user is eligible because they performed 'some trigger event'");

		updateUIElement('cohortStatus', '✅ Eligible (in cohort)');
		updateUIElement('cohortVariant', 'awesome');
		updateUIElement('cohortEvent', '✅ Event recognized');
	} else {
		console.log("\n⚠️ User not yet in cohort");
		console.log("⏱️ Cohort evaluation may still be processing");
		console.log("💡 Try refreshing the flag or running the simulation again");

		updateUIElement('cohortStatus', '❌ Not Eligible (processing...)');
		updateUIElement('cohortVariant', 'false (not in cohort)');
	}

	console.log("\n📊 Behavioral targeting is powerful for:");
	console.log("   • Progressive disclosure (unlock features as users engage)");
	console.log("   • Onboarding flows (show features after certain actions)");
	console.log("   • Power user features (enable for highly engaged users)");
	console.log("   • A/B tests on engaged segments");
}

// ==========================
// USER RESET WITH ANIMATION
// ==========================

async function resetUser() {
	console.log("\n========================================");
	console.log("💀 RESETTING USER SESSION");
	console.log("========================================");

	// Start fade animation
	const fadeOverlay = document.getElementById('fadeOverlay');
	fadeOverlay.classList.add('active');

	console.log("🧹 Starting complete cleanup...");
	console.log("📤 Tracking reset event...");

	// Track reset event before destroying
	if (window.mixpanel && window.mixpanel.track) {
		mixpanel.track("Feature Flags Demo - User Reset");
	}

	// Wait for fade to complete
	await new Promise(resolve => setTimeout(resolve, 500));

	nuke(); // This will clear everything and reload
}

// ==========================
// CLEANUP FUNCTION
// ==========================

function nuke() {
	console.log("🔥 NUKING ALL STORAGE AND MIXPANEL STATE");
	console.log("----------------------------------------");

	// 1. Destroy Mixpanel instance
	if (typeof window !== "undefined" && window.mixpanel) {
		try {
			console.log("📤 Stopping session recording...");
			if (window.mixpanel?.stop_session_recording) {
				window.mixpanel.stop_session_recording();
			}

			console.log("🔄 Resetting Mixpanel instance...");
			if (window.mixpanel?.reset) {
				window.mixpanel.reset();
			}

			console.log("💥 Destroying Mixpanel instance...");
			window.mixpanel = null;
		} catch (error) {
			console.error("❌ Error destroying Mixpanel:", error);
		}
	}

	// 2. Clear ALL localStorage
	try {
		localStorage.clear();
		console.log("✅ localStorage cleared");
	} catch (e) {
		console.error("❌ localStorage clear failed:", e);
	}

	// 3. Clear ALL sessionStorage
	try {
		sessionStorage.clear();
		console.log("✅ sessionStorage cleared");
	} catch (e) {
		console.error("❌ sessionStorage clear failed:", e);
	}

	// 4. Clear ALL cookies
	try {
		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf("=");
			const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
			const domain = window.location.hostname;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + domain;
		}
		console.log("✅ Cookies cleared");
	} catch (e) {
		console.error("❌ Cookie clear failed:", e);
	}

	// 5. Clear IndexedDB
	try {
		if (window.indexedDB && window.indexedDB.databases) {
			window.indexedDB.databases().then((databases) => {
				databases.forEach((db) => {
					if (db.name) window.indexedDB.deleteDatabase(db.name);
				});
			});
			console.log("✅ IndexedDB cleared");
		}
	} catch (e) {
		console.error("❌ IndexedDB clear failed:", e);
	}

	// 6. Clear Cache storage
	try {
		if (window.caches) {
			caches.keys().then((names) => {
				names.forEach((name) => caches.delete(name));
			});
			console.log("✅ Cache storage cleared");
		}
	} catch (e) {
		console.error("❌ Cache storage clear failed:", e);
	}

	console.log("========================================");
	console.log("✅ ALL STORAGE CLEARED - RELOADING...");
	console.log("========================================");

	// Reload the page
	setTimeout(() => {
		window.location.reload();
	}, 1000);
}

// ==========================
// INDIVIDUAL FLAG FETCHING
// ==========================

async function fetchGateFlag() {
	console.log("🎯 Fetching feature gate flag...");

	const gateFallback = false;

	try {
		// Method 1: is_enabled() for feature gates
		const isGateEnabled = await mixpanel.flags.is_enabled(FLAGS.featureGate.key, gateFallback);
		// Method 2: get_variant_value() also works
		const gateVariant = await mixpanel.flags.get_variant_value(FLAGS.featureGate.key, gateFallback);

		// Check if fallback was used
		const gateFallbackUsed = (gateVariant === gateFallback && !isGateEnabled);

		// Update UI
		updateUIElement('gateEnabled', isGateEnabled ? '✅ TRUE' : '❌ FALSE', isGateEnabled ? 'true' : 'false');
		updateUIElement('gateVariant', String(gateVariant));
		updateUIElement('gateFallback', gateFallbackUsed ? 'Yes' : 'No');

		console.log(`✅ Gate flag: ${isGateEnabled ? 'Enabled' : 'Disabled'}`);

	} catch (error) {
		console.error("❌ ERROR FETCHING GATE FLAG:", error);
	}
}

async function fetchExperimentFlag() {
	console.log("🎲 Fetching experiment flag...");

	const experimentFallback = "Control";

	try {
		const experimentVariant = await mixpanel.flags.get_variant_value(FLAGS.experiment.key, experimentFallback);

		// Update UI
		updateUIElement('experimentVariant', experimentVariant);
		updateUIElement('experimentExposure', '✅ Tracked');
		console.log(`✅ Experiment variant: ${experimentVariant}`);

	} catch (error) {
		console.error("❌ ERROR FETCHING EXPERIMENT FLAG:", error);
	}
}

async function fetchConfigFlag() {
	console.log("⚙️ Fetching dynamic config flag...");

	const configFallback = JSON.stringify({ default: true });

	try {
		const configValue = await mixpanel.flags.get_variant_value(FLAGS.dynamicConfig.key, configFallback);

		// Parse if it's a string
		let parsedConfig = configValue;
		if (typeof configValue === 'string') {
			try {
				parsedConfig = JSON.parse(configValue);
			} catch (e) {
				// Keep as string if not parseable
			}
		}

		// Update UI
		updateUIElement('configValue', typeof parsedConfig === 'object' ?
			JSON.stringify(parsedConfig, null, 2) : String(configValue));
		console.log(`✅ Config flag fetched: ${typeof parsedConfig === 'object' ? 'Object' : configValue}`);

	} catch (error) {
		console.error("❌ ERROR FETCHING CONFIG FLAG:", error);
	}
}

async function fetchRuntimeFlag() {
	console.log("🎯 Fetching runtime-targeted flag...");

	// Update URL param display
	updateUIElement('urlRuntimeParam', URL_PARAMS.runtime || 'none');

	const isRuntimeEnabled = URL_PARAMS.runtime === 'true';

	if (isRuntimeEnabled) {
		console.log("✅ User ELIGIBLE - runtime targeting active (?runtime=true)");
		console.log("📡 Flag targets users where: custom_properties.runtime = \"true\"");
		console.log("🎲 Eligible users get randomly assigned a variant");
	} else {
		console.log("⚠️ User NOT ELIGIBLE - no runtime targeting");
		console.log("💡 Add ?runtime=true to become eligible for this flag");
		console.log("📌 Non-eligible users always receive the fallback value");
	}

	try {
		const runtimeFallback = "not-targeted";
		const runtimeValue = await mixpanel.flags.get_variant_value(FLAGS.runtimeExample.key, runtimeFallback);

		// Parse if it's a JSON string
		let parsedValue = runtimeValue;
		if (typeof runtimeValue === 'string' && runtimeValue !== runtimeFallback) {
			try {
				parsedValue = JSON.parse(runtimeValue);
			} catch (e) {
				// Not JSON, keep as string
			}
		}

		console.log(`✅ Runtime flag fetched: ${typeof parsedValue === 'object' ? JSON.stringify(parsedValue) : parsedValue}`);

		let variantName = '';
		let status = '';
		let displayPayload = '';

		if (runtimeValue === runtimeFallback) {
			// User is not eligible (no ?runtime=true)
			variantName = 'Not Eligible';
			status = '(fallback - add ?runtime=true for eligibility)';
			displayPayload = '❌ User not eligible for this flag';
		} else {
			// User is eligible and got assigned a variant
			// Extract variant name from the payload if it's an object
			if (typeof parsedValue === 'object' && parsedValue.hello) {
				variantName = parsedValue.hello;
			} else {
				variantName = String(runtimeValue);
			}
			status = '(eligible & assigned)';
			displayPayload = typeof parsedValue === 'object' ?
				`✅ Eligible! Assigned variant: ${variantName}\n${JSON.stringify(parsedValue, null, 2)}` :
				`✅ Eligible! Assigned variant: ${parsedValue}`;
		}

		updateUIElement('runtimeVariant', `${variantName} ${status}`);
		updateUIElement('runtimePayload', displayPayload);

		if (isRuntimeEnabled && runtimeValue !== runtimeFallback) {
			const display = typeof parsedValue === 'object' ? JSON.stringify(parsedValue) : runtimeValue;
			console.log(`✨ Runtime targeting successful! Assigned variant: "${display}"`);
		} else if (!isRuntimeEnabled) {
			console.log(`ℹ️  Runtime targeting disabled - received fallback value`);
		}

	} catch (error) {
		console.error("❌ ERROR FETCHING RUNTIME FLAG:", error);
	}
}

async function updateRuntimeContext() {
	// Toggle runtime targeting on/off
	const currentEnabled = window.runtimeTargetingEnabled || false;
	const newEnabled = !currentEnabled;

	const newContext = {
		custom_properties: {
			runtime: newEnabled ? 'true' : 'false'  // Toggle between "true" and "false"
		}
	};

	console.log(`🔄 ${newEnabled ? 'ENABLING' : 'DISABLING'} runtime targeting...`);

	try {
		// Update the context
		await mixpanel.flags.update_context(newContext);
		window.runtimeTargetingEnabled = newEnabled;

		if (newEnabled) {
			console.log(`✅ User now ELIGIBLE - runtime set to "true"`);
			updateUIElement('runtimeContext', `runtime: "true"`);
		} else {
			console.log(`✅ User now NOT ELIGIBLE - runtime set to "false"`);
			updateUIElement('runtimeContext', `runtime: "false"`);
		}

		// Re-fetch to see the effect
		console.log("🔄 Re-fetching runtime flag to see the effect...");
		setTimeout(fetchRuntimeFlag, 500);

	} catch (error) {
		console.error("❌ ERROR UPDATING CONTEXT:", error);
	}
}

// ==========================
// COHORT/BEHAVIORAL TARGETING
// ==========================

async function fireTriggerEvent() {
	console.log("\n========================================");
	console.log("🎯 FIRING TRIGGER EVENT FOR COHORT");
	console.log("========================================");

	try {
		// Fire the trigger event
		mixpanel.track('some trigger event', {
			timestamp: new Date().toISOString(),
			source: 'feature-flags-demo',
			action: 'manual-trigger'
		});

		console.log("✅ Event fired: 'some trigger event'");
		console.log("📊 Event properties sent:");
		console.log("   - timestamp: " + new Date().toISOString());
		console.log("   - source: feature-flags-demo");
		console.log("   - action: manual-trigger");

		// Update UI to show event was fired
		updateUIElement('cohortEvent', '✅ Event fired!');

		console.log("\n⏳ Cohort evaluation may take a moment...");
		console.log("💡 Mixpanel needs to process the event and update cohort membership");
		console.log("🔄 Click 'Refresh' or wait for next flag fetch to see updated eligibility");

		// Automatically refresh after a delay
		setTimeout(() => {
			console.log("🔄 Auto-refreshing cohort flag...");
			fetchCohortFlag();
		}, 2000);

	} catch (error) {
		console.error("❌ ERROR FIRING EVENT:", error);
		updateUIElement('cohortEvent', '❌ Error');
	}
}

async function fetchCohortFlag() {
	console.log("🎯 Fetching cohort flag...");

	try {
		const cohortValue = await mixpanel.flags.get_variant_value(FLAGS.cohortExample.key, false);

		console.log(`📦 Cohort flag value: ${cohortValue}`);

		if (cohortValue === true) {
			// User is in the cohort
			console.log("✅ SUCCESS! User is now in the cohort");
			console.log("🎉 Flag returned: 'awesome'");
			console.log("📝 User has performed 'some trigger event' and qualifies");

			updateUIElement('cohortStatus', '✅ Eligible (in cohort)');
			updateUIElement('cohortVariant', 'awesome');
			updateUIElement('cohortEvent', '✅ Event recognized');
		} else {
			// User is not in the cohort
			console.log("⚠️ User not yet in cohort");
			console.log("💡 Fire the trigger event to become eligible");
			console.log("⏱️ If you just fired the event, it may need more time to process");

			updateUIElement('cohortStatus', '❌ Not Eligible (not in cohort)');
			updateUIElement('cohortVariant', 'false (not in cohort)');
		}

	} catch (error) {
		console.error("❌ ERROR FETCHING COHORT FLAG:", error);
	}
}

// ==========================
// VIEW USER PROFILE
// ==========================

function viewUserProfile() {
	console.log("\n========================================");
	console.log("👤 OPENING USER PROFILE IN MIXPANEL");
	console.log("========================================");

	const distinctId = mixpanel.get_distinct_id();
	console.log(`📝 Distinct ID: ${distinctId}`);

	const profileUrl = `https://mixpanel.com/project/3971270/view/4466983/app/profile#distinct_id=${encodeURIComponent(distinctId)}`;
	console.log(`🔗 Opening: ${profileUrl}`);

	window.open(profileUrl, '_blank');
	console.log("✅ User profile opened in new tab!");
}

// ==========================
// URL PARAM TESTING
// ==========================

async function testURLParams() {
	console.log("\n========================================");
	console.log("🔗 TESTING URL PARAMETER ELIGIBILITY");
	console.log("========================================");

	console.log("📝 How runtime targeting works:");
	console.log("   • ?runtime=true → User becomes ELIGIBLE for the flag");
	console.log("   • No parameter  → User NOT ELIGIBLE (gets fallback)");
	console.log("");
	console.log("🔗 Try these URLs:");
	const enableUrl = window.location.origin + window.location.pathname + "?runtime=true";
	const disableUrl = window.location.origin + window.location.pathname;
	console.log(`   Enable eligibility:  ${enableUrl}`);
	console.log(`   Disable eligibility: ${disableUrl}`);

	if (URL_PARAMS.runtime === 'true') {
		console.log(`\n✅ Currently ELIGIBLE (runtime=true)`);
		console.log("🎲 You'll be randomly assigned a variant");
	} else if (URL_PARAMS.runtime) {
		console.log(`\n⚠️ Invalid value: runtime=${URL_PARAMS.runtime}`);
		console.log("💡 Use ?runtime=true to enable eligibility");
	} else {
		console.log("\n⚠️ NOT ELIGIBLE (no runtime parameter)");
		console.log("💡 Add ?runtime=true to become eligible");
	}

	console.log("\n🔄 Fetching runtime flag to check status...");
	const runtimeValue = await mixpanel.flags.get_variant_value(FLAGS.runtimeExample.key, "not-targeted");

	// Parse if it's a JSON string
	let parsedValue = runtimeValue;
	if (typeof runtimeValue === 'string' && runtimeValue !== "not-targeted") {
		try {
			parsedValue = JSON.parse(runtimeValue);
		} catch (e) {
			// Not JSON, keep as string
		}
	}

	if (runtimeValue === "not-targeted") {
		console.log(`📦 Result: ${runtimeValue} (fallback - not eligible)`);
	} else {
		const display = typeof parsedValue === 'object' ? JSON.stringify(parsedValue) : runtimeValue;
		console.log(`📦 Result: ${display} (eligible & assigned)`);
	}
}

// ==========================
// TERMINAL INTERACTIONS
// ==========================

function clearTerminal() {
	const terminalOutput = document.getElementById('terminalOutput');
	if (terminalOutput) {
		terminalOutput.innerHTML = '<div class="terminal-line info">🧹 Terminal cleared</div>';
	}
}

async function handleTerminalInput(event) {
	if (event.key === 'Enter') {
		const input = event.target;
		const command = input.value.trim();

		if (!command) return;

		// Echo the command
		console.log(`$ ${command}`);

		try {
			// Execute the JavaScript
			const result = await eval(command);
			if (result !== undefined) {
				console.log(`→ ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`);
			}
		} catch (error) {
			console.error(`❌ ${error.message}`);
		}

		// Clear input
		input.value = '';
	}
}

// ==========================
// EDUCATIONAL HELPERS
// ==========================

// Expose some functions globally for console experimentation
window.mixpanelDemo = {
	fetchAllFlags,
	fetchGateFlag,
	fetchExperimentFlag,
	fetchConfigFlag,
	fetchRuntimeFlag,
	updateContext,
	updateRuntimeContext,
	simulateRuntimeTargeting,
	testURLParams,
	resetUser,
	viewUserProfile,
	FLAGS,

	// Direct flag access for learning
	async checkGate(fallback = false) {
		const result = await mixpanel.flags.is_enabled(FLAGS.featureGate.key, fallback);
		console.log(`🎯 Feature Gate is: ${result ? 'ENABLED' : 'DISABLED'}`);
		return result;
	},

	async getExperiment(fallback = "Control") {
		const result = await mixpanel.flags.get_variant_value(FLAGS.experiment.key, fallback);
		console.log(`🎲 Experiment Variant: ${result}`);
		return result;
	},

	async getConfig(fallback = {}) {
		const result = await mixpanel.flags.get_variant_value(FLAGS.dynamicConfig.key, JSON.stringify(fallback));
		console.log(`⚙️ Config Value: ${result}`);
		return result;
	},

	async getRuntime(fallback = {}) {
		const result = await mixpanel.flags.get_variant_value(FLAGS.runtimeExample.key, JSON.stringify(fallback));
		// Parse if it's JSON
		let parsed = result;
		try {
			parsed = JSON.parse(result);
		} catch (e) {
			// Keep as string
		}
		const display = typeof parsed === 'object' ? JSON.stringify(parsed) : result;
		console.log(`🎯 Runtime Value: ${display}`);
		return result;
	},

	async getCohort() {
		const result = await mixpanel.flags.get_variant_value(FLAGS.cohortExample.key, false);
		console.log(`🎯 Cohort Flag: ${result ? 'awesome (in cohort)' : 'false (not in cohort)'}`);
		return result;
	},

	async fireEvent() {
		mixpanel.track('some trigger event', { source: 'console' });
		console.log("✅ Event 'some trigger event' fired!");
		console.log("⏱️ Cohort membership may take a moment to update");
		return true;
	}
};

// Make functions available globally for HTML buttons
window.clearTerminal = clearTerminal;
window.handleTerminalInput = handleTerminalInput;
window.testURLParams = testURLParams;
window.fetchGateFlag = fetchGateFlag;
window.fetchExperimentFlag = fetchExperimentFlag;
window.fetchConfigFlag = fetchConfigFlag;
window.fetchRuntimeFlag = fetchRuntimeFlag;
window.updateRuntimeContext = updateRuntimeContext;
window.viewUserProfile = viewUserProfile;
window.fetchAllFlags = fetchAllFlags;
window.updateContext = updateContext;
window.simulateRuntimeTargeting = simulateRuntimeTargeting;
window.resetUser = resetUser;
window.fireTriggerEvent = fireTriggerEvent;
window.fetchCohortFlag = fetchCohortFlag;
window.simulateBehavioralTargeting = simulateBehavioralTargeting;

console.log("💡 Use window.mixpanelDemo in console for testing");