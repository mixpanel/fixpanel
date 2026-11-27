/**
 * SchoolBites - Mixpanel Integration
 * School canteen ordering app (simulated React Native app). Parent registration
 * and ordering flows, two experiments, session replay with console recording.
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

	// Session replay (console output is captured too, as in the dunkin one-off)
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
		// Super properties go on before any custom event is sent.
		registerSuperProperties(mp);

		// Start session recording
		mp.start_session_recording();

		// Console branding
		console.log(
			"%c\n" +
			"=======================================================\n" +
			"   SchoolBites\n" +
			"   Mixpanel Demo\n" +
			"=======================================================",
			"color: #14866D; font-weight: bold; font-size: 12px;"
		);
		console.log(
			"%cMixpanel loaded - session recording active",
			"color: #22C55E; font-weight: bold;"
		);
		console.log(
			"%cProject: %chttps://mixpanel.com/project/3858723",
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

		// Let queued app calls run once the library's own queue has drained.
		setTimeout(flushMixpanelReady, 0);
	},
});

/**
 * Setup global RESET function
 */
function setupResetFunction(mp) {
	window.RESET = function () {
		console.log("[SchoolBites] Initiating reset...");

		var overlay = document.createElement("div");
		overlay.style.cssText =
			"position:fixed;inset:0;background:#000;opacity:0;z-index:9999;transition:opacity 0.5s ease;pointer-events:none;";
		document.body.appendChild(overlay);

		requestAnimationFrame(function () {
			overlay.style.opacity = "1";
		});

		setTimeout(function () {
			console.log("[SchoolBites] Stopping session recording...");
			mp.stop_session_recording();

			setTimeout(function () {
				console.log("[SchoolBites] Resetting user...");
				clearDemoState();
				mp.reset();
				window.location.assign(window.location.href.split("?")[0]);
			}, 300);
		}, 500);
	};

	window.sessionStartTime = Date.now();
}

// ============================================================
// READY QUEUE
// Every app call waits for the library's loaded callback, so super
// properties are registered first and events keep their order.
// ============================================================

var mpIsReady = false;
var mpReadyQueue = [];

function onMixpanelReady(fn) {
	if (mpIsReady) fn();
	else mpReadyQueue.push(fn);
}

function flushMixpanelReady() {
	mpIsReady = true;
	while (mpReadyQueue.length) mpReadyQueue.shift()();
}

// Each custom event gets a strictly increasing timestamp, so an exposure
// ($experiment_started) always lands before the event that follows it.
var lastEventMs = 0;

/**
 * Track custom events with standard properties
 */
function trackEvent(eventName, properties) {
	properties = properties || {};
	onMixpanelReady(function () {
		var now = Math.max(Date.now(), lastEventMs + 1);
		lastEventMs = now;
		properties.time = now / 1000;
		mixpanel.track(eventName, properties);
	});
}

// ============================================================
// STICKY DEMO STATE (per visitor, cleared by RESET)
// ============================================================

var SB_KEYS = ["sb_hero_variant", "sb_addon_variant", "sb_school_type", "sb_parent"];

function readStore(key) {
	try {
		return window.localStorage.getItem(key);
	} catch (e) {
		return null;
	}
}

function writeStore(key, value) {
	try {
		window.localStorage.setItem(key, value);
	} catch (e) {
		/* storage blocked: assignment just won't persist */
	}
}

function clearDemoState() {
	for (var i = 0; i < SB_KEYS.length; i++) {
		try {
			window.localStorage.removeItem(SB_KEYS[i]);
		} catch (e) {
			/* ignore */
		}
	}
}

function pickWeighted(options) {
	var total = 0;
	var i;
	for (i = 0; i < options.length; i++) total += options[i][1];
	var r = Math.random() * total;
	for (i = 0; i < options.length; i++) {
		r -= options[i][1];
		if (r < 0) return options[i][0];
	}
	return options[options.length - 1][0];
}

function stickyVariant(storageKey, variants) {
	var saved = readStore(storageKey);
	if (saved && variants.indexOf(saved) !== -1) return saved;
	var v = variants[Math.floor(Math.random() * variants.length)];
	writeStore(storageKey, v);
	return v;
}

function registerSuperProperties(mp) {
	// register_once keeps the visitor's channel across reloads; RESET re-rolls it.
	mp.register_once({
		app_release_channel: pickWeighted([["production_v4", 85], ["pilot_v5_beta", 15]]),
	});
	mp.register({ client_interface_locale: "en-AU" });
}

// ============================================================
// EXPERIMENTS
// ============================================================

var HERO_EXPERIMENT = "Mobile Landing Page Hero";
var HERO_VARIANTS = ["Control", "Streamlined Hero A", "Video Demo Hero B"];
var ADDON_EXPERIMENT = "Add-On Menu Format";
var ADDON_VARIANTS = ["Control", "Visual Tiled", "Standard"];

function getHeroVariant() {
	return stickyVariant("sb_hero_variant", HERO_VARIANTS);
}

function getAddonVariant() {
	return stickyVariant("sb_addon_variant", ADDON_VARIANTS);
}

function trackExperimentStarted(experimentName, variantName) {
	trackEvent("$experiment_started", {
		"Experiment name": experimentName,
		"Variant name": variantName,
	});
}

// ============================================================
// CUSTOM EVENT TRACKING HELPERS
// Called from script.js. Names and values follow the requester's taxonomy.
// ============================================================

// --- Flow 1: Registration ---

function trackLandingPageViewed(schoolAssociation) {
	trackEvent("Landing Page Viewed", {
		page_type: "mobile_hero",
		school_association: schoolAssociation,
	});
}

function startRegistrationTimer() {
	// $duration on "Parent Registered" = time from opening the sign-up screen
	onMixpanelReady(function () {
		mixpanel.time_event("Parent Registered");
	});
}

function trackParentRegistered(signupMethod) {
	trackEvent("Parent Registered", {
		signup_method: signupMethod,
		registration_channel: "mobile_web",
	});
}

/**
 * Identify the new parent and set their profile. Sticky profile values are
 * also registered as super properties so they ride along on later events.
 */
function identifyParent(parentId, profile) {
	onMixpanelReady(function () {
		mixpanel.identify(parentId);
		mixpanel.people.set(profile);
		mixpanel.register({
			family_profile: profile.family_profile,
			school_cluster: profile.school_cluster,
			preferred_payment_method: profile.preferred_payment_method,
			addon_menu_format: profile.addon_menu_format,
		});
	});
}

function updateParentProfile(props) {
	onMixpanelReady(function () {
		mixpanel.people.set(props);
		if (props.family_profile) mixpanel.register({ family_profile: props.family_profile });
	});
}

function trackStudentProfileAdded(yearLevel, hasDietaryFlag, studentToken) {
	trackEvent("Student Profile Added", {
		year_level: yearLevel,
		has_dietary_flag: hasDietaryFlag,
		student_reference_token: studentToken,
	});
}

function trackAppStoreLinkClicked(targetStore) {
	trackEvent("App Store Link Clicked", {
		target_store: targetStore,
		source_screen: "registration_success",
	});
}

// --- Flow 2: Ordering ---

function identifyReturningParent(parentId) {
	onMixpanelReady(function () {
		mixpanel.identify(parentId);
	});
}

function trackParentLoggedIn(loginType, isFirstSession) {
	trackEvent("Parent Logged In", {
		login_type: loginType,
		is_first_session: isFirstSession,
	});
}

function startOrderTimer() {
	// $duration on "Order Submitted" = time from first menu view to placing the order
	onMixpanelReady(function () {
		mixpanel.time_event("Order Submitted");
	});
}

function trackMenuViewed(serviceDate, mealSession, supplierCategory) {
	trackEvent("Menu Viewed", {
		service_date: serviceDate,
		meal_session: mealSession,
		supplier_category: supplierCategory,
	});
}

function trackItemAdded(itemType, customizationApplied, unitPrice) {
	trackEvent("Item Added", {
		item_type: itemType,
		customization_applied: customizationApplied,
		unit_price_aud: unitPrice,
	});
}

function setAddonExperimentProfile(variant) {
	onMixpanelReady(function () {
		mixpanel.people.set({ "Experiment: Add-On Menu Format": variant });
	});
}

function trackAddonShowcasePresented(showcaseFormat, eligibleCount) {
	trackEvent("Addon Showcase Presented", {
		showcase_format: showcaseFormat,
		eligible_addon_count: eligibleCount,
	});
}

function trackAddonItemSelected(addonCategory, addonPrice) {
	trackEvent("Addon Item Selected", {
		addon_category: addonCategory,
		addon_price_aud: addonPrice,
	});
}

function trackOrderSubmitted(orderAmount, items) {
	trackEvent("Order Submitted", {
		client_platform: "mobile_app",
		order_amount_aud: orderAmount,
		items: items,
	});
}

function trackAddonCheckoutCompleted(finalBasketValue, includesAddon) {
	trackEvent("Addon Checkout Completed", {
		final_basket_value_aud: finalBasketValue,
		includes_addon: includesAddon,
	});
}

function trackOrderConfirmed(supplierType, orderAmount, paymentStatus) {
	trackEvent("Order Confirmed", {
		supplier_type: supplierType,
		order_amount_aud: orderAmount,
		payment_status: paymentStatus,
	});
}
