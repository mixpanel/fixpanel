document.addEventListener("DOMContentLoaded", () => {
	// Get the search input element
	const searchInput = document.getElementById("search-input");

	// If we're on a search results page, focus the search input and get the query parameter
	if (searchInput) {
		searchInput.focus();

		// Get the query parameter from the URL
		const urlParams = new URLSearchParams(window.location.search);
		const query = urlParams.get("query");

		// If there's a query parameter, set it as the value of the search input
		if (query) {
			searchInput.value = query;
		}
	}

	const searchForm = document.querySelector('.search-container form');

	if (searchForm) {
		searchForm.addEventListener('submit', (event) => {
			event.preventDefault();

			// Track the search event
			if (typeof mixpanel !== 'undefined' && typeof mixpanel.track === 'function') {
				mixpanel.track('search');
			}

			// Redirect to the no-results page (or use form's action attribute)
			window.location.href = searchForm.getAttribute('action') || 'no-results.html';
		});
	}

	const avatarImages = [
		"/images/avatar1.png",
		"/images/avatar2.png",
		"/images/avatar3.png",
		"/images/avatar4.png",
		"/images/avatar5.png",
		"/images/avatar6.png",
		'/images/avatar7.png',
		'/images/avatar8.png',
		'/images/avatar9.png'

	];


	// Set random avatar image
	const avatarElement = document.getElementById("user-avatar");
	if (avatarElement) {
		// Array of avatar images

		// Select a random avatar
		const randomAvatar = avatarImages[Math.floor(Math.random() * avatarImages.length)];

		// Create and append the image element
		const imgElement = document.createElement("img");
		imgElement.src = randomAvatar;
		imgElement.alt = "User avatar";
		avatarElement.appendChild(imgElement);
	}

	// Set random channel avatar
	const avatarChannelElement = document.getElementById("channel-avatar");
	if (avatarChannelElement) {

		// Select a random avatar
		const randomAvatar = avatarImages[Math.floor(Math.random() * avatarImages.length)];

		// Create and append the image element
		const imgElement = document.createElement("img");
		imgElement.src = randomAvatar;
		imgElement.alt = "channel avatar";
		avatarChannelElement.appendChild(imgElement);
	}



	// Add click event listeners to video cards
	const videoCards = document.querySelectorAll(".video-card, .related-video-card");
	videoCards.forEach((card) => {
		card.addEventListener("click", function () {
			const videoTitle = this.querySelector("h3").textContent;
			const channelName = this.querySelector(".channel").textContent;

			// Create URL with parameters
			const url = `video-player.html?title=${encodeURIComponent(videoTitle)}&channel=${encodeURIComponent(channelName)}`;

			// Navigate to the video player page
			window.location.href = url;
		});
	});

	// Check if we're on the video player page
	const videoTitle = document.getElementById("video-title");
	const channelName = document.getElementById("channel-name");

	if (videoTitle && channelName) {
		// Get parameters from URL
		const urlParams = new URLSearchParams(window.location.search);
		const title = urlParams.get("title");
		const channel = urlParams.get("channel");

		// Set video title and channel name
		if (title) {
			videoTitle.textContent = title;
			document.title = `${title} - MeTube`;
		}

		if (channel) {
			channelName.textContent = channel;
		}

		// Set random view count
		const viewsElement = document.getElementById("video-views");
		if (viewsElement) {
			const viewCount = Math.floor(Math.random() * 1000000);
			let formattedViews = "";

			if (viewCount > 1000000) {
				formattedViews = `${(viewCount / 1000000).toFixed(1)}M`;
			} else if (viewCount > 1000) {
				formattedViews = `${(viewCount / 1000).toFixed(1)}K`;
			} else {
				formattedViews = viewCount;
			}

			viewsElement.textContent = `${formattedViews} views • May 22, 2025`;
		}

		// Set video description
		const descriptionElement = document.getElementById("video-description-text");
		if (descriptionElement) {
			descriptionElement.textContent = `This is a detailed description of "${title}". In this video, we explore various aspects of the topic and provide valuable insights. Don't forget to like and subscribe for more content like this!`;
		}

		// Add click event for the play button
		const playIcon = document.querySelector(".play-icon");
		if (playIcon) {
			playIcon.addEventListener("click", () => {
				alert("This is a mock video player. In a real application, the video would start playing now.");
			});
		}

		// Add click events for video controls
		const controlButtons = document.querySelectorAll(".control-btn");
		controlButtons.forEach((button) => {
			button.addEventListener("click", function () {
				alert(`You clicked the ${this.classList[1]} button. This would control the video in a real player.`);
			});
		});
	}

	// Comment: To switch between no-results.html and no-results-with-featured.html
	// 1. From no-results.html, click the "View version with featured videos" link
	// 2. From no-results-with-featured.html, click the "View version without featured videos" link
	// This provides an easy way to toggle between the two versions for testing
});



//MIXPANEL
// CUSTOMIZE THESE:
var MIXPANEL_TOKEN = `32fd7149e2ac0cc030bda4c4b839b813`; // you MUST set this to your project token: https://bit.ly/42HC8I8
var MIXPANEL_PROXY = `https://express-proxy-lmozz6xkha-uc.a.run.app`; // you SHOULD use a proxy; use mine or set your own: https://bit.ly/3GDWzgx
var MIXPANEL_DEBUG = true; // set to true to see debug messages in the console

// OPTIONAL: Function returning user identity as a string (sync OR async!) https://bit.ly/4m2TTcn
// ex sync: () => { return window.myGlobalUserId || '' }
// ex async: () => { return await fetch('/my-api/get-user-id').then(res => res.text()) }
var MIXPANEL_USER_ID = async () => {
	// example async function
	// return await fetch('/my-api/get-user-id').then(res => res.text());

	// example sync:
	// return window.myGlobalUserId || '';
	return '';
};


var MIXPANEL_CUSTOM_LIB_URL = `${MIXPANEL_PROXY}/lib.min.js`;
(function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for (var d = {}, e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);

// build a function that returns foo, bar, baz, or qux 25% of the time each
function getRandomChoice() {
    const choices = [
        'foo', 'bar', 'baz', 'qux',
        'alpha', 'beta', 'gamma', 'delta',
        'omega', 'sigma', 'lambda', 'zeta',
        'pixel', 'quantum', 'neutron'
    ];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function MONKEY_PATCH_REGISTER() {
	// Store the original register method before overriding it
	const originalRegister = mixpanel.register;

	// Override the register method with our enhanced version
	mixpanel.register = function (properties, options) {
		if (!properties || typeof properties !== 'object') {
			return originalRegister.call(this, properties, options);
		}

		const transformedProperties = {};

		for (const [key, value] of Object.entries(properties)) {
			if (typeof value === 'function') {
				try {
					// Call the function to get the primitive value
					const result = value();
					transformedProperties[key] = result;					
				} catch (error) {
					// Handle function execution errors gracefully
					console.warn(`Function for property '${key}' threw an error:`, error);
					transformedProperties[key] = value?.toString();
				}
			} else {
				// Keep non-function values as-is
				transformedProperties[key] = value;
			}
		}
		return originalRegister.call(this, transformedProperties, options);
	};
}

// Actual initialization with async support
async function initMixpanel() {
	const userId = await safelyResolveUserId(MIXPANEL_USER_ID);

	// spec: https://bit.ly/4jWNkpS
	window.mixpanel.init(MIXPANEL_TOKEN, {

		//autocapture
		autocapture: {
			pageview: "full-url",
			click: true,
			input: true,
			scroll: true,
			submit: true,
			capture_text_content: true
		},

		//session replay
		record_sessions_percent: 100,
		record_inline_images: true,
		record_collect_fonts: true,
		record_mask_text_selector: "nope",
		record_block_selector: "nope",
		record_block_class: "nope",

		// favorites
		ignore_dnt: true,
		batch_flush_interval_ms: 0,
		api_host: MIXPANEL_PROXY,
		debug: MIXPANEL_DEBUG,
		api_payload_format: 'json',
		api_transport: 'XHR',
		persistence: "localStorage",

		// id management
		loaded: function (mixpanel) {
			MONKEY_PATCH_REGISTER();
			if (MIXPANEL_DEBUG) console.log("[MIXPANEL] library loaded successfully.");
			if (userId) {
				mixpanel.identify(userId);
				if (MIXPANEL_DEBUG) console.log("[MIXPANEL] user identified as:", userId);
			} else if (MIXPANEL_DEBUG) {
				console.warn("[MIXPANEL] No userId resolved; tracking anonymously.");
			}

			window.RESET = function () {
				setTimeout(() => {
					setTimeout(() => {
						console.log("[MIXPANEL]: STOP SESSION RECORDING");
						mixpanel.track("bounce");
						mixpanel.stop_session_recording();
						console.log("[MIXPANEL]: RESET");
						setTimeout(() => {
							mixpanel.reset();
							window.location.assign(`${window.location.origin}${getBasePath()}`);
						}, 500);
					}, 500);
				}, 500);
			};

			mixpanel.register({
				this_is_the_word: getRandomChoice,
				hello: "World"
			}); // Register the function that returns a random word

		}
	});
}

function getBasePath() {
	// Handles custom base path (like "/metube" on Neocities)
	const pathname = window.location.pathname;
	if (pathname.startsWith("/metube")) {
		return "/metube";
	}
	return "/";
}
// Internal utility to safely handle sync OR async functions
async function safelyResolveUserId(fn) {
	if (typeof fn !== 'function') return '';
	try {
		const result = fn();
		return result instanceof Promise ? await result : result;
	} catch (e) {
		console.error("[MIXPANEL] Error resolving MIXPANEL_USER_ID:", e);
		return '';
	}
}

// DOMContentLoaded handling
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initMixpanel);
else initMixpanel();


