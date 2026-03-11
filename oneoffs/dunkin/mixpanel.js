/**
 * Dunkin' Rewards - Mixpanel Integration
 * Session Replay with Console Error Recording Demo
 */

mixpanel.init(MIXPANEL_TOKEN, {
	api_host: MIXPANEL_PROXY,
	debug: true,
	ignore_dnt: true,

	// Autocapture configuration
	autocapture: {
		pageview: "full-url",
		click: true,
		input: true,
		scroll: true,
		submit: true,
		capture_text_content: true,
	},

	// Session replay - KEY FEATURE: record_console captures all console output
	record_console: true,
	record_sessions_percent: 100,
	record_heatmap_data: true,
	record_inline_images: true,
	record_collect_fonts: true,
	record_mask_text_selector: "nope",
	record_block_selector: "nope",
	record_block_class: "nope",

	// Performance settings
	batch_flush_interval_ms: 0,
	api_payload_format: "json",
	api_transport: "XHR",
	persistence: "localStorage",

	loaded: function (mp) {
		// Start session recording
		mp.start_session_recording();

		// Console messages that will be captured in session replay
		console.log(
			"%c\n" +
			"=======================================================\n" +
			"   DUNKIN' REWARDS - Console Error Demo\n" +
			"   Session Replay with record_console: true\n" +
			"=======================================================",
			"color: #FF671F; font-weight: bold; font-size: 12px;"
		);
		console.log(
			"%cMixpanel loaded - session recording active",
			"color: #22C55E; font-weight: bold;"
		);
		console.log(
			"%cAll console output (logs, errors, warnings) is being\n" +
			"captured and will appear in the session replay.",
			"color: #6B7280;"
		);
		console.log(
			"%cProject: %chttps://mixpanel.com/project/3858723/view/4354511/app/events",
			"color: #6B7280;",
			"color: #3B82F6;"
		);
		console.log(
			"%cTip: %cType %cRESET()%c in console to clear user data and start fresh",
			"color: #A855F7; font-weight: bold;",
			"color: #9CA3AF;",
			"color: #22C55E; font-weight: bold;",
			"color: #9CA3AF;"
		);
		console.log("");

		// Setup global RESET function
		setupResetFunction(mp);
	},
});

/**
 * Setup global RESET function
 */
function setupResetFunction(mp) {
	window.RESET = function () {
		console.log("[DUNKIN DEMO] Initiating reset...");

		var overlay = document.createElement("div");
		overlay.style.cssText =
			"position:fixed;inset:0;background:#000;opacity:0;z-index:9999;transition:opacity 0.5s ease;pointer-events:none;";
		document.body.appendChild(overlay);

		requestAnimationFrame(function () {
			overlay.style.opacity = "1";
		});

		setTimeout(function () {
			console.log("[DUNKIN DEMO] Stopping session recording...");
			mp.stop_session_recording();

			setTimeout(function () {
				console.log("[DUNKIN DEMO] Resetting user...");
				mp.reset();
				window.location.assign(window.location.href.split("?")[0]);
			}, 300);
		}, 500);
	};

	window.sessionStartTime = Date.now();
}
