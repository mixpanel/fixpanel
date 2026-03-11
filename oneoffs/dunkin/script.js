/**
 * Dunkin' Rewards - App Logic
 * Screen navigation, interactions, and console error triggers
 */

(function () {
	// ========================================
	// SCREEN NAVIGATION
	// ========================================

	var currentScreen = "screen-home";
	var screenHistory = [];

	function navigateTo(screenId, addToHistory) {
		if (addToHistory === undefined) addToHistory = true;
		if (screenId === currentScreen) return;

		var screens = document.querySelectorAll(".screen");
		for (var i = 0; i < screens.length; i++) {
			screens[i].classList.remove("active");
		}

		var target = document.getElementById(screenId);
		if (target) {
			target.classList.add("active");
			// Reset scroll position
			var scroll = target.querySelector(".screen-scroll");
			if (scroll) scroll.scrollTop = 0;
		}

		if (addToHistory) {
			screenHistory.push(currentScreen);
		}
		currentScreen = screenId;
		updateTabBar(screenId);
	}

	function goBack() {
		if (screenHistory.length > 0) {
			var prev = screenHistory.pop();
			navigateTo(prev, false);
		}
	}

	function updateTabBar(screenId) {
		var screenToTab = {
			"screen-menu": 0,
			"screen-offers": 1,
			"screen-home": 2,
			"screen-rewards": 3,
			"screen-account": 4,
		};

		var tabs = document.querySelectorAll(".tab-item");
		for (var i = 0; i < tabs.length; i++) {
			tabs[i].classList.remove("active");
		}

		var idx = screenToTab[screenId];
		if (idx !== undefined && tabs[idx]) {
			tabs[idx].classList.add("active");
		}
	}

	// ========================================
	// TOAST
	// ========================================

	function showToast(message) {
		var toast = document.getElementById("toast");
		toast.textContent = message;
		toast.classList.add("show");
		setTimeout(function () {
			toast.classList.remove("show");
		}, 2200);
	}

	// ========================================
	// ERROR TRIGGER FUNCTIONS
	// ========================================

	function flashButton(btn) {
		btn.classList.remove("flash");
		void btn.offsetWidth; // force reflow
		btn.classList.add("flash");
	}

	function triggerTypeError() {
		console.log("[ERROR DEMO] Triggering TypeError...");
		setTimeout(function () {
			var obj = null;
			obj.getRewardsBalance();
		}, 0);
	}

	function triggerReferenceError() {
		console.log("[ERROR DEMO] Triggering ReferenceError...");
		setTimeout(function () {
			dunkinRewardsAPI.fetchUserProfile();
		}, 0);
	}

	function triggerRangeError() {
		console.log("[ERROR DEMO] Triggering RangeError...");
		setTimeout(function () {
			new Array(-1);
		}, 0);
	}

	function triggerSyntaxError() {
		console.log("[ERROR DEMO] Triggering SyntaxError...");
		setTimeout(function () {
			eval("{");
		}, 0);
	}

	function triggerURIError() {
		console.log("[ERROR DEMO] Triggering URIError...");
		setTimeout(function () {
			decodeURIComponent("%");
		}, 0);
	}

	function triggerNetworkError() {
		console.log("[ERROR DEMO] Triggering Network Error...");
		fetch("https://api.dunkindonuts.fake/v1/orders/DD-99421")
			.then(function (r) {
				return r.json();
			})
			.catch(function (err) {
				console.error("[NETWORK ERROR] Failed to fetch order:", err.message);
			});
	}

	function triggerUnhandledRejection() {
		console.log("[ERROR DEMO] Triggering Unhandled Promise Rejection...");
		Promise.reject(
			new Error("Payment processing failed for order #DD-99421")
		);
	}

	function triggerCustomError() {
		console.log("[ERROR DEMO] Triggering Custom Error...");
		setTimeout(function () {
			throw new Error(
				"Dunkin Rewards API: Unable to load user points balance (HTTP 503)"
			);
		}, 0);
	}

	function triggerConsoleError() {
		console.error(
			"[DUNKIN APP ERROR] Failed to load reward tier data:",
			{
				endpoint: "/api/rewards/tiers",
				status: 500,
				message: "Internal Server Error",
				userId: "santhi-v-12345",
				timestamp: new Date().toISOString(),
			}
		);
	}

	function triggerConsoleWarn() {
		console.warn(
			"[DUNKIN APP WARNING] Session token expiring in 30 seconds",
			{
				tokenExpiry: new Date(Date.now() + 30000).toISOString(),
				userId: "santhi-v-12345",
				action: "auto-refresh scheduled",
			}
		);
	}

	// ========================================
	// INIT ON DOM READY
	// ========================================

	function init() {
		// Tab bar navigation
		var tabs = document.querySelectorAll(".tab-item");
		for (var i = 0; i < tabs.length; i++) {
			tabs[i].addEventListener("click", function () {
				var screen = this.getAttribute("data-screen");
				if (screen) {
					screenHistory = [];
					navigateTo(screen);
				}
			});
		}

		// Set initial active tab
		updateTabBar("screen-home");

		// Back buttons
		var backBtns = document.querySelectorAll("[data-back]");
		for (var i = 0; i < backBtns.length; i++) {
			backBtns[i].addEventListener("click", goBack);
		}

		// Category items -> navigate to item detail
		var categories = document.querySelectorAll("[data-navigate]");
		for (var i = 0; i < categories.length; i++) {
			categories[i].addEventListener("click", function () {
				var target = this.getAttribute("data-navigate");
				if (target) navigateTo(target);
			});
		}

		// Choose Reward button -> rewards screen
		var chooseReward = document.querySelector(".btn-choose-reward");
		if (chooseReward) {
			chooseReward.addEventListener("click", function () {
				navigateTo("screen-rewards");
			});
		}

		// Reorder buttons
		var reorderBtns = document.querySelectorAll(".btn-reorder");
		for (var i = 0; i < reorderBtns.length; i++) {
			reorderBtns[i].addEventListener("click", function () {
				showToast("Reorder added to cart!");
			});
		}

		// Quantity controls
		var qtyValue = document.querySelector(".qty-value");
		var qtyBtns = document.querySelectorAll("[data-qty]");
		for (var i = 0; i < qtyBtns.length; i++) {
			qtyBtns[i].addEventListener("click", function () {
				var current = parseInt(qtyValue.textContent);
				if (this.getAttribute("data-qty") === "plus") {
					qtyValue.textContent = current + 1;
				} else if (current > 1) {
					qtyValue.textContent = current - 1;
				}
			});
		}

		// Size selector
		var sizeBtns = document.querySelectorAll(".size-btn");
		for (var i = 0; i < sizeBtns.length; i++) {
			sizeBtns[i].addEventListener("click", function () {
				for (var j = 0; j < sizeBtns.length; j++) {
					sizeBtns[j].classList.remove("active");
				}
				this.classList.add("active");
			});
		}

		// Menu tabs
		var menuTabs = document.querySelectorAll(".menu-tab");
		for (var i = 0; i < menuTabs.length; i++) {
			menuTabs[i].addEventListener("click", function () {
				for (var j = 0; j < menuTabs.length; j++) {
					menuTabs[j].classList.remove("active");
				}
				this.classList.add("active");
			});
		}

		// Add to Order button
		var addToOrder = document.querySelector(".btn-add-to-order");
		if (addToOrder) {
			addToOrder.addEventListener("click", function () {
				showToast("Added to order!");
				setTimeout(function () {
					goBack();
				}, 800);
			});
		}

		// Convert Points button
		var convertBtn = document.querySelector(".btn-convert-points");
		if (convertBtn) {
			convertBtn.addEventListener("click", function () {
				showToast("Points converted!");
			});
		}

		// Reward radio selection
		var rewardItems = document.querySelectorAll(
			".reward-tier-item:not(.locked)"
		);
		for (var i = 0; i < rewardItems.length; i++) {
			rewardItems[i].addEventListener("click", function () {
				var radios = document.querySelectorAll(".reward-radio");
				for (var j = 0; j < radios.length; j++) {
					radios[j].classList.remove("selected");
				}
				var radio = this.querySelector(".reward-radio");
				if (radio) radio.classList.add("selected");
			});
		}

		// Customization headers (toggle visual feedback)
		var customHeaders = document.querySelectorAll(".customization-header");
		for (var i = 0; i < customHeaders.length; i++) {
			customHeaders[i].addEventListener("click", function () {
				var chevron = this.querySelector(".chevron-down");
				if (chevron) {
					var isOpen = chevron.style.transform === "rotate(180deg)";
					chevron.style.transform = isOpen ? "" : "rotate(180deg)";
				}
			});
		}

		// ========================================
		// ERROR PANEL
		// ========================================

		var toggle = document.getElementById("errorPanelToggle");
		var panel = document.getElementById("errorPanel");
		var closeBtn = document.getElementById("errorPanelClose");

		toggle.addEventListener("click", function () {
			panel.classList.toggle("open");
		});

		closeBtn.addEventListener("click", function () {
			panel.classList.remove("open");
		});

		// Reset button
		var resetBtn = document.getElementById("btnReset");
		if (resetBtn) {
			resetBtn.addEventListener("click", function () {
				if (typeof window.RESET === "function") {
					window.RESET();
				} else {
					window.location.reload();
				}
			});
		}

		// Wire up error buttons
		var errorMap = {
			"btn-type-error": triggerTypeError,
			"btn-ref-error": triggerReferenceError,
			"btn-range-error": triggerRangeError,
			"btn-syntax-error": triggerSyntaxError,
			"btn-uri-error": triggerURIError,
			"btn-network-error": triggerNetworkError,
			"btn-promise-error": triggerUnhandledRejection,
			"btn-custom-error": triggerCustomError,
			"btn-console-error": triggerConsoleError,
			"btn-console-warn": triggerConsoleWarn,
		};

		Object.keys(errorMap).forEach(function (id) {
			var btn = document.getElementById(id);
			if (btn) {
				btn.addEventListener("click", function () {
					flashButton(this);
					showToast("Triggered: " + this.textContent);
					errorMap[id]();
				});
			}
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
