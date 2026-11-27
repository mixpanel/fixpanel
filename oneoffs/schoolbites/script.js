/**
 * SchoolBites - App Logic
 * Screen navigation, registration flow, ordering flow.
 * Tracking calls live in mixpanel.js.
 */

(function () {
	// ========================================
	// DATA
	// ========================================

	var MENU = {
		recess_snack: [
			{ sku: "c7ed1343-3173-4db5-806b-fc543bc41748", name: "Fruit cup", desc: "Seasonal melon, grapes and berries", emoji: "🍓", type: "healthy_fresh_fruit", price: 3.5, tags: ["Vegan", "GF"] },
			{ sku: "a66d94a9-ff43-46ed-a688-f060ea328836", name: "Banana bread slice", desc: "Baked fresh this morning", emoji: "🍞", type: "snack_and_drink", price: 3.8, tags: ["Nut-free"] },
			{ sku: "b28676ac-bb52-4bdb-bb3e-be46c7e51e6e", name: "Cheese & crackers", desc: "Tasty cheddar with rice crackers", emoji: "🧀", type: "snack_and_drink", price: 4.2, tags: ["GF"] },
			{ sku: "f2d4f185-40e1-434e-a0a8-15e3dd6a3b44", name: "Apple slices & yoghurt", desc: "Crisp apple with vanilla yoghurt dip", emoji: "🍏", type: "healthy_fresh_fruit", price: 4.5, tags: ["Veg"] },
			{ sku: "0d90a9b3-9777-4fcf-8d23-71062ba8ee7f", name: "Mini muffin pack", desc: "Two blueberry mini muffins", emoji: "🧁", type: "snack_and_drink", price: 3.2, tags: ["Nut-free"] },
		],
		lunch_main: [
			{ sku: "aaf1a717-e684-48f6-b705-0ff364ac1839", name: "Chicken & salad wrap", desc: "Grilled chicken, lettuce, carrot, mayo", emoji: "🌯", type: "cold_sandwich", price: 8.5, tags: ["Popular"] },
			{ sku: "f7627c0a-e4c9-4b0b-b512-7b6d19775902", name: "Beef lasagne", desc: "Hearty home-style lasagne, served hot", emoji: "🍝", type: "hot_meal", price: 9.9, tags: ["Hot"] },
			{ sku: "4e8cbffe-4952-4143-96e8-e90e81cdc024", name: "Veggie fried rice", desc: "Egg, peas, corn and carrot", emoji: "🍚", type: "hot_meal", price: 8.9, tags: ["Hot", "Veg"] },
			{ sku: "371e463d-03b4-4981-8c64-37606e34a8ff", name: "Ham & cheese toastie", desc: "On wholemeal, toasted to order", emoji: "🥪", type: "hot_meal", price: 7.5, tags: ["Hot"] },
			{ sku: "1d6fa079-9eb5-475a-a527-804c464ec539", name: "Salad roll", desc: "Egg, lettuce, tomato, cucumber", emoji: "🥗", type: "cold_sandwich", price: 7.9, tags: ["Veg"] },
			{ sku: "3177ba76-4416-480d-ad79-3eec4ab49f5d", name: "Sushi rolls (4)", desc: "Teriyaki chicken and avocado", emoji: "🍣", type: "cold_sandwich", price: 9.5, tags: ["GF"] },
			{ sku: "15d25fa2-dc89-411b-bd08-9080359dcb13", name: "Fruit salad bowl", desc: "Big bowl of fresh-cut fruit", emoji: "🍉", type: "healthy_fresh_fruit", price: 5.5, tags: ["Vegan", "GF"] },
		],
		after_school_care: [
			{ sku: "aca1b2e9-f405-40af-97da-308dd9250916", name: "Pasta bake", desc: "Cheesy tomato pasta, served warm", emoji: "🧆", type: "hot_meal", price: 10.5, tags: ["Hot", "Veg"] },
			{ sku: "66f70b52-c378-4d23-af73-fdd13d615eac", name: "Pikelets & jam", desc: "Three pikelets with strawberry jam", emoji: "🥞", type: "snack_and_drink", price: 4.5, tags: ["Nut-free"] },
			{ sku: "0f959dfd-e10d-497c-bf26-1313ef360d2b", name: "Fresh fruit plate", desc: "Orange wedges, apple and grapes", emoji: "🍊", type: "healthy_fresh_fruit", price: 5.0, tags: ["Vegan"] },
			{ sku: "44484058-617f-4831-9965-d896e2b96e60", name: "Cheese toastie", desc: "Golden and gooey", emoji: "🧀", type: "hot_meal", price: 6.5, tags: ["Hot", "Veg"] },
		],
	};

	var OPTIONS = {
		hot_meal: [
			{ label: "Extra cheese", price: 1.0 },
			{ label: "Gluten-free option", price: 1.5 },
			{ label: "No sauce", price: 0 },
		],
		cold_sandwich: [
			{ label: "Gluten-free bread", price: 1.5 },
			{ label: "Add avocado", price: 1.0 },
			{ label: "No butter", price: 0 },
		],
		snack_and_drink: [
			{ label: "Nut-free version", price: 0 },
			{ label: "Add a water bottle", price: 1.5 },
		],
		healthy_fresh_fruit: [
			{ label: "Add yoghurt", price: 1.0 },
			{ label: "Cut into small pieces", price: 0 },
		],
	};

	var ADDONS = {
		water: { sku: "ad3e1b9c-fb1a-4f82-ba38-f2efd5bdcbbc", name: "Water bottle 600ml", emoji: "💧", category: "beverage", price: 2.5 },
		popper: { sku: "18be5962-0505-4a93-90c4-d045a3e0e4e8", name: "Apple juice popper", emoji: "🧃", category: "beverage", price: 3.0 },
		milk: { sku: "dadaa2f2-4f07-42cf-a49e-2ec3f992b614", name: "Chocolate milk", emoji: "🥛", category: "beverage", price: 3.5 },
		veggie: { sku: "f887f809-1fc1-4255-91f8-b8a95be23046", name: "Veggie sticks & hummus", emoji: "🥕", category: "healthy_snack", price: 4.0 },
		kebab: { sku: "48200dec-6198-4133-9e0c-12e6d5137d61", name: "Fruit kebab", emoji: "🍢", category: "healthy_snack", price: 3.5 },
		froyo: { sku: "b768facf-73d8-429c-8a91-11e8d393cd36", name: "Frozen yoghurt cup", emoji: "🍨", category: "frozen_treat", price: 4.5 },
		iceblock: { sku: "8a7abcf6-4899-493f-9f9c-09583c47f92f", name: "Fruit ice block", emoji: "🍧", category: "frozen_treat", price: 2.0 },
	};

	var ADDONS_BY_SESSION = {
		recess_snack: ["water", "popper", "kebab", "iceblock"],
		lunch_main: ["water", "popper", "milk", "veggie", "froyo", "iceblock"],
		after_school_care: ["water", "milk", "veggie", "kebab", "froyo"],
	};

	var DATE_LABEL = { today_same_day: "Today", tomorrow_next_day: "Tomorrow", advance_weekly: "This week" };
	var SESSION_LABEL = { recess_snack: "Recess", lunch_main: "Lunch", after_school_care: "After school" };
	var YEAR_LABEL = { prep_kindy: "Prep / Kindy", years_1_to_3: "Years 1–3", years_4_to_6: "Years 4–6", years_7_to_12: "Years 7–12" };

	function supplierFor(serviceDate, mealSession) {
		if (mealSession === "after_school_care") return "external_caterer";
		if (serviceDate === "advance_weekly" && mealSession === "lunch_main") return "external_caterer";
		return "school_canteen";
	}

	// ========================================
	// STATE
	// ========================================

	var state = {
		heroVariant: getHeroVariant(),
		schoolType: readStore("sb_school_type") || "primary_school",
		signupPayment: "flexi_wallet",
		parent: loadParent(),
		justRegistered: false,
		yearLevel: "years_1_to_3",
		activeKid: 0,
		serviceDate: "today_same_day",
		mealSession: "lunch_main",
		menuTimerStarted: false,
		cart: [],
		sheetItem: null,
		sheetQty: 1,
		addonExposed: false,
		placing: false,
	};

	function loadParent() {
		try {
			var raw = readStore("sb_parent");
			return raw ? JSON.parse(raw) : null;
		} catch (e) {
			return null;
		}
	}

	function saveParent() {
		writeStore("sb_parent", JSON.stringify(state.parent));
	}

	// ========================================
	// HELPERS
	// ========================================

	function $(id) {
		return document.getElementById(id);
	}

	function esc(s) {
		return String(s).replace(/[&<>"']/g, function (c) {
			return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
		});
	}

	function round2(n) {
		return Math.round(n * 100) / 100;
	}

	function money(n) {
		return "$" + n.toFixed(2);
	}

	function guid() {
		if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0;
			return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
		});
	}

	function pick(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	var toastTimer = null;
	function toast(msg) {
		var t = $("toast");
		t.textContent = msg;
		t.classList.add("show");
		clearTimeout(toastTimer);
		toastTimer = setTimeout(function () {
			t.classList.remove("show");
		}, 2200);
	}

	function selectInGroup(container, btn) {
		var all = container.querySelectorAll("[data-value]");
		for (var i = 0; i < all.length; i++) all[i].classList.toggle("active", all[i] === btn);
	}

	// ========================================
	// NAVIGATION
	// ========================================

	var currentScreen = "screen-landing";
	var screenHistory = [];

	function navigateTo(screenId, opts) {
		opts = opts || {};
		if (screenId === currentScreen) return;
		$(currentScreen).classList.remove("active");
		if (opts.clearHistory) screenHistory = [];
		else if (opts.addToHistory !== false) screenHistory.push(currentScreen);
		var target = $(screenId);
		target.classList.add("active");
		var scroll = target.querySelector(".screen-scroll");
		if (scroll) scroll.scrollTop = 0;
		currentScreen = screenId;
	}

	function goBack() {
		if (!screenHistory.length) return;
		navigateTo(screenHistory.pop(), { addToHistory: false });
	}

	var backs = document.querySelectorAll(".js-back");
	for (var b = 0; b < backs.length; b++) backs[b].addEventListener("click", goBack);

	// ========================================
	// FLOW 1: LANDING
	// ========================================

	$("screen-landing").setAttribute("data-hero", state.heroVariant);
	trackExperimentStarted(HERO_EXPERIMENT, state.heroVariant);
	trackLandingPageViewed(state.schoolType);

	var schoolChips = $("schoolTypeChips");
	var savedChip = schoolChips.querySelector('[data-value="' + state.schoolType + '"]');
	if (savedChip) selectInGroup(schoolChips, savedChip);
	schoolChips.addEventListener("click", function (e) {
		var btn = e.target.closest("[data-value]");
		if (!btn) return;
		selectInGroup(schoolChips, btn);
		state.schoolType = btn.getAttribute("data-value");
		writeStore("sb_school_type", state.schoolType);
	});

	var starts = document.querySelectorAll(".js-get-started");
	for (var s = 0; s < starts.length; s++) {
		starts[s].addEventListener("click", function () {
			startRegistrationTimer();
			navigateTo("screen-signup");
		});
	}

	$("videoThumb").addEventListener("click", function () {
		toast("▶ The demo video would play here");
	});

	$("landingLogin").addEventListener("click", function () {
		openLogin();
	});

	// ========================================
	// FLOW 1: SIGN UP
	// ========================================

	var payPref = $("payPref");
	payPref.addEventListener("click", function (e) {
		var btn = e.target.closest("[data-value]");
		if (!btn) return;
		selectInGroup(payPref, btn);
		state.signupPayment = btn.getAttribute("data-value");
	});

	function completeSignup(method, name) {
		var parentId = "parent_" + guid().slice(0, 8);
		var addonVariant = getAddonVariant();
		state.parent = { id: parentId, name: name || "", kids: [] };
		state.justRegistered = true;
		saveParent();

		trackParentRegistered(method);
		identifyParent(parentId, {
			family_profile: "single_student",
			school_cluster: $("schoolCluster").value,
			preferred_payment_method: state.signupPayment,
			notification_preference: pick(["push_and_email", "push_only", "email_only"]),
			has_special_dietary_needs: false,
			addon_menu_format: addonVariant === "Visual Tiled" ? "visual_recommendations" : "standard_list",
			"Experiment: Mobile Landing Page Hero": state.heroVariant,
		});

		renderKidList();
		navigateTo("screen-child", { clearHistory: true });
	}

	var socials = document.querySelectorAll(".js-social");
	for (var so = 0; so < socials.length; so++) {
		socials[so].addEventListener("click", function () {
			var method = this.getAttribute("data-method");
			var name = $("parentName").value.trim();
			completeSignup(method, name);
		});
	}

	$("signupForm").addEventListener("submit", function (e) {
		e.preventDefault();
		var name = $("parentName").value.trim();
		var email = $("parentEmail").value.trim();
		var err = $("signupError");
		if (!name) {
			err.textContent = "Please add your first name.";
			return;
		}
		if (email.indexOf("@") < 1) {
			err.textContent = "Please enter a valid email address.";
			return;
		}
		err.textContent = "";
		completeSignup("email", name);
	});

	// ========================================
	// FLOW 1: ADD CHILD
	// ========================================

	var yearChips = $("yearChips");
	yearChips.addEventListener("click", function (e) {
		var btn = e.target.closest("[data-value]");
		if (!btn) return;
		selectInGroup(yearChips, btn);
		state.yearLevel = btn.getAttribute("data-value");
	});

	function renderKidList() {
		var kids = (state.parent && state.parent.kids) || [];
		var html = "";
		for (var i = 0; i < kids.length; i++) {
			html +=
				'<div class="kid-card"><div class="kid-avatar">' + (i % 2 ? "👧" : "🧒") + "</div>" +
				"<div><strong>" + esc(kids[i].name) + "</strong><small>" + YEAR_LABEL[kids[i].yearLevel] + "</small></div>" +
				(kids[i].dietary ? '<span class="tag">Dietary flag</span>' : '<span class="tag green">Ready</span>') +
				"</div>";
		}
		$("kidList").innerHTML = html;
		$("screen-child").classList.toggle("has-kids", kids.length > 0);
	}

	$("childForm").addEventListener("submit", function (e) {
		e.preventDefault();
		var name = $("childName").value.trim();
		if (!name) {
			$("childError").textContent = "Please add your child's first name.";
			return;
		}
		$("childError").textContent = "";
		var kid = {
			name: name,
			yearLevel: state.yearLevel,
			dietary: $("childDietary").checked,
			token: guid(),
		};
		state.parent.kids.push(kid);
		saveParent();

		trackStudentProfileAdded(kid.yearLevel, kid.dietary, kid.token);
		var anyDietary = state.parent.kids.some(function (k) {
			return k.dietary;
		});
		updateParentProfile({
			family_profile: state.parent.kids.length > 1 ? "multi_student" : "single_student",
			has_special_dietary_needs: anyDietary,
		});

		this.reset();
		state.yearLevel = "years_1_to_3";
		selectInGroup(yearChips, yearChips.querySelector('[data-value="years_1_to_3"]'));
		renderKidList();
		$("screen-child").classList.add("form-hidden");
		$("childHeading").textContent = state.parent.kids.length > 1 ? "Your kids" : "Your child";
		toast(name + " added");
	});

	$("addAnotherKid").addEventListener("click", function () {
		$("screen-child").classList.remove("form-hidden");
		$("childHeading").textContent = "Add another child";
		$("childName").focus();
	});

	$("kidsContinue").addEventListener("click", function () {
		var kids = state.parent.kids;
		$("successName").textContent = state.parent.name ? ", " + state.parent.name : "";
		$("successKids").textContent =
			kids.length > 1
				? kids.map(function (k) { return k.name; }).join(" and ") + " are ready to order."
				: kids[0].name + " is ready to order.";
		navigateTo("screen-success", { clearHistory: true });
	});

	// ========================================
	// FLOW 1: SUCCESS
	// ========================================

	var stores = document.querySelectorAll(".js-store");
	for (var st = 0; st < stores.length; st++) {
		stores[st].addEventListener("click", function () {
			var store = this.getAttribute("data-store");
			this.classList.add("clicked");
			trackAppStoreLinkClicked(store);
			toast(store === "apple_app_store" ? "Opening the App Store… (demo)" : "Opening Google Play… (demo)");
		});
	}

	$("successContinue").addEventListener("click", function () {
		openLogin();
	});

	// ========================================
	// FLOW 2: LOGIN
	// ========================================

	function openLogin() {
		var p = state.parent;
		$("loginGreeting").textContent = p && p.name ? "Hi " + p.name + ", log in to order for your kids." : "Log in to order for your kids.";
		var emailField = $("parentEmail").value.trim();
		if (emailField) $("loginEmail").value = emailField;
		navigateTo("screen-login", { clearHistory: !!state.justRegistered });
	}

	function completeLogin(loginType) {
		var isFirst = state.justRegistered;
		if (!state.parent) {
			// A returning parent from another device: give them a demo family.
			state.parent = { id: "parent_" + guid().slice(0, 8), name: "", kids: [{ name: "Sam", yearLevel: "years_1_to_3", dietary: false, token: guid() }] };
			saveParent();
		}
		if (!state.parent.kids || !state.parent.kids.length) {
			state.parent.kids = [{ name: "Sam", yearLevel: "years_1_to_3", dietary: false, token: guid() }];
		}
		if (!isFirst) identifyReturningParent(state.parent.id);
		trackParentLoggedIn(loginType, isFirst);
		state.justRegistered = false;
		openMenu();
	}

	$("loginFaceId").addEventListener("click", function () {
		var btn = this;
		if (btn.classList.contains("scanning")) return;
		btn.classList.add("scanning");
		btn.querySelector("span").textContent = "Scanning…";
		setTimeout(function () {
			btn.classList.remove("scanning");
			btn.querySelector("span").textContent = "Log in with Face ID";
			completeLogin("biometric");
		}, 900);
	});

	$("loginForm").addEventListener("submit", function (e) {
		e.preventDefault();
		completeLogin("password");
	});

	$("loginMagic").addEventListener("click", function () {
		toast("✉️ Magic link sent — opening it for you…");
		setTimeout(function () {
			completeLogin("magic_link");
		}, 1400);
	});

	// ========================================
	// FLOW 2: MENU
	// ========================================

	function renderKidSwitch() {
		var kids = state.parent.kids;
		var html = "";
		for (var i = 0; i < kids.length; i++) {
			html += '<button class="kid-pill' + (i === state.activeKid ? " active" : "") + '" data-idx="' + i + '">' + esc(kids[i].name) + "</button>";
		}
		$("kidSwitch").innerHTML = html;
	}

	$("kidSwitch").addEventListener("click", function (e) {
		var btn = e.target.closest("[data-idx]");
		if (!btn) return;
		state.activeKid = parseInt(btn.getAttribute("data-idx"), 10);
		renderKidSwitch();
	});

	function renderMenu() {
		var supplier = supplierFor(state.serviceDate, state.mealSession);
		var banner = $("supplierBanner");
		banner.classList.toggle("caterer", supplier === "external_caterer");
		banner.innerHTML =
			supplier === "external_caterer"
				? "🚚 <span>Served by <b>Partner caterer</b> &middot; order by 9:00am the day before</span>"
				: "🏫 <span>Served by <b>School canteen</b> &middot; order by 9:30am on the day</span>";

		var items = MENU[state.mealSession];
		var html = "";
		for (var i = 0; i < items.length; i++) {
			var it = items[i];
			html +=
				'<button class="menu-item" data-sku="' + it.sku + '">' +
				'<span class="food-tile t-' + it.type + '">' + it.emoji + "</span>" +
				'<span class="mi-body"><strong>' + esc(it.name) + "</strong><small>" + esc(it.desc) + "</small>" +
				'<span class="mi-price">' + money(it.price) + (it.tags[0] ? ' <span class="tag green">' + esc(it.tags[0]) + "</span>" : "") + "</span></span>" +
				'<span class="mi-add" aria-hidden="true">+</span></button>';
		}
		$("menuList").innerHTML = html;
	}

	function fireMenuViewed() {
		trackMenuViewed(state.serviceDate, state.mealSession, supplierFor(state.serviceDate, state.mealSession));
	}

	function openMenu() {
		renderKidSwitch();
		renderMenu();
		updateCartFab();
		if (!state.menuTimerStarted) {
			startOrderTimer();
			state.menuTimerStarted = true;
		}
		navigateTo("screen-menu", { clearHistory: true });
		fireMenuViewed();
	}

	$("dateTabs").addEventListener("click", function (e) {
		var btn = e.target.closest("[data-value]");
		if (!btn || btn.classList.contains("active")) return;
		selectInGroup($("dateTabs"), btn);
		state.serviceDate = btn.getAttribute("data-value");
		renderMenu();
		fireMenuViewed();
	});

	$("sessionTabs").addEventListener("click", function (e) {
		var btn = e.target.closest("[data-value]");
		if (!btn || btn.classList.contains("active")) return;
		selectInGroup($("sessionTabs"), btn);
		state.mealSession = btn.getAttribute("data-value");
		renderMenu();
		fireMenuViewed();
	});

	$("menuList").addEventListener("click", function (e) {
		var btn = e.target.closest("[data-sku]");
		if (!btn) return;
		var sku = btn.getAttribute("data-sku");
		var item = MENU[state.mealSession].filter(function (it) {
			return it.sku === sku;
		})[0];
		if (item) openSheet(item);
	});

	var tabItems = document.querySelectorAll(".tab-item");
	for (var ti = 0; ti < tabItems.length; ti++) {
		tabItems[ti].addEventListener("click", function () {
			if (this.getAttribute("data-tab") !== "menu") toast("Only the Menu tab is part of this demo");
		});
	}

	// ========================================
	// FLOW 2: ITEM SHEET
	// ========================================

	function sheetUnitPrice() {
		var it = state.sheetItem;
		var extra = 0;
		var boxes = $("sheetOptions").querySelectorAll("input:checked");
		for (var i = 0; i < boxes.length; i++) extra += parseFloat(boxes[i].getAttribute("data-price"));
		return round2(it.price + extra);
	}

	function updateSheetButton() {
		$("qtyVal").textContent = state.sheetQty;
		$("sheetAdd").textContent = "Add to order · " + money(round2(sheetUnitPrice() * state.sheetQty));
	}

	function openSheet(item) {
		state.sheetItem = item;
		state.sheetQty = 1;
		var hero = $("sheetHero");
		hero.className = "sheet-hero t-" + item.type;
		hero.textContent = item.emoji;
		$("sheetName").textContent = item.name;
		$("sheetDesc").textContent = item.desc + " · " + money(item.price);
		$("sheetTags").innerHTML = item.tags
			.map(function (t) {
				return '<span class="tag green">' + esc(t) + "</span>";
			})
			.join("");
		var opts = OPTIONS[item.type];
		var html = "";
		for (var i = 0; i < opts.length; i++) {
			html +=
				'<label class="opt"><input type="checkbox" data-label="' + esc(opts[i].label) + '" data-price="' + opts[i].price + '">' +
				"<span>" + esc(opts[i].label) + '</span><span class="opt-price">' + (opts[i].price ? "+" + money(opts[i].price) : "Free") + "</span></label>";
		}
		$("sheetOptions").innerHTML = html;
		updateSheetButton();
		$("sheetBackdrop").classList.add("open");
		$("itemSheet").classList.add("open");
	}

	function closeSheet() {
		$("sheetBackdrop").classList.remove("open");
		$("itemSheet").classList.remove("open");
	}

	$("sheetBackdrop").addEventListener("click", closeSheet);
	$("sheetOptions").addEventListener("change", updateSheetButton);
	$("qtyMinus").addEventListener("click", function () {
		if (state.sheetQty > 1) state.sheetQty--;
		updateSheetButton();
	});
	$("qtyPlus").addEventListener("click", function () {
		if (state.sheetQty < 5) state.sheetQty++;
		updateSheetButton();
	});

	$("sheetAdd").addEventListener("click", function () {
		var it = state.sheetItem;
		var checked = $("sheetOptions").querySelectorAll("input:checked");
		var labels = [];
		for (var i = 0; i < checked.length; i++) labels.push(checked[i].getAttribute("data-label"));
		var unit = sheetUnitPrice();
		var kid = state.parent.kids[state.activeKid] || state.parent.kids[0];
		var key = it.sku + "|" + labels.join(",") + "|" + kid.name + "|" + state.serviceDate + "|" + state.mealSession;
		var existing = state.cart.filter(function (l) {
			return l.key === key;
		})[0];
		if (existing) existing.qty += state.sheetQty;
		else
			state.cart.push({
				key: key,
				sku: it.sku,
				name: it.name,
				emoji: it.emoji,
				unitPrice: unit,
				qty: state.sheetQty,
				note: [kid.name, SESSION_LABEL[state.mealSession], DATE_LABEL[state.serviceDate]].concat(labels).join(" · "),
				supplier: supplierFor(state.serviceDate, state.mealSession),
				mealSession: state.mealSession,
				isAddon: false,
			});

		trackItemAdded(it.type, labels.length > 0, unit);
		closeSheet();
		updateCartFab(true);
		toast(it.name + " added for " + kid.name);
	});

	// ========================================
	// FLOW 2: CART
	// ========================================

	function cartTotal() {
		var t = 0;
		for (var i = 0; i < state.cart.length; i++) t += state.cart[i].unitPrice * state.cart[i].qty;
		return round2(t);
	}

	function cartQty() {
		var q = 0;
		for (var i = 0; i < state.cart.length; i++) q += state.cart[i].qty;
		return q;
	}

	function updateCartFab(bump) {
		var fab = $("cartFab");
		var q = cartQty();
		fab.hidden = q === 0;
		$("cartCount").textContent = q;
		$("cartFabTotal").textContent = money(cartTotal());
		if (bump) {
			fab.classList.remove("bump");
			void fab.offsetWidth;
			fab.classList.add("bump");
		}
	}

	function cartMealSession() {
		var mains = state.cart.filter(function (l) {
			return !l.isAddon;
		});
		return mains.length ? mains[0].mealSession : state.mealSession;
	}

	function eligibleAddons() {
		var inCart = {};
		for (var i = 0; i < state.cart.length; i++) inCart[state.cart[i].sku] = true;
		return ADDONS_BY_SESSION[cartMealSession()]
			.map(function (k) {
				return ADDONS[k];
			})
			.filter(function (a) {
				return !inCart[a.sku];
			});
	}

	function renderCart() {
		var html = "";
		for (var i = 0; i < state.cart.length; i++) {
			var l = state.cart[i];
			html +=
				'<div class="cart-line"><span class="emoji">' + l.emoji + '</span><div class="cl-body"><strong>' + l.qty + " × " + esc(l.name) +
				"</strong><small>" + esc(l.note) + '</small></div><span class="cl-price">' + money(round2(l.unitPrice * l.qty)) + "</span></div>";
		}
		$("cartLines").innerHTML = html;
		var kids = state.parent.kids;
		$("cartMeta").textContent = "For " + kids.map(function (k) { return k.name; }).join(" & ") + " · " + cartQty() + " item" + (cartQty() === 1 ? "" : "s");
		$("cartSubtotal").textContent = money(cartTotal());
		$("cartTotal").textContent = money(cartTotal());
		$("placeOrder").textContent = "Place order · " + money(cartTotal());
		$("placeOrder").disabled = state.cart.length === 0;
	}

	function renderAddons() {
		var variant = getAddonVariant();
		var list = eligibleAddons();
		var section = $("addonSection");
		if (list.length < 2) {
			section.style.display = "none";
			return list.length;
		}
		section.style.display = "";
		$("addonCountLabel").textContent = "(" + list.length + ")";
		var html = "";
		var i;
		if (variant === "Visual Tiled") {
			html = '<div class="addon-tiles">';
			for (i = 0; i < list.length; i++) {
				html +=
					'<button class="addon-tile" data-addon="' + list[i].sku + '"><div class="at-img c-' + list[i].category + '">' + list[i].emoji +
					"</div><strong>" + esc(list[i].name) + '</strong><span class="at-price">+' + money(list[i].price) + "</span></button>";
			}
			html += "</div>";
		} else {
			html = '<div class="addon-list">';
			for (i = 0; i < list.length; i++) {
				html +=
					'<button class="addon-row" data-addon="' + list[i].sku + '"><span>' + esc(list[i].name) + '</span><span class="ar-price">' +
					money(list[i].price) + '</span><span class="ar-add">Add</span></button>';
			}
			html += "</div>";
		}
		$("addonList").innerHTML = html;
		return list.length;
	}

	function openCart() {
		var variant = getAddonVariant();
		renderCart();
		var count = renderAddons();

		// Payment default follows the parent's stated preference.
		var prefersWallet = !state.signupPayment || state.signupPayment === "flexi_wallet";
		document.querySelector('input[name="payWith"][value="' + (prefersWallet ? "cleared_wallet" : "cleared_card") + '"]').checked = true;

		navigateTo("screen-cart");

		if (!state.addonExposed) {
			state.addonExposed = true;
			trackExperimentStarted(ADDON_EXPERIMENT, variant);
			setAddonExperimentProfile(variant);
		}
		if (count >= 2) {
			trackAddonShowcasePresented(variant === "Visual Tiled" ? "visual_cards" : "standard_list", count);
		}
	}

	$("cartFab").addEventListener("click", openCart);

	$("addonList").addEventListener("click", function (e) {
		var btn = e.target.closest("[data-addon]");
		if (!btn) return;
		var sku = btn.getAttribute("data-addon");
		var addon = null;
		for (var k in ADDONS) if (ADDONS[k].sku === sku) addon = ADDONS[k];
		if (!addon) return;
		state.cart.push({
			key: addon.sku,
			sku: addon.sku,
			name: addon.name,
			emoji: addon.emoji,
			unitPrice: addon.price,
			qty: 1,
			note: "Add-on",
			supplier: null,
			mealSession: null,
			isAddon: true,
		});
		trackAddonItemSelected(addon.category, addon.price);
		renderCart();
		renderAddons();
		updateCartFab();
		toast(addon.name + " added");
	});

	$("placeOrder").addEventListener("click", function () {
		if (!state.cart.length || state.placing) return;
		state.placing = true;
		var total = cartTotal();
		var items = state.cart.map(function (l) {
			return { quantity: l.qty, sku_id: l.sku };
		});
		var includesAddon = state.cart.some(function (l) {
			return l.isAddon;
		});
		var mains = state.cart.filter(function (l) {
			return !l.isAddon;
		});
		var supplier = mains.length ? mains[0].supplier : "school_canteen";
		var payment = document.querySelector('input[name="payWith"]:checked').value;

		trackOrderSubmitted(total, items);
		trackAddonCheckoutCompleted(total, includesAddon);

		$("processing").classList.add("show");
		setTimeout(function () {
			trackOrderConfirmed(supplier, total, payment);
			renderConfirmation(total, payment, supplier);
			$("processing").classList.remove("show");
			state.cart = [];
			state.placing = false;
			updateCartFab();
			navigateTo("screen-confirmed", { clearHistory: true });
		}, 1100);
	});

	// ========================================
	// FLOW 2: CONFIRMED
	// ========================================

	function renderConfirmation(total, payment, supplier) {
		var orderNo = "SB-" + Math.floor(100000 + Math.random() * 900000);
		var lines = state.cart
			.map(function (l) {
				return '<div class="r-row"><span>' + l.qty + " × " + esc(l.name) + "</span><span>" + money(round2(l.unitPrice * l.qty)) + "</span></div>";
			})
			.join("");
		$("confirmSub").textContent =
			(supplier === "external_caterer" ? "Your partner caterer" : "The school canteen") + " has your order. We'll remind you before cut-off next time.";
		$("receipt").innerHTML =
			'<div class="r-row"><span>Order</span><span>' + orderNo + "</span></div>" +
			lines +
			'<div class="r-row"><span>Paid with</span><span>' + (payment === "cleared_wallet" ? "SchoolBites Wallet" : "Visa •• 4242") + "</span></div>" +
			'<div class="r-row r-total"><span>Total</span><span>' + money(total) + "</span></div>";
	}

	$("orderAgain").addEventListener("click", function () {
		state.menuTimerStarted = false;
		openMenu();
	});

	// ========================================
	// UTILITY BAR
	// ========================================

	document.getElementById("btnReset").addEventListener("click", function () {
		if (typeof window.RESET === "function") window.RESET();
	});
})();
