/**
 * Lodgely Stays - App Logic
 * Search, listings, date picker, booking flow, and console error triggers
 */

(function () {
    // ========================================
    // DATA
    // ========================================

    var CATEGORIES = [
        { id: "beachfront", label: "Beachfront", icon: "🏖️" },
        { id: "cabins", label: "Cabins", icon: "🛖" },
        { id: "views", label: "Amazing views", icon: "🏔️" },
        { id: "lakefront", label: "Lakefront", icon: "🛶" },
        { id: "tiny", label: "Tiny homes", icon: "🏠" },
        { id: "countryside", label: "Countryside", icon: "🌾" },
        { id: "design", label: "Design", icon: "🏛️" },
        { id: "trending", label: "Trending", icon: "🔥" },
        { id: "omg", label: "OMG!", icon: "🛸" },
        { id: "treehouses", label: "Treehouses", icon: "🌳" },
        { id: "arctic", label: "Arctic", icon: "❄️" },
        { id: "pools", label: "Amazing pools", icon: "🏊" }
    ];

    var AMENITIES = {
        wifi: ["📶", "Fast wifi"],
        kitchen: ["🍳", "Kitchen"],
        parking: ["🚗", "Free parking on premises"],
        hottub: ["🛁", "Private hot tub"],
        pool: ["🏊", "Pool"],
        workspace: ["💻", "Dedicated workspace"],
        washer: ["🧺", "Washer"],
        ac: ["❄️", "Air conditioning"],
        fireplace: ["🔥", "Indoor fireplace"],
        beach: ["🏖️", "Beach access"],
        lake: ["🛶", "Lake access"],
        view: ["🏞️", "Mountain view"],
        ocean: ["🌊", "Ocean view"],
        ev: ["🔌", "EV charger"],
        pets: ["🐾", "Pets allowed"],
        grill: ["🍖", "BBQ grill"],
        selfcheck: ["🔑", "Self check-in"],
        tv: ["📺", "HDTV with streaming"],
        coffee: ["☕", "Coffee maker"],
        heating: ["🌡️", "Heating"]
    };

    // Palettes drive the inline-SVG "photos" (no external images).
    var LISTINGS = [
        {
            id: "lg-101", city: "Big Sur", region: "California, United States", type: "Entire cabin",
            title: "Cliffside cabin above the Pacific", price: 412, cleaning: 95, rating: 4.97, reviews: 212,
            guests: 4, bedrooms: 2, beds: 2, baths: 1, host: "Marisol", hostYears: 7, superhost: true,
            categories: ["views", "cabins"], tagline: "Ocean views",
            amenities: ["ocean", "hottub", "fireplace", "wifi", "kitchen", "parking", "selfcheck", "coffee", "heating", "grill", "washer", "workspace"],
            desc: "Perched on a bluff where the redwoods meet the sea, this cedar cabin has floor-to-ceiling windows, a wood stove, and a cedar hot tub that looks straight down the coastline. Watch whales from the deck in winter and fog roll through the canyon in summer.",
            scene: { kind: "coast", building: "cabin", sky: ["#9CC9F5", "#F6D7C3"], dusk: ["#5B4B8A", "#F59E7E"], sun: "#FFF1C1", far: "#6F8FA8", near: "#4E6B47", water: "#2F7FB0", sand: "#C9B79C", accent: "#9C5B3B", wall: "#EFE6DA", floor: "#B08968", fabric: "#C8553D" }
        },
        {
            id: "lg-102", city: "Tulum", region: "Quintana Roo, Mexico", type: "Entire villa",
            title: "Palapa villa steps from the turquoise sea", price: 268, cleaning: 60, rating: 4.92, reviews: 341,
            guests: 6, bedrooms: 3, beds: 3, baths: 2, host: "Diego", hostYears: 5, superhost: true,
            categories: ["beachfront", "pools"], tagline: "Beachfront",
            amenities: ["beach", "pool", "ocean", "wifi", "ac", "kitchen", "selfcheck", "coffee", "grill", "washer"],
            desc: "A thatched-roof villa tucked into the jungle with a plunge pool, outdoor shower, and a sandy path that ends at a quiet stretch of Caribbean beach. Bikes are included for the ride into town.",
            scene: { kind: "beach", building: "villa", sky: ["#7FD3E6", "#EAF8F4"], dusk: ["#3E4A89", "#F7A072"], sun: "#FFF6D5", far: "#78AE84", near: "#4F8F5C", water: "#1FB0B0", sand: "#F1DDB5", accent: "#C9A27E", wall: "#F6EFE6", floor: "#D8C3A5", fabric: "#2A9D8F" }
        },
        {
            id: "lg-103", city: "Asheville", region: "North Carolina, United States", type: "Entire A-frame",
            title: "Modern A-frame in the Blue Ridge woods", price: 189, cleaning: 75, rating: 4.95, reviews: 488,
            guests: 4, bedrooms: 1, beds: 2, baths: 1, host: "Jonah", hostYears: 6, superhost: true,
            categories: ["cabins", "trending"], tagline: "Forest retreat",
            amenities: ["hottub", "fireplace", "wifi", "kitchen", "parking", "pets", "coffee", "heating", "workspace", "grill"],
            desc: "A black A-frame with a glass gable wall, set on five wooded acres twenty minutes from downtown. Fall asleep in the loft under the pines and wake up to coffee on the wraparound deck.",
            scene: { kind: "forest", building: "aframe", sky: ["#BFD8D2", "#FEF6E4"], dusk: ["#2E3B55", "#E9967A"], sun: "#FFE8B0", far: "#5E8B7E", near: "#2F5D50", water: "#5E8B7E", sand: "#7A9E7E", accent: "#2B2B2B", wall: "#F3EEE7", floor: "#A47551", fabric: "#556B2F" }
        },
        {
            id: "lg-104", city: "Lake Tahoe", region: "California, United States", type: "Entire home",
            title: "Lakefront lodge with a private dock", price: 356, cleaning: 120, rating: 4.89, reviews: 157,
            guests: 8, bedrooms: 4, beds: 5, baths: 3, host: "Kristen", hostYears: 9, superhost: false,
            categories: ["lakefront", "views"], tagline: "Private dock",
            amenities: ["lake", "view", "hottub", "fireplace", "wifi", "kitchen", "parking", "ev", "washer", "tv", "heating"],
            desc: "Timber-frame lodge right on the west shore with kayaks, a private dock, and a stone fireplace big enough to stand in. Ski resorts are a short drive in winter.",
            scene: { kind: "lake", building: "cabin", sky: ["#8EC5FC", "#E0EAFC"], dusk: ["#3A3F7A", "#F4A261"], sun: "#FFF4CC", far: "#6C7FA6", near: "#365E46", water: "#3A7CA5", sand: "#6B8F71", accent: "#7B4B2A", wall: "#EFE7DD", floor: "#9C6644", fabric: "#264653" }
        },
        {
            id: "lg-105", city: "Joshua Tree", region: "California, United States", type: "Dome",
            title: "Desert dome under a sky full of stars", price: 221, cleaning: 65, rating: 4.94, reviews: 276,
            guests: 2, bedrooms: 1, beds: 1, baths: 1, host: "Rae", hostYears: 4, superhost: true,
            categories: ["omg", "design"], tagline: "Stargazing",
            amenities: ["hottub", "ac", "wifi", "kitchen", "parking", "selfcheck", "coffee", "grill"],
            desc: "A white geodesic dome surrounded by boulders and yucca, with a cowboy tub, a hammock net, and a telescope for the darkest skies in Southern California.",
            scene: { kind: "desert", building: "dome", sky: ["#F9D29D", "#FDEFE3"], dusk: ["#4B2C5E", "#F28C6A"], sun: "#FFF2D6", far: "#C98A6B", near: "#D9A47C", water: "#C98A6B", sand: "#E8C39E", accent: "#F1E9DB", wall: "#F5EDE3", floor: "#C8A27A", fabric: "#D97745" }
        },
        {
            id: "lg-106", city: "Santorini", region: "South Aegean, Greece", type: "Cave house",
            title: "Whitewashed cave suite over the caldera", price: 498, cleaning: 80, rating: 4.98, reviews: 193,
            guests: 2, bedrooms: 1, beds: 1, baths: 1, host: "Eleni", hostYears: 8, superhost: true,
            categories: ["views", "pools"], tagline: "Caldera views",
            amenities: ["ocean", "pool", "ac", "wifi", "coffee", "selfcheck", "tv", "washer"],
            desc: "A 200-year-old cave house carved into the cliff, with a heated plunge pool and a terrace that faces the sunset over the caldera. Breakfast is delivered every morning.",
            scene: { kind: "cliff", building: "none", sky: ["#9BD1F2", "#F2F7FB"], dusk: ["#6B3E75", "#F7A278"], sun: "#FFF5D1", far: "#8DA9C4", near: "#E8DCC8", water: "#1D5D9B", sand: "#E8DCC8", accent: "#2563EB", wall: "#FAFAF7", floor: "#E2D6C2", fabric: "#1D4ED8" }
        },
        {
            id: "lg-107", city: "Kyoto", region: "Kyoto Prefecture, Japan", type: "Entire townhouse",
            title: "Restored machiya near the Gion lanes", price: 174, cleaning: 50, rating: 4.91, reviews: 402,
            guests: 4, bedrooms: 2, beds: 3, baths: 1, host: "Haruto", hostYears: 6, superhost: true,
            categories: ["design", "trending"], tagline: "Historic home",
            amenities: ["wifi", "ac", "kitchen", "washer", "workspace", "heating", "coffee", "selfcheck"],
            desc: "A century-old wooden townhouse with tatami rooms, a cypress soaking tub, and a tiny moss garden. Temples, tea houses, and the river are all within a short walk.",
            scene: { kind: "city", building: "none", sky: ["#F7C5A8", "#FCEBDD"], dusk: ["#2C2A4A", "#E07A5F"], sun: "#FFE3C2", far: "#8E7C93", near: "#4A3F4E", water: "#8E7C93", sand: "#6D5D6E", accent: "#8B3A2E", wall: "#F2E8D8", floor: "#B7935E", fabric: "#8B3A2E" }
        },
        {
            id: "lg-108", city: "Banff", region: "Alberta, Canada", type: "Entire chalet",
            title: "Timber chalet with Rocky Mountain views", price: 389, cleaning: 110, rating: 4.96, reviews: 129,
            guests: 6, bedrooms: 3, beds: 4, baths: 2, host: "Liam", hostYears: 5, superhost: true,
            categories: ["cabins", "arctic", "views"], tagline: "Mountain views",
            amenities: ["view", "hottub", "fireplace", "wifi", "kitchen", "parking", "washer", "heating", "tv", "ev"],
            desc: "A ski-in chalet with vaulted ceilings, a wood-burning fireplace, and an outdoor hot tub facing the peaks. Elk wander past the windows most mornings.",
            scene: { kind: "snow", building: "cabin", sky: ["#A7C7E7", "#EEF4FA"], dusk: ["#2B3A67", "#E5989B"], sun: "#FFF8E1", far: "#6B83A6", near: "#2F4858", water: "#6B83A6", sand: "#F4F7FB", accent: "#7A4A2B", wall: "#EDE4D8", floor: "#8D6346", fabric: "#9B2226" }
        },
        {
            id: "lg-109", city: "Tuscany", region: "Siena, Italy", type: "Farmhouse",
            title: "Stone farmhouse among the vineyards", price: 305, cleaning: 90, rating: 4.93, reviews: 218,
            guests: 8, bedrooms: 4, beds: 5, baths: 3, host: "Giulia", hostYears: 10, superhost: true,
            categories: ["countryside", "pools"], tagline: "Vineyard views",
            amenities: ["pool", "view", "wifi", "kitchen", "parking", "grill", "washer", "coffee", "ac", "pets"],
            desc: "A 17th-century stone farmhouse with terracotta floors, a long table under the pergola, and an infinity pool overlooking rows of Sangiovese. Wine tastings on request.",
            scene: { kind: "country", building: "villa", sky: ["#BFE0F5", "#FBF3E4"], dusk: ["#4A3B6B", "#F4A259"], sun: "#FFEFC2", far: "#8FA77A", near: "#6E8B4E", water: "#4BA3C7", sand: "#A3B57A", accent: "#D9B48F", wall: "#F4ECDF", floor: "#B5651D", fabric: "#7F5539" }
        },
        {
            id: "lg-110", city: "Lisbon", region: "Lisbon, Portugal", type: "Entire loft",
            title: "Sunny loft with a rooftop over Alfama", price: 142, cleaning: 40, rating: 4.88, reviews: 512,
            guests: 3, bedrooms: 1, beds: 2, baths: 1, host: "Ines", hostYears: 4, superhost: false,
            categories: ["trending", "design"], tagline: "City rooftop",
            amenities: ["wifi", "ac", "kitchen", "workspace", "washer", "coffee", "tv", "selfcheck"],
            desc: "A bright loft with azulejo tiles, high ceilings, and a private rooftop overlooking the river and the terracotta rooftops of the old town. Tram 28 stops at the corner.",
            scene: { kind: "city", building: "none", sky: ["#A9D6F5", "#FFF4E0"], dusk: ["#3D2C5E", "#F6A97A"], sun: "#FFEAB8", far: "#E2A67F", near: "#C9734C", water: "#5DA9E9", sand: "#C9734C", accent: "#0E7490", wall: "#F7F1E8", floor: "#C49A6C", fabric: "#0E7490" }
        },
        {
            id: "lg-111", city: "Maui", region: "Hawaii, United States", type: "Bungalow",
            title: "Beachfront bungalow on a quiet cove", price: 445, cleaning: 130, rating: 4.9, reviews: 167,
            guests: 4, bedrooms: 2, beds: 2, baths: 1, host: "Kai", hostYears: 7, superhost: true,
            categories: ["beachfront", "tiny"], tagline: "Beachfront",
            amenities: ["beach", "ocean", "ac", "wifi", "kitchen", "parking", "grill", "coffee", "washer"],
            desc: "An airy bungalow with a lanai right on the sand. Snorkel with sea turtles in the cove, then rinse off in the outdoor lava-rock shower.",
            scene: { kind: "beach", building: "tiny", sky: ["#86D3F7", "#F3FBFF"], dusk: ["#4C2A6B", "#FF9E7A"], sun: "#FFF7D6", far: "#4E8F6A", near: "#3C7A4F", water: "#0EA5B7", sand: "#F3E1BF", accent: "#E9C46A", wall: "#F8F3EA", floor: "#D4B996", fabric: "#E76F51" }
        },
        {
            id: "lg-112", city: "Hudson Valley", region: "New York, United States", type: "Tiny home",
            title: "Tiny cabin in an apple orchard", price: 129, cleaning: 35, rating: 4.86, reviews: 389,
            guests: 2, bedrooms: 1, beds: 1, baths: 1, host: "Nora", hostYears: 3, superhost: false,
            categories: ["tiny", "countryside"], tagline: "Orchard stay",
            amenities: ["fireplace", "wifi", "kitchen", "parking", "pets", "coffee", "heating", "grill"],
            desc: "A 200 sq ft cabin with a sleeping loft, a cast-iron stove, and a fire pit in the middle of a working orchard. Pick your own apples in the fall.",
            scene: { kind: "country", building: "tiny", sky: ["#CFE7F5", "#FFF7EA"], dusk: ["#3A345E", "#EE9B6F"], sun: "#FFEFC9", far: "#9DB88C", near: "#5F8D4E", water: "#5F8D4E", sand: "#93B07A", accent: "#B23A48", wall: "#F4EEE6", floor: "#A47148", fabric: "#B23A48" }
        },
        {
            id: "lg-113", city: "Reykjavik", region: "Capital Region, Iceland", type: "Glass cabin",
            title: "Glass cabin for watching the northern lights", price: 312, cleaning: 70, rating: 4.97, reviews: 148,
            guests: 2, bedrooms: 1, beds: 1, baths: 1, host: "Sigrun", hostYears: 6, superhost: true,
            categories: ["omg", "arctic"], tagline: "Northern lights",
            amenities: ["view", "hottub", "wifi", "heating", "parking", "coffee", "selfcheck", "kitchen"],
            desc: "A glass-roofed cabin on a lava field forty minutes from the city. On clear winter nights the aurora dances right above the bed.",
            scene: { kind: "aurora", building: "glass", sky: ["#0B1D3A", "#1F3B5C"], dusk: ["#0B1D3A", "#3B2F5C"], sun: "#E8EEF5", far: "#24364F", near: "#1A2738", water: "#24364F", sand: "#C9D6E3", accent: "#FFD27A", wall: "#E9EEF2", floor: "#6B7B8C", fabric: "#2A6F97" }
        },
        {
            id: "lg-114", city: "Cape Town", region: "Western Cape, South Africa", type: "Entire villa",
            title: "Clifton villa with an infinity pool", price: 276, cleaning: 85, rating: 4.9, reviews: 204,
            guests: 6, bedrooms: 3, beds: 3, baths: 3, host: "Thando", hostYears: 5, superhost: true,
            categories: ["beachfront", "pools", "views"], tagline: "Ocean views",
            amenities: ["pool", "ocean", "beach", "wifi", "ac", "kitchen", "parking", "grill", "washer", "workspace"],
            desc: "A crisp white villa terraced above the beach with an infinity pool, sunset braai deck, and the mountain right behind you.",
            scene: { kind: "beach", building: "villa", sky: ["#8FD0F2", "#F2F9FC"], dusk: ["#3F2E68", "#F79D84"], sun: "#FFF4D0", far: "#6E7F8D", near: "#5D7C5A", water: "#1E88B5", sand: "#F3E3C6", accent: "#FFFFFF", wall: "#F6F4EF", floor: "#CDB79E", fabric: "#1E88B5" }
        },
        {
            id: "lg-115", city: "Stowe", region: "Vermont, United States", type: "Treehouse",
            title: "Treehouse with a rope bridge and hot tub", price: 198, cleaning: 55, rating: 4.99, reviews: 315,
            guests: 2, bedrooms: 1, beds: 1, baths: 1, host: "Owen", hostYears: 8, superhost: true,
            categories: ["treehouses", "omg", "cabins"], tagline: "Treehouse",
            amenities: ["hottub", "fireplace", "wifi", "parking", "coffee", "heating", "view", "selfcheck"],
            desc: "Cross the rope bridge into a cozy treehouse twenty feet up in the maples. There is a skylight over the bed, a wood stove, and a hot tub on the lower deck.",
            scene: { kind: "forest", building: "tree", sky: ["#CFE3D8", "#FFF5E6"], dusk: ["#303552", "#E78F6A"], sun: "#FFE9B8", far: "#6F9C7E", near: "#3E6B4F", water: "#6F9C7E", sand: "#7A9E7E", accent: "#8C5A3C", wall: "#F1EADF", floor: "#9C6B43", fabric: "#2F6E4C" }
        }
    ];

    var REVIEWERS = ["Priya", "Daniel", "Sofia", "Marcus", "Elena", "Tom", "Aisha", "Kenji", "Lucia", "Ben"];
    var REVIEW_TEXT = [
        "Even better than the photos. The views were unreal and the host thought of everything. We're already planning to come back to {city}.",
        "Spotless, quiet, and so comfortable. Check-in was a breeze and the recommendations for {city} were spot on.",
        "One of the most memorable stays we've had. Coffee on the deck every morning was the highlight of our trip.",
        "Great communication and a beautiful space. Exactly as described and a perfect base for exploring {city}."
    ];

    var AVATAR_COLORS = ["#F43F5E", "#0EA5E9", "#10B981", "#F59E0B"];

    var INSPIRATION = {
        popular: [["Big Sur", "Cabin rentals"], ["Tulum", "Villa rentals"], ["Kyoto", "Townhouse rentals"], ["Asheville", "A-frame rentals"], ["Lisbon", "Loft rentals"], ["Banff", "Chalet rentals"]],
        beach: [["Maui", "Beach house rentals"], ["Tulum", "Beachfront rentals"], ["Cape Town", "Villa rentals"], ["Santorini", "Cave house rentals"], ["Big Sur", "Ocean view rentals"], ["Lisbon", "Coastal rentals"]],
        mountains: [["Banff", "Chalet rentals"], ["Lake Tahoe", "Lodge rentals"], ["Asheville", "Cabin rentals"], ["Stowe", "Treehouse rentals"], ["Reykjavik", "Cabin rentals"], ["Joshua Tree", "Dome rentals"]],
        cities: [["Lisbon", "Apartment rentals"], ["Kyoto", "Townhouse rentals"], ["Cape Town", "Villa rentals"], ["Reykjavik", "Apartment rentals"], ["Asheville", "Bungalow rentals"], ["Tuscany", "Farmhouse rentals"]]
    };

    var SERVICE_FEE_RATE = 0.14;
    var TAX_RATE = 0.08;
    var MAX_SEARCH_GUESTS = 16;

    // ========================================
    // STATE
    // ========================================

    var trip = {
        checkIn: null,
        checkOut: null,
        guests: { adults: 1, children: 0, infants: 0, pets: 0 }
    };
    var searchQuery = "";
    var activeCategory = null;
    var showTotals = false;
    var showWishlist = false;
    var saved = {};
    var currentListing = null;
    var listingFirstViewedAt = {};
    var lastBooking = null;

    var currentScreen = "screen-home";
    var screenHistory = [];

    // ========================================
    // HELPERS
    // ========================================

    function $(id) {
        return document.getElementById(id);
    }

    function money(n) {
        return "$" + Math.round(n).toLocaleString("en-US");
    }

    function pad(n) {
        return n < 10 ? "0" + n : "" + n;
    }

    function ymd(d) {
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    }

    function parseYmd(s) {
        var a = s.split("-");
        return new Date(+a[0], +a[1] - 1, +a[2]);
    }

    function today() {
        var d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    function addDays(d, n) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    }

    function nightsBetween(a, b) {
        return Math.round((parseYmd(b) - parseYmd(a)) / 86400000);
    }

    function fmtShort(s) {
        return parseYmd(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    function fmtLong(s) {
        return parseYmd(s).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    }

    function fmtRange(a, b) {
        var da = parseYmd(a);
        var db = parseYmd(b);
        if (da.getMonth() === db.getMonth()) return fmtShort(a) + " – " + db.getDate();
        return fmtShort(a) + " – " + fmtShort(b);
    }

    function plural(n, word) {
        return n + " " + word + (n === 1 ? "" : "s");
    }

    function guestCount() {
        return trip.guests.adults + trip.guests.children;
    }

    function guestLabel() {
        var n = guestCount();
        var s = plural(n, "guest");
        if (trip.guests.infants) s += ", " + plural(trip.guests.infants, "infant");
        if (trip.guests.pets) s += ", " + plural(trip.guests.pets, "pet");
        return s;
    }

    function tripNights() {
        return trip.checkIn && trip.checkOut ? nightsBetween(trip.checkIn, trip.checkOut) : 0;
    }

    function priceFor(listing, nights) {
        var subtotal = listing.price * nights;
        var service = Math.round(subtotal * SERVICE_FEE_RATE);
        var taxes = Math.round((subtotal + listing.cleaning) * TAX_RATE);
        return {
            subtotal: subtotal,
            cleaning: listing.cleaning,
            service: service,
            taxes: taxes,
            total: subtotal + listing.cleaning + service + taxes
        };
    }

    function findListing(id) {
        for (var i = 0; i < LISTINGS.length; i++) {
            if (LISTINGS[i].id === id) return LISTINGS[i];
        }
        return null;
    }

    function savedCount() {
        return Object.keys(saved).length;
    }

    function showToast(message) {
        var toast = $("toast");
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(showToast._t);
        showToast._t = setTimeout(function () {
            toast.classList.remove("show");
        }, 2200);
    }

    // ========================================
    // INLINE SVG "PHOTOS"
    // ========================================

    var svgUid = 0;

    function svg(inner) {
        return '<svg class="photo-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + "</svg>";
    }

    function pine(x, y, h, fill) {
        var w = h * 0.42;
        return '<path d="M' + x + " " + (y - h) + " L" + (x + w) + " " + y + " L" + (x - w) + " " + y + 'Z" fill="' + fill + '"/>' +
            '<rect x="' + (x - 2) + '" y="' + y + '" width="4" height="8" fill="#4A3426"/>';
    }

    var KIND = {
        coast: function (p) {
            return '<rect y="196" width="400" height="104" fill="' + p.water + '"/>' +
                '<path d="M240 222h70M280 240h90M220 262h60" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>' +
                '<path d="M400 160 L330 170 L290 200 L270 240 L262 300 L400 300Z" fill="' + p.near + '"/>' +
                '<path d="M0 150 L80 158 L140 190 L170 240 L180 300 L0 300Z" fill="' + p.near + '"/>' +
                pine(30, 168, 40, "#2F4A2B") + pine(58, 172, 30, "#35552F") + pine(380, 176, 34, "#2F4A2B");
        },
        beach: function (p) {
            return '<rect y="186" width="400" height="60" fill="' + p.water + '"/>' +
                '<path d="M30 206h80M180 216h120M60 230h70" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>' +
                '<path d="M0 240 Q100 222 200 236 T400 230 L400 300 L0 300Z" fill="' + p.sand + '"/>' +
                '<path d="M0 240 Q100 222 200 236 T400 230" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/>' +
                '<path d="M70 270 Q64 220 82 180" fill="none" stroke="#7A5233" stroke-width="6" stroke-linecap="round"/>' +
                '<path d="M82 180 Q60 170 40 182 M82 180 Q100 164 122 172 M82 180 Q70 158 54 156 M82 180 Q96 192 110 206 M82 180 Q64 196 56 212" fill="none" stroke="' + p.near + '" stroke-width="7" stroke-linecap="round"/>';
        },
        lake: function (p) {
            return '<rect y="200" width="400" height="100" fill="' + p.water + '"/>' +
                '<path d="M0 200 L50 228 L105 212 L165 246 L225 216 L285 236 L345 220 L400 232 L400 200Z" fill="' + p.far + '" opacity=".35"/>' +
                '<path d="M60 236h60M200 258h110M150 280h70" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>' +
                '<path d="M200 205 L400 190 L400 250 L250 246Z" fill="' + p.sand + '"/>' +
                pine(372, 196, 46, p.near) + pine(394, 200, 36, p.near) + pine(20, 205, 30, p.near);
        },
        forest: function (p) {
            var o = '<path d="M0 230 Q120 205 220 222 T400 214 L400 300 L0 300Z" fill="' + p.sand + '"/>';
            var xs = [12, 44, 80, 116, 352, 386, 160, 330];
            for (var i = 0; i < xs.length; i++) o += pine(xs[i], 236 - (i % 3) * 6, 70 + (i % 3) * 14, i % 2 ? p.near : "#244A3E");
            return o + '<rect y="262" width="400" height="38" fill="' + p.near + '"/>';
        },
        snow: function (p) {
            return '<path d="M0 210 L90 90 L150 160 L232 64 L322 170 L400 112 L400 300 L0 300Z" fill="' + p.far + '"/>' +
                '<path d="M90 90 L70 116 L84 112 L96 124 L110 110Z M232 64 L208 96 L224 92 L236 104 L254 92Z M400 112 L384 126 L400 130Z" fill="#fff"/>' +
                '<path d="M0 238 Q140 214 260 230 T400 224 L400 300 L0 300Z" fill="' + p.sand + '"/>' +
                pine(30, 244, 54, p.near) + pine(66, 248, 40, p.near) + pine(366, 236, 52, p.near) + pine(392, 240, 38, p.near);
        },
        desert: function (p) {
            return '<path d="M0 214 Q90 186 190 210 T400 200 L400 300 L0 300Z" fill="' + p.near + '"/>' +
                '<path d="M0 250 Q120 228 230 248 T400 240 L400 300 L0 300Z" fill="' + p.sand + '"/>' +
                '<g fill="#5E7D4E"><rect x="74" y="190" width="12" height="62" rx="6"/><rect x="58" y="206" width="10" height="26" rx="5"/><rect x="58" y="224" width="22" height="9" rx="4"/><rect x="92" y="200" width="10" height="24" rx="5"/><rect x="82" y="216" width="20" height="9" rx="4"/></g>' +
                '<circle cx="150" cy="262" r="10" fill="#B9855E"/><circle cx="166" cy="266" r="7" fill="#A87451"/>';
        },
        cliff: function (p) {
            var o = '<rect y="168" width="400" height="132" fill="' + p.water + '"/>' +
                '<path d="M120 168h80M250 186h90" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>' +
                '<path d="M0 150 L120 160 L170 200 L200 300 L0 300Z" fill="' + p.near + '"/>';
            var houses = [[14, 160, 40, 30], [56, 172, 34, 26], [20, 196, 46, 32], [74, 206, 40, 30], [118, 224, 36, 28], [30, 236, 52, 34]];
            for (var i = 0; i < houses.length; i++) {
                var h = houses[i];
                o += '<rect x="' + h[0] + '" y="' + h[1] + '" width="' + h[2] + '" height="' + h[3] + '" fill="#FFFFFF"/>' +
                    '<rect x="' + (h[0] + 6) + '" y="' + (h[1] + 10) + '" width="7" height="10" fill="' + p.accent + '"/>';
            }
            return o + '<path d="M66 170 A14 14 0 0 1 94 170Z" fill="' + p.accent + '"/><path d="M128 222 A11 11 0 0 1 150 222Z" fill="' + p.accent + '"/>' +
                '<rect x="210" y="246" width="70" height="16" rx="3" fill="#38BDF8" opacity=".9"/>';
        },
        city: function (p, dusk) {
            var o = "";
            var b = [[0, 150, 46], [44, 178, 38], [80, 130, 44], [122, 166, 34], [154, 120, 50], [202, 170, 40], [240, 142, 46], [284, 176, 36], [318, 128, 44], [360, 160, 40]];
            for (var i = 0; i < b.length; i++) {
                o += '<rect x="' + b[i][0] + '" y="' + b[i][1] + '" width="' + b[i][2] + '" height="' + (300 - b[i][1]) + '" fill="' + (i % 2 ? p.near : p.sand) + '"/>';
                for (var y = b[i][1] + 12; y < 250; y += 18) {
                    for (var x = b[i][0] + 7; x < b[i][0] + b[i][2] - 8; x += 13) {
                        o += '<rect x="' + x + '" y="' + y + '" width="6" height="8" fill="' + (dusk ? "#FFD27A" : "#FCEBD2") + '" opacity="' + (dusk ? 0.95 : 0.55) + '"/>';
                    }
                }
            }
            return o + '<path d="M0 250 L60 236 L120 250 L180 234 L240 252 L300 238 L360 250 L400 240 L400 300 L0 300Z" fill="' + p.accent + '"/>' +
                '<rect y="282" width="400" height="18" fill="#3B3B3B"/>';
        },
        country: function (p) {
            var o = '<path d="M0 210 Q100 180 210 206 T400 196 L400 300 L0 300Z" fill="' + p.sand + '"/>' +
                '<path d="M0 244 Q120 220 240 240 T400 232 L400 300 L0 300Z" fill="' + p.near + '"/>';
            for (var i = 0; i < 6; i++) o += '<path d="M' + (-20 + i * 24) + " 300 Q" + (90 + i * 30) + " 252 " + (200 + i * 40) + ' 238" fill="none" stroke="#3F5F2E" stroke-opacity=".45" stroke-width="3"/>';
            return o + '<ellipse cx="60" cy="196" rx="7" ry="26" fill="#2F4A2B"/><ellipse cx="80" cy="200" rx="6" ry="22" fill="#2F4A2B"/><ellipse cx="370" cy="188" rx="7" ry="28" fill="#2F4A2B"/>';
        },
        aurora: function (p) {
            return '<path d="M0 90 Q80 40 160 86 T320 70 T400 60" fill="none" stroke="#5EF2B0" stroke-opacity=".55" stroke-width="18"/>' +
                '<path d="M0 120 Q100 70 190 112 T400 92" fill="none" stroke="#7CF5C8" stroke-opacity=".35" stroke-width="12"/>' +
                '<g fill="#fff"><circle cx="40" cy="30" r="1.5"/><circle cx="120" cy="20" r="1"/><circle cx="210" cy="36" r="1.4"/><circle cx="280" cy="18" r="1"/><circle cx="350" cy="34" r="1.5"/><circle cx="380" cy="140" r="1"/><circle cx="20" cy="150" r="1"/></g>' +
                '<path d="M0 236 Q140 218 260 232 T400 226 L400 300 L0 300Z" fill="' + p.sand + '"/>';
        }
    };

    var BUILDING = {
        cabin: function (p, glow) {
            return '<rect x="236" y="206" width="88" height="44" fill="' + p.accent + '"/>' +
                '<path d="M226 208 L280 172 L334 208Z" fill="#3A2E2A"/>' +
                '<rect x="248" y="218" width="20" height="16" fill="' + glow + '"/><rect x="294" y="218" width="20" height="16" fill="' + glow + '"/>' +
                '<rect x="272" y="226" width="16" height="24" fill="#3A2E2A"/><rect x="226" y="248" width="108" height="6" fill="#5C4033"/>';
        },
        aframe: function (p, glow) {
            return '<path d="M226 254 L280 160 L334 254Z" fill="' + p.accent + '"/>' +
                '<path d="M252 254 L280 206 L308 254Z" fill="' + glow + '"/>' +
                '<path d="M280 206 V254 M266 230 H294" stroke="' + p.accent + '" stroke-width="3"/><rect x="214" y="252" width="132" height="6" fill="#5C4033"/>';
        },
        dome: function (p, glow) {
            return '<path d="M232 252 A48 48 0 0 1 328 252Z" fill="' + p.accent + '"/>' +
                '<path d="M250 252 A30 30 0 0 1 310 252 M240 230 L320 230 M256 214 L304 214 M280 204 L280 252" fill="none" stroke="#D8CDBD" stroke-width="1.5"/>' +
                '<circle cx="280" cy="232" r="11" fill="' + glow + '"/>';
        },
        villa: function (p, glow) {
            return '<rect x="200" y="196" width="150" height="48" fill="' + p.accent + '"/>' +
                '<rect x="194" y="190" width="162" height="8" fill="#E8E1D6"/>' +
                '<rect x="214" y="208" width="26" height="24" fill="' + glow + '"/><rect x="250" y="208" width="26" height="24" fill="' + glow + '"/><rect x="306" y="208" width="30" height="36" fill="#7A5C3E"/>' +
                '<rect x="196" y="250" width="160" height="12" rx="3" fill="#38BDF8"/>';
        },
        tiny: function (p, glow) {
            return '<rect x="250" y="218" width="58" height="34" fill="' + p.accent + '"/>' +
                '<path d="M242 220 L279 194 L316 220Z" fill="#3A2E2A"/>' +
                '<rect x="260" y="226" width="16" height="14" fill="' + glow + '"/><rect x="286" y="230" width="12" height="22" fill="#3A2E2A"/>' +
                '<rect x="236" y="250" width="86" height="5" fill="#6B4F3A"/>';
        },
        glass: function (p, glow) {
            return '<rect x="244" y="208" width="84" height="44" fill="' + glow + '" opacity=".92"/>' +
                '<path d="M244 208 L286 186 L328 208" fill="' + glow + '" opacity=".6"/>' +
                '<path d="M244 208 L286 186 L328 208 M244 208 V252 M272 197 V252 M300 197 V252 M328 208 V252 M244 230 H328" fill="none" stroke="#1A2738" stroke-width="2.5"/>' +
                '<rect x="236" y="252" width="100" height="5" fill="#1A2738"/>';
        },
        tree: function (p, glow) {
            return '<rect x="276" y="150" width="12" height="110" fill="#6B4A32"/>' +
                '<circle cx="282" cy="132" r="46" fill="#3E6B4F"/><circle cx="246" cy="150" r="30" fill="#2F5A40"/><circle cx="320" cy="152" r="30" fill="#2F5A40"/>' +
                '<rect x="252" y="176" width="60" height="32" fill="' + p.accent + '"/><path d="M246 178 L282 156 L318 178Z" fill="#3A2E2A"/>' +
                '<rect x="264" y="186" width="14" height="12" fill="' + glow + '"/><rect x="244" y="208" width="76" height="5" fill="#5C4033"/>' +
                '<path d="M244 210 Q200 230 150 214" fill="none" stroke="#8C6A4A" stroke-width="3"/>';
        },
        none: function () {
            return "";
        }
    };

    function landscape(p, dusk) {
        var id = "sky" + ++svgUid;
        var sky = dusk ? p.dusk : p.sky;
        var glow = dusk ? "#FFD27A" : "#FFF3D6";
        var night = p.kind === "aurora";
        return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset="1" stop-color="' + sky[1] + '"/></linearGradient></defs>' +
            '<rect width="400" height="300" fill="url(#' + id + ')"/>' +
            '<circle cx="' + (dusk ? 96 : 226) + '" cy="' + (dusk ? 150 : 76) + '" r="' + (night ? 14 : dusk ? 38 : 26) + '" fill="' + p.sun + '" opacity=".92"/>' +
            '<path d="M0 186 L50 152 L105 174 L165 122 L225 166 L285 132 L345 162 L400 142 L400 300 L0 300Z" fill="' + p.far + '" opacity=".7"/>' +
            KIND[p.kind](p, dusk) +
            BUILDING[p.building](p, night ? p.accent : glow);
    }

    function interior(p, room) {
        var shade = 'fill="#000" opacity=".14"';
        var o = '<rect width="400" height="300" fill="' + p.wall + '"/>' +
            '<rect y="214" width="400" height="86" fill="' + p.floor + '"/>' +
            '<path d="M0 214h400" stroke="#000" stroke-opacity=".08" stroke-width="3"/>' +
            '<rect x="30" y="40" width="156" height="140" rx="4" fill="#FFFFFF"/>' +
            '<svg x="36" y="46" width="144" height="128" viewBox="60 40 300 220" preserveAspectRatio="xMidYMid slice">' + landscape(p, room === "bedroom") + "</svg>" +
            '<rect x="105" y="46" width="6" height="128" fill="#FFFFFF"/>';

        if (room === "living") {
            o += '<ellipse cx="290" cy="270" rx="120" ry="18" fill="' + p.fabric + '" opacity=".25"/>' +
                '<rect x="206" y="148" width="168" height="44" rx="12" fill="' + p.fabric + '"/><rect x="206" y="148" width="168" height="44" rx="12" ' + shade + "/>" +
                '<rect x="198" y="178" width="184" height="50" rx="12" fill="' + p.fabric + '"/>' +
                '<rect x="222" y="160" width="40" height="30" rx="8" fill="#F5F0E8"/><rect x="318" y="160" width="40" height="30" rx="8" fill="#F5F0E8"/>' +
                '<rect x="204" y="226" width="8" height="12" fill="#3A2E2A"/><rect x="368" y="226" width="8" height="12" fill="#3A2E2A"/>' +
                '<ellipse cx="290" cy="254" rx="44" ry="10" fill="#6B4F3A"/><circle cx="290" cy="246" r="6" fill="#E9C46A"/>' +
                '<path d="M30 260 V214" stroke="#3A2E2A" stroke-width="3"/><path d="M14 214 L30 186 L46 214Z" fill="#F4E3C1"/>' +
                '<rect x="240" y="60" width="90" height="62" rx="2" fill="' + p.accent + '" opacity=".75"/><rect x="246" y="66" width="78" height="50" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>';
        } else if (room === "bedroom") {
            o += '<rect x="210" y="118" width="170" height="82" rx="8" fill="#6B4F3A"/>' +
                '<rect x="196" y="176" width="198" height="52" rx="6" fill="#FFFFFF"/>' +
                '<rect x="196" y="196" width="198" height="40" rx="6" fill="' + p.fabric + '"/><rect x="196" y="196" width="198" height="10" ' + shade + "/>" +
                '<rect x="218" y="156" width="70" height="30" rx="10" fill="#F5F0E8"/><rect x="300" y="156" width="70" height="30" rx="10" fill="#F5F0E8"/>' +
                '<rect x="200" y="236" width="6" height="14" fill="#3A2E2A"/><rect x="384" y="236" width="6" height="14" fill="#3A2E2A"/>' +
                '<rect x="252" y="56" width="86" height="46" rx="2" fill="' + p.accent + '" opacity=".6"/>';
        } else {
            o += '<rect x="196" y="40" width="190" height="56" fill="#FFFFFF"/><path d="M259 40v56M322 40v56" stroke="#000" stroke-opacity=".1" stroke-width="2"/>' +
                '<rect x="190" y="160" width="204" height="70" fill="' + p.fabric + '"/><rect x="190" y="160" width="204" height="70" ' + shade + "/>" +
                '<rect x="184" y="152" width="216" height="10" rx="2" fill="#EDE7DE"/>' +
                '<path d="M232 0v104M292 0v112M352 0v104" stroke="#2B2B2B" stroke-width="2"/>' +
                '<path d="M220 104h24l-4 12h-16z M280 112h24l-4 12h-16z M340 104h24l-4 12h-16z" fill="#2B2B2B"/>' +
                '<circle cx="232" cy="120" r="5" fill="#FFE29A"/><circle cx="292" cy="128" r="5" fill="#FFE29A"/><circle cx="352" cy="120" r="5" fill="#FFE29A"/>' +
                '<ellipse cx="236" cy="148" rx="18" ry="6" fill="#FFFFFF"/><circle cx="230" cy="144" r="5" fill="#E76F51"/><circle cx="240" cy="143" r="5" fill="#E9C46A"/>' +
                '<rect x="214" y="230" width="8" height="40" fill="#3A2E2A"/><rect x="204" y="226" width="28" height="6" rx="3" fill="#3A2E2A"/>' +
                '<rect x="300" y="230" width="8" height="40" fill="#3A2E2A"/><rect x="290" y="226" width="28" height="6" rx="3" fill="#3A2E2A"/>';
        }
        return o;
    }

    // Photo order: exterior, living room, bedroom, exterior at dusk, kitchen
    function photo(listing, index) {
        var p = listing.scene;
        switch (index) {
            case 1: return svg(interior(p, "living"));
            case 2: return svg(interior(p, "bedroom"));
            case 3: return svg(landscape(p, true));
            case 4: return svg(interior(p, "kitchen"));
            default: return svg(landscape(p, false));
        }
    }

    var PHOTO_COUNT = 5;
    var PHOTO_CAPTIONS = ["Exterior", "Living room", "Bedroom", "Evening view", "Kitchen"];

    // ========================================
    // SCREEN NAVIGATION
    // ========================================

    function navigateTo(screenId, addToHistory) {
        if (addToHistory === undefined) addToHistory = true;
        closePopovers();

        if (screenId !== currentScreen) {
            var screens = document.querySelectorAll(".screen");
            for (var i = 0; i < screens.length; i++) screens[i].classList.remove("active");
            $(screenId).classList.add("active");
            if (addToHistory) screenHistory.push(currentScreen);
            currentScreen = screenId;
            document.body.setAttribute("data-screen", screenId);
            if (screenId === "screen-home") renderGrid();
        }
        window.scrollTo(0, 0);
    }

    function goBack() {
        if (screenHistory.length > 0) {
            navigateTo(screenHistory.pop(), false);
        } else {
            navigateTo("screen-home", false);
        }
    }

    function goHome() {
        screenHistory = [];
        navigateTo("screen-home", false);
    }

    // ========================================
    // HOME: CATEGORIES + GRID
    // ========================================

    function renderCategories() {
        var html = "";
        for (var i = 0; i < CATEGORIES.length; i++) {
            var c = CATEGORIES[i];
            html += '<button class="cat-chip' + (activeCategory === c.id ? " active" : "") + '" data-category="' + c.id + '">' +
                '<span class="cat-icon" aria-hidden="true">' + c.icon + "</span><span>" + c.label + "</span></button>";
        }
        $("categoryBar").innerHTML = html;
    }

    function matchesSearch(l) {
        if (searchQuery) {
            var q = searchQuery.toLowerCase();
            var hay = (l.city + " " + l.region).toLowerCase();
            if (hay.indexOf(q) === -1) return false;
        }
        return l.guests >= guestCount();
    }

    function visibleListings() {
        return LISTINGS.filter(function (l) {
            if (showWishlist) return !!saved[l.id];
            if (activeCategory && l.categories.indexOf(activeCategory) === -1) return false;
            return matchesSearch(l);
        });
    }

    // Default card dates when the guest has not picked any: a 5-night window
    function suggestedDates(i) {
        var start = addDays(today(), 10 + i * 3);
        return [ymd(start), ymd(addDays(start, 5))];
    }

    function heartSvg() {
        return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"/></svg>';
    }

    function renderGrid() {
        var list = visibleListings();
        var nights = tripNights();
        var html = "";

        for (var i = 0; i < list.length; i++) {
            var l = list[i];
            var dates = nights ? [trip.checkIn, trip.checkOut] : suggestedDates(LISTINGS.indexOf(l));
            var n = nights || 5;
            var priceHtml = showTotals
                ? '<strong>' + money(l.price * n + l.cleaning + Math.round(l.price * n * SERVICE_FEE_RATE)) + "</strong> total before taxes"
                : "<strong>" + money(l.price) + "</strong> night";

            html += '<article class="card" data-listing="' + l.id + '" tabindex="0">' +
                '<div class="card-photo">' + photo(l, 0) +
                (l.rating >= 4.95 ? '<span class="fav-badge">Guest favorite</span>' : "") +
                '<button class="heart' + (saved[l.id] ? " saved" : "") + '" data-save="' + l.id + '" data-source="card" aria-label="Save">' + heartSvg() + "</button>" +
                "</div>" +
                '<div class="card-body">' +
                '<div class="card-row"><span class="card-city">' + l.city + ", " + l.region.split(",")[0] + '</span><span class="card-rating">&#9733; ' + l.rating.toFixed(2) + "</span></div>" +
                '<div class="card-meta">' + l.tagline + " &middot; " + plural(l.beds, "bed") + "</div>" +
                '<div class="card-meta">' + fmtRange(dates[0], dates[1]) + "</div>" +
                '<div class="card-price">' + priceHtml + "</div>" +
                "</div></article>";
        }

        $("listingGrid").innerHTML = html;
        $("emptyState").hidden = list.length > 0;
        renderResultsHead(list.length);
        return list.length;
    }

    function renderResultsHead(count) {
        var head = $("resultsHead");
        if (showWishlist) {
            head.hidden = false;
            $("resultsTitle").textContent = "Wishlist";
            $("resultsSub").textContent = plural(count, "saved stay");
            return;
        }
        if (!searchQuery && !tripNights() && guestCount() === 1) {
            head.hidden = true;
            return;
        }
        head.hidden = false;
        $("resultsTitle").textContent = plural(count, "stay") + (searchQuery ? " in " + searchQuery : "");
        var bits = [];
        if (tripNights()) bits.push(fmtRange(trip.checkIn, trip.checkOut) + " · " + tripNights() + " nights");
        bits.push(guestLabel());
        $("resultsSub").textContent = bits.join(" · ");
    }

    function renderInspiration(key) {
        var items = INSPIRATION[key];
        var html = "";
        for (var i = 0; i < items.length; i++) {
            html += '<button class="insp-item" data-dest="' + items[i][0] + '"><strong>' + items[i][0] + "</strong><span>" + items[i][1] + "</span></button>";
        }
        $("inspGrid").innerHTML = html;
    }

    // ========================================
    // SEARCH BAR + POPOVERS
    // ========================================

    function renderDestinations() {
        var seen = {};
        var html = '<button class="dest" data-dest=""><span class="dest-icon">&#129517;</span><span><strong>I\'m flexible</strong><em>Search anywhere</em></span></button>';
        for (var i = 0; i < LISTINGS.length; i++) {
            var l = LISTINGS[i];
            if (seen[l.city]) continue;
            seen[l.city] = true;
            html += '<button class="dest" data-dest="' + l.city + '"><span class="dest-icon">&#128205;</span><span><strong>' + l.city + "</strong><em>" + l.region + "</em></span></button>";
        }
        $("destList").innerHTML = html;
    }

    function filterDestinations() {
        var q = $("searchWhere").value.trim().toLowerCase();
        var items = $("destList").querySelectorAll(".dest");
        for (var i = 0; i < items.length; i++) {
            var text = items[i].textContent.toLowerCase();
            items[i].hidden = q && items[i].getAttribute("data-dest") && text.indexOf(q) === -1;
        }
    }

    var openPop = null;

    function openPopover(name) {
        closePopovers();
        var map = { where: "popWhere", dates: "popDates", guests: "popGuests" };
        var el = $(map[name]);
        if (!el) return;
        el.classList.add("open");
        openPop = name;
        var segs = document.querySelectorAll(".search-seg");
        for (var i = 0; i < segs.length; i++) {
            segs[i].classList.toggle("active", segs[i].getAttribute("data-pop") === name);
        }
        $("searchBar").classList.add("focused");
        if (name === "dates") renderCalendars();
    }

    function closePopovers() {
        var pops = document.querySelectorAll(".search-pop.open");
        for (var i = 0; i < pops.length; i++) pops[i].classList.remove("open");
        var segs = document.querySelectorAll(".search-seg.active");
        for (var j = 0; j < segs.length; j++) segs[j].classList.remove("active");
        $("searchBar").classList.remove("focused");
        $("pbGuestsPop").classList.remove("open");
        $("userDropdown").classList.remove("open");
        $("btnUserMenu").setAttribute("aria-expanded", "false");
        openPop = null;
    }

    function runSearch() {
        searchQuery = $("searchWhere").value.trim();
        activeCategory = null;
        showWishlist = false;
        renderCategories();
        var count = renderGrid();
        trackSearchPerformed(searchQuery, trip.checkIn, trip.checkOut, guestCount(), count);
        screenHistory = [];
        navigateTo("screen-home", false);
        showToast(plural(count, "stay") + " found");
    }

    function clearSearch() {
        searchQuery = "";
        activeCategory = null;
        showWishlist = false;
        $("searchWhere").value = "";
        renderCategories();
        renderGrid();
    }

    // ========================================
    // GUESTS
    // ========================================

    function maxGuestsHere() {
        return currentScreen === "screen-listing" && currentListing ? currentListing.guests : MAX_SEARCH_GUESTS;
    }

    function renderSteppers() {
        var steppers = document.querySelectorAll(".stepper");
        var max = maxGuestsHere();
        for (var i = 0; i < steppers.length; i++) {
            var key = steppers[i].getAttribute("data-guest");
            var val = trip.guests[key];
            var min = key === "adults" ? 1 : 0;
            var atMax = (key === "adults" || key === "children") ? guestCount() >= max : val >= 5;
            steppers[i].innerHTML =
                '<button class="step-btn" data-step="-1" aria-label="Decrease"' + (val <= min ? " disabled" : "") + ">&minus;</button>" +
                '<span class="step-val">' + val + "</span>" +
                '<button class="step-btn" data-step="1" aria-label="Increase"' + (atMax ? " disabled" : "") + ">+</button>";
        }
    }

    function changeGuests(key, delta) {
        var min = key === "adults" ? 1 : 0;
        var next = trip.guests[key] + delta;
        if (next < min) return;
        if (delta > 0 && (key === "adults" || key === "children") && guestCount() >= maxGuestsHere()) return;
        trip.guests[key] = next;
        refreshTripUI();
    }

    function clampGuestsTo(max) {
        if (guestCount() <= max) return false;
        trip.guests.children = Math.max(0, Math.min(trip.guests.children, max - 1));
        trip.guests.adults = Math.max(1, max - trip.guests.children);
        return true;
    }

    // ========================================
    // CALENDAR
    // ========================================

    var DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    function renderCalendar(container) {
        var offset = +(container.getAttribute("data-offset") || 0);
        var t = today();
        var todayKey = ymd(t);
        var html = '<div class="cal-nav">' +
            '<button class="cal-arrow" data-cal-nav="-1" aria-label="Previous month"' + (offset <= 0 ? " disabled" : "") + ">&#8249;</button>" +
            '<button class="cal-arrow" data-cal-nav="1" aria-label="Next month"' + (offset >= 10 ? " disabled" : "") + ">&#8250;</button></div>" +
            '<div class="cal-months">';

        for (var m = 0; m < 2; m++) {
            var first = new Date(t.getFullYear(), t.getMonth() + offset + m, 1);
            var daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
            html += '<div class="cal-month"><div class="cal-title">' +
                first.toLocaleDateString("en-US", { month: "long", year: "numeric" }) + '</div><div class="cal-grid">';
            for (var d = 0; d < 7; d++) html += '<span class="cal-dow">' + DOW[d] + "</span>";
            for (var b = 0; b < first.getDay(); b++) html += '<span class="cal-blank"></span>';
            for (var day = 1; day <= daysInMonth; day++) {
                var date = new Date(first.getFullYear(), first.getMonth(), day);
                var key = ymd(date);
                var cls = "cal-day";
                var past = date < t;
                if (past) cls += " past";
                if (key === trip.checkIn) cls += " start";
                if (key === trip.checkOut) cls += " end";
                if (trip.checkIn && trip.checkOut && key > trip.checkIn && key < trip.checkOut) cls += " in-range";
                if (trip.checkIn && trip.checkOut && key === trip.checkIn) cls += " range-start";
                if (key === todayKey) cls += " today";
                html += '<button class="' + cls + '" data-date="' + key + '"' + (past ? " disabled" : "") + "><span>" + day + "</span></button>";
            }
            html += "</div></div>";
        }
        container.innerHTML = html + "</div>";
    }

    function renderCalendars() {
        var cals = document.querySelectorAll(".calendar");
        for (var i = 0; i < cals.length; i++) renderCalendar(cals[i]);
    }

    function pickDate(key, source) {
        if (!trip.checkIn || trip.checkOut || key <= trip.checkIn) {
            trip.checkIn = key;
            trip.checkOut = null;
        } else {
            trip.checkOut = key;
            var city = source === "listing" && currentListing ? currentListing.city : $("searchWhere").value.trim();
            trackDatesSelected(city, trip.checkIn, trip.checkOut, tripNights(), source);
        }
        refreshTripUI();
        if (trip.checkOut && source === "search") {
            setTimeout(function () {
                openPopover("guests");
            }, 250);
        }
    }

    function clearDates() {
        trip.checkIn = null;
        trip.checkOut = null;
        refreshTripUI();
    }

    // ========================================
    // LISTING DETAIL
    // ========================================

    function openListing(id, source) {
        var l = findListing(id);
        if (!l) return;
        currentListing = l;
        if (!listingFirstViewedAt[id]) listingFirstViewedAt[id] = Date.now();

        $("ldTitle").textContent = l.title;
        $("ldSubtitle").textContent = l.type + " in " + l.city + ", " + l.region.split(",")[0];
        $("ldSpecs").textContent = l.guests + " guests · " + plural(l.bedrooms, "bedroom") + " · " + plural(l.beds, "bed") + " · " + plural(l.baths, "bath");
        $("ldFav").hidden = l.rating < 4.9;
        $("ldRating").textContent = l.rating.toFixed(2);
        $("ldReviews").textContent = l.reviews;
        $("ldHostAvatar").textContent = l.host.charAt(0);
        $("ldHostAvatar").style.background = l.scene.fabric;
        $("ldHost").textContent = "Hosted by " + l.host;
        $("ldHostMeta").textContent = (l.superhost ? "Superhost · " : "") + l.hostYears + " years hosting";
        $("ldDesc").textContent = l.desc;
        $("ldDesc").classList.remove("expanded");
        $("btnShowMore").textContent = "Show more";

        var g = "";
        for (var i = 0; i < PHOTO_COUNT; i++) {
            g += '<button class="g-tile g-' + i + '" data-photo="' + i + '" aria-label="Open photo ' + (i + 1) + '">' + photo(l, i) + "</button>";
        }
        g += '<button class="g-all" id="btnAllPhotos"><span aria-hidden="true">&#9638;</span> Show all photos</button>';
        $("ldGallery").innerHTML = g;

        renderAmenities(false);
        renderReviews(l);

        var clamped = clampGuestsTo(l.guests);
        var calendar = document.querySelector('.calendar[data-source="listing"]');
        calendar.setAttribute("data-offset", "0");

        trackListingViewed(l, source);
        navigateTo("screen-listing");
        refreshTripUI();
        refreshSaved();
        if (clamped) showToast("This place allows up to " + l.guests + " guests");
    }

    function renderAmenities(all) {
        var l = currentListing;
        var keys = all ? l.amenities : l.amenities.slice(0, 8);
        var html = "";
        for (var i = 0; i < keys.length; i++) {
            var a = AMENITIES[keys[i]];
            html += '<div class="amenity"><span class="am-icon" aria-hidden="true">' + a[0] + "</span>" + a[1] + "</div>";
        }
        $("ldAmenities").innerHTML = html;
        var btn = $("btnAmenities");
        btn.textContent = all ? "Show fewer amenities" : "Show all " + l.amenities.length + " amenities";
        btn.setAttribute("data-all", all ? "1" : "0");
    }

    function renderReviews(l) {
        var start = LISTINGS.indexOf(l) % REVIEWERS.length;
        var html = "";
        for (var i = 0; i < 4; i++) {
            var name = REVIEWERS[(start + i * 3) % REVIEWERS.length];
            html += '<div class="review"><div class="rv-head"><span class="rv-avatar" style="background:' + AVATAR_COLORS[i] + '">' + name.charAt(0) + "</span>" +
                "<div><strong>" + name + "</strong><span>" + plural(i + 1, "month") + " ago" + "</span></div></div>" +
                '<div class="rv-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p>' + REVIEW_TEXT[i].replace("{city}", l.city) + "</p></div>";
        }
        $("ldReviewGrid").innerHTML = html;
        $("revTitle").innerHTML = "&#9733; " + l.rating.toFixed(2) + " &middot; " + l.reviews + " reviews";
    }

    function breakdownHtml(l, nights) {
        var pr = priceFor(l, nights);
        return '<div class="bd-row"><span class="u">' + money(l.price) + " x " + plural(nights, "night") + "</span><span>" + money(pr.subtotal) + "</span></div>" +
            '<div class="bd-row"><span class="u">Cleaning fee</span><span>' + money(pr.cleaning) + "</span></div>" +
            '<div class="bd-row"><span class="u">Lodgely service fee</span><span>' + money(pr.service) + "</span></div>" +
            '<div class="bd-row"><span class="u">Taxes</span><span>' + money(pr.taxes) + "</span></div>" +
            '<div class="bd-row bd-total"><span>Total (USD)</span><span>' + money(pr.total) + "</span></div>";
    }

    function renderPriceBox() {
        var l = currentListing;
        if (!l) return;
        var nights = tripNights();
        $("pbPrice").textContent = money(l.price);
        $("pbRating").innerHTML = "&#9733; " + l.rating.toFixed(2) + ' &middot; <span class="u">' + l.reviews + " reviews</span>";
        $("pbCheckIn").textContent = trip.checkIn ? parseYmd(trip.checkIn).toLocaleDateString("en-US") : "Add date";
        $("pbCheckOut").textContent = trip.checkOut ? parseYmd(trip.checkOut).toLocaleDateString("en-US") : "Add date";
        $("pbGuests").textContent = guestLabel();
        $("pbMax").textContent = "This place has a maximum of " + l.guests + " guests, not including infants.";
        $("pbReserve").textContent = nights ? "Reserve" : "Check availability";
        $("pbNote").hidden = !nights;
        $("pbBreakdown").innerHTML = nights ? breakdownHtml(l, nights) : "";

        if (nights) {
            $("calTitle").textContent = plural(nights, "night") + " in " + l.city;
            $("calSub").textContent = fmtLong(trip.checkIn) + " – " + fmtLong(trip.checkOut);
        } else if (trip.checkIn) {
            $("calTitle").textContent = "Select checkout date";
            $("calSub").textContent = "Minimum stay: 1 night";
        } else {
            $("calTitle").textContent = "Select check-in date";
            $("calSub").textContent = "Add your travel dates for exact pricing";
        }
    }

    function scrollToCalendar() {
        var section = $("calendarSection");
        section.scrollIntoView({ behavior: "smooth", block: "center" });
        section.classList.remove("pulse");
        void section.offsetWidth;
        section.classList.add("pulse");
    }

    // ========================================
    // GALLERY MODAL
    // ========================================

    function openGallery(startPhoto) {
        var l = currentListing;
        var html = "";
        for (var i = 0; i < PHOTO_COUNT; i++) {
            html += '<figure class="gm-photo' + (i === 0 || i === 3 ? " wide" : "") + '" id="gm-photo-' + i + '">' + photo(l, i) + "<figcaption>" + PHOTO_CAPTIONS[i] + "</figcaption></figure>";
        }
        $("gmBody").innerHTML = html;
        $("gmTitle").textContent = l.title;
        $("gmCount").textContent = PHOTO_COUNT + " photos";
        $("galleryModal").classList.add("open");
        $("galleryModal").setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
        var target = $("gm-photo-" + startPhoto);
        if (target && startPhoto > 0) {
            setTimeout(function () {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 80);
        } else {
            $("gmBody").scrollTop = 0;
        }
        trackPhotoGalleryOpened(l, PHOTO_COUNT, startPhoto + 1);
    }

    function closeGallery() {
        $("galleryModal").classList.remove("open");
        $("galleryModal").setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");
    }

    // ========================================
    // WISHLIST
    // ========================================

    function toggleSave(id, source) {
        var l = findListing(id);
        if (!l) return;
        if (saved[id]) {
            delete saved[id];
            showToast("Removed from Wishlist");
        } else {
            saved[id] = true;
            trackListingSaved(l, source, savedCount());
            showToast("Saved to Wishlist");
        }
        refreshSaved();
        if (showWishlist) renderGrid();
    }

    function refreshSaved() {
        var hearts = document.querySelectorAll("[data-save]");
        for (var i = 0; i < hearts.length; i++) {
            var on = !!saved[hearts[i].getAttribute("data-save")];
            hearts[i].classList.toggle("saved", on);
        }
        if (currentListing) {
            var on2 = !!saved[currentListing.id];
            $("ldSave").classList.toggle("saved", on2);
            $("ldSave").querySelector(".save-label").textContent = on2 ? "Saved" : "Save";
        }
        $("ddWishCount").textContent = savedCount();
        $("wishlistDot").hidden = savedCount() === 0;
    }

    // ========================================
    // CHECKOUT
    // ========================================

    function startBooking() {
        var l = currentListing;
        var nights = tripNights();
        if (!nights) {
            scrollToCalendar();
            showToast(trip.checkIn ? "Choose a checkout date" : "Add dates for prices");
            return;
        }
        var pr = priceFor(l, nights);
        trackBookingStarted(l, nights, guestCount(), pr.total);
        renderCheckout();
        navigateTo("screen-checkout");
    }

    function renderCheckout() {
        var l = currentListing;
        var nights = tripNights();
        var pr = priceFor(l, nights);
        $("coDates").textContent = fmtRange(trip.checkIn, trip.checkOut) + ", " + parseYmd(trip.checkOut).getFullYear() + " · " + plural(nights, "night");
        $("coGuests").textContent = guestLabel();
        $("coPayFull").textContent = "Pay " + money(pr.total) + " now";
        $("coPaySplitSub").textContent = money(Math.ceil(pr.total / 2)) + " due today, " + money(Math.floor(pr.total / 2)) + " charged before check-in. No extra fees.";
        $("coThumb").innerHTML = photo(l, 0);
        $("coTitle").textContent = l.title;
        $("coType").textContent = l.type + " · " + l.city;
        $("coRating").innerHTML = "&#9733; " + l.rating.toFixed(2) + " (" + l.reviews + ")" + (l.superhost ? " &middot; Superhost" : "");
        $("coBreakdown").innerHTML = breakdownHtml(l, nights);
        clearFieldErrors();
    }

    function clearFieldErrors() {
        var bad = document.querySelectorAll(".field.invalid");
        for (var i = 0; i < bad.length; i++) bad[i].classList.remove("invalid");
        $("ccError").textContent = "";
    }

    function markInvalid(id) {
        $(id).parentNode.classList.add("invalid");
    }

    function validateCard() {
        clearFieldErrors();
        var errors = [];
        var num = $("ccNumber").value.replace(/\D/g, "");
        var exp = $("ccExp").value.replace(/\D/g, "");
        var cvv = $("ccCvv").value.replace(/\D/g, "");
        if (num.length < 13) {
            markInvalid("ccNumber");
            errors.push("Check your card number.");
        }
        var mm = +exp.slice(0, 2);
        if (exp.length !== 4 || mm < 1 || mm > 12) {
            markInvalid("ccExp");
            errors.push("Check the expiration date.");
        }
        if (cvv.length < 3) {
            markInvalid("ccCvv");
            errors.push("Check the CVV.");
        }
        if (!$("ccZip").value.trim()) {
            markInvalid("ccZip");
            errors.push("Add a ZIP code.");
        }
        $("ccError").textContent = errors.join(" ");
        return errors.length === 0;
    }

    function confirmAndPay() {
        var btn = $("btnConfirmPay");
        if (btn.classList.contains("loading")) return;
        if (!validateCard()) {
            showToast("Please fix the highlighted fields");
            $("cardForm").scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }
        btn.classList.add("loading");
        setTimeout(function () {
            btn.classList.remove("loading");
            completeBooking();
        }, 1400);
    }

    function reservationCode() {
        var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var s = "LG";
        for (var i = 0; i < 8; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
        return s;
    }

    function completeBooking() {
        var l = currentListing;
        var nights = tripNights();
        var pr = priceFor(l, nights);
        var seconds = Math.round((Date.now() - listingFirstViewedAt[l.id]) / 1000);
        trackBookingCompleted(l, nights, guestCount(), pr.total, seconds);

        lastBooking = { code: reservationCode() };
        $("cfHeadline").textContent = "You're going to " + l.city + "!";
        $("cfSub").textContent = "We sent your confirmation and check-in details to your inbox. " + l.host + " will be in touch before your trip.";
        $("cfPhoto").innerHTML = photo(l, 0);
        $("cfTitle").textContent = l.title;
        $("cfCheckIn").textContent = fmtLong(trip.checkIn);
        $("cfCheckOut").textContent = fmtLong(trip.checkOut);
        $("cfGuests").textContent = guestLabel();
        $("cfTotal").textContent = money(pr.total);
        $("cfCode").textContent = lastBooking.code;

        screenHistory = [];
        navigateTo("screen-confirmed", false);
    }

    // ========================================
    // REFRESH
    // ========================================

    function refreshTripUI() {
        $("valCheckIn").textContent = trip.checkIn ? fmtShort(trip.checkIn) : "Add dates";
        $("valCheckOut").textContent = trip.checkOut ? fmtShort(trip.checkOut) : "Add dates";
        $("valGuests").textContent = guestCount() > 1 || trip.guests.infants || trip.guests.pets ? guestLabel() : "Add guests";
        $("popDatesHint").textContent = !trip.checkIn ? "Select your check-in date" : !trip.checkOut ? "Select your checkout date" : tripNights() + " nights selected";
        renderCalendars();
        renderSteppers();
        renderPriceBox();
        if (currentScreen === "screen-home") renderGrid();
    }

    // ========================================
    // ERROR TRIGGER FUNCTIONS
    // All errors are caught and logged with console.error so they show up
    // in session replay (record_console) without becoming uncaught errors.
    // ========================================

    function flashButton(btn) {
        btn.classList.remove("flash");
        void btn.offsetWidth;
        btn.classList.add("flash");
    }

    function triggerTypeError() {
        console.log("[ERROR DEMO] Triggering TypeError...");
        try {
            var availability = null;
            availability.getOpenDates();
        } catch (e) {
            console.error("[LODGELY] Calendar failed to load availability:", e);
        }
    }

    function triggerReferenceError() {
        console.log("[ERROR DEMO] Triggering ReferenceError...");
        try {
            lodgelyPricingAPI.getQuote("lg-101");
        } catch (e) {
            console.error("[LODGELY] Pricing service unavailable:", e);
        }
    }

    function triggerRangeError() {
        console.log("[ERROR DEMO] Triggering RangeError...");
        try {
            var nights = -2;
            new Array(nights);
        } catch (e) {
            console.error("[LODGELY] Invalid stay length:", e);
        }
    }

    function triggerSyntaxError() {
        console.log("[ERROR DEMO] Triggering SyntaxError...");
        try {
            JSON.parse("{ listing: lg-101, nights: }");
        } catch (e) {
            console.error("[LODGELY] Could not parse booking payload:", e);
        }
    }

    function triggerURIError() {
        console.log("[ERROR DEMO] Triggering URIError...");
        try {
            decodeURIComponent("%E0%A4%A");
        } catch (e) {
            console.error("[LODGELY] Malformed search URL:", e);
        }
    }

    function triggerNetworkError() {
        console.log("[ERROR DEMO] Triggering Network Error...");
        fetch("https://api.lodgely.example/v1/listings/lg-101/availability")
            .then(function (r) {
                return r.json();
            })
            .catch(function (err) {
                console.error("[NETWORK ERROR] Failed to fetch availability:", err.message);
            });
    }

    function triggerPromiseRejection() {
        console.log("[ERROR DEMO] Triggering Promise Rejection...");
        Promise.reject(new Error("Payment authorization declined for reservation LGDEMO1234"))
            .catch(function (e) {
                console.error("[LODGELY] Rejected promise:", e);
            });
    }

    function triggerCustomError() {
        console.log("[ERROR DEMO] Triggering Custom Error...");
        try {
            throw new Error("Lodgely Payments: card authorization timed out (HTTP 504)");
        } catch (e) {
            console.error(e);
        }
    }

    function triggerConsoleError() {
        console.error("[LODGELY APP ERROR] Failed to load host profile:", {
            endpoint: "/api/hosts/demo-host",
            status: 500,
            message: "Internal Server Error",
            listingId: currentListing ? currentListing.id : "lg-101",
            timestamp: new Date().toISOString()
        });
    }

    function triggerConsoleWarn() {
        console.warn("[LODGELY APP WARNING] Price quote expires in 30 seconds", {
            quoteExpiry: new Date(Date.now() + 30000).toISOString(),
            listingId: currentListing ? currentListing.id : "lg-101",
            action: "re-quote scheduled"
        });
    }

    // ========================================
    // INPUT FORMATTING
    // ========================================

    function formatCardNumber() {
        var v = this.value.replace(/\D/g, "").slice(0, 16);
        this.value = v.replace(/(.{4})/g, "$1 ").trim();
    }

    function formatExpiry() {
        var v = this.value.replace(/\D/g, "").slice(0, 4);
        this.value = v.length > 2 ? v.slice(0, 2) + " / " + v.slice(2) : v;
    }

    function digitsOnly() {
        this.value = this.value.replace(/\D/g, "");
    }

    // ========================================
    // INIT
    // ========================================

    function init() {
        renderCategories();
        renderDestinations();
        renderInspiration("popular");
        refreshTripUI();
        refreshSaved();

        // ---- Delegated clicks ----
        document.addEventListener("click", function (e) {
            var t = e.target;

            // Click outside open popovers closes them
            if (!t.closest(".search-wrap") && !t.closest(".pb-guests") && !t.closest(".user-menu-wrap")) {
                closePopovers();
            }

            var saveBtn = t.closest("[data-save]");
            if (saveBtn) {
                e.stopPropagation();
                toggleSave(saveBtn.getAttribute("data-save"), saveBtn.getAttribute("data-source") || "card");
                return;
            }

            var card = t.closest("[data-listing]");
            if (card) {
                openListing(card.getAttribute("data-listing"), showWishlist ? "wishlist" : searchQuery ? "search_results" : "home_grid");
                return;
            }

            var cat = t.closest("[data-category]");
            if (cat) {
                var id = cat.getAttribute("data-category");
                activeCategory = activeCategory === id ? null : id;
                showWishlist = false;
                renderCategories();
                renderGrid();
                return;
            }

            var dateBtn = t.closest("[data-date]");
            if (dateBtn && !dateBtn.disabled) {
                pickDate(dateBtn.getAttribute("data-date"), dateBtn.closest(".calendar").getAttribute("data-source"));
                return;
            }

            var nav = t.closest("[data-cal-nav]");
            if (nav && !nav.disabled) {
                var cal = nav.closest(".calendar");
                var offset = +(cal.getAttribute("data-offset") || 0) + +nav.getAttribute("data-cal-nav");
                cal.setAttribute("data-offset", String(Math.max(0, offset)));
                renderCalendar(cal);
                return;
            }

            if (t.closest("[data-clear-dates]")) {
                clearDates();
                return;
            }

            var step = t.closest("[data-step]");
            if (step && !step.disabled) {
                changeGuests(step.closest(".stepper").getAttribute("data-guest"), +step.getAttribute("data-step"));
                return;
            }

            var dest = t.closest("[data-dest]");
            if (dest) {
                $("searchWhere").value = dest.getAttribute("data-dest");
                if (dest.classList.contains("insp-item")) {
                    runSearch();
                } else {
                    openPopover("dates");
                }
                return;
            }

            var tile = t.closest("[data-photo]");
            if (tile) {
                openGallery(+tile.getAttribute("data-photo"));
                return;
            }
            if (t.closest("#btnAllPhotos")) {
                openGallery(0);
                return;
            }

            if (t.closest("[data-back]")) {
                goBack();
                return;
            }

            var seg = t.closest("[data-pop]");
            if (seg) {
                if (t.closest("#searchBtn")) return;
                if (currentScreen !== "screen-home" && currentScreen !== "screen-listing") return;
                openPopover(seg.getAttribute("data-pop"));
                if (seg.getAttribute("data-pop") === "where") $("searchWhere").focus();
            }
        });

        // ---- Search ----
        $("searchBtn").addEventListener("click", function (e) {
            e.stopPropagation();
            closePopovers();
            runSearch();
        });
        $("searchWhere").addEventListener("input", function () {
            filterDestinations();
            if (openPop !== "where") openPopover("where");
        });
        $("searchWhere").addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                closePopovers();
                runSearch();
            }
        });
        $("btnClearSearch").addEventListener("click", clearSearch);
        $("btnEmptyReset").addEventListener("click", clearSearch);

        // ---- Header ----
        $("brandHome").addEventListener("click", function (e) {
            e.preventDefault();
            goHome();
        });
        var tabs = document.querySelectorAll(".header-tab");
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].addEventListener("click", function () {
                if (this.getAttribute("data-tab") === "stays") {
                    goHome();
                } else {
                    showToast(this.textContent.replace("NEW", "").trim() + " are coming soon");
                }
            });
        }
        $("btnHost").addEventListener("click", function () {
            showToast("Hosting isn't part of this demo");
        });
        $("btnGlobe").addEventListener("click", function () {
            showToast("English (US) · USD");
        });
        $("btnUserMenu").addEventListener("click", function (e) {
            e.stopPropagation();
            var dd = $("userDropdown");
            var open = !dd.classList.contains("open");
            closePopovers();
            dd.classList.toggle("open", open);
            this.setAttribute("aria-expanded", open ? "true" : "false");
        });
        var menuItems = document.querySelectorAll("[data-menu]");
        for (var m = 0; m < menuItems.length; m++) {
            menuItems[m].addEventListener("click", function () {
                var item = this.getAttribute("data-menu");
                closePopovers();
                if (item === "wishlists") {
                    showWishlist = true;
                    activeCategory = null;
                    renderCategories();
                    renderGrid();
                    goHome();
                } else if (item === "trips") {
                    if (lastBooking) navigateTo("screen-confirmed");
                    else showToast("No trips booked... yet!");
                } else if (item === "messages") {
                    showToast("No new messages");
                } else if (item === "host") {
                    showToast("Hosting isn't part of this demo");
                } else {
                    showToast("Help Center isn't part of this demo");
                }
            });
        }

        // ---- Home tools ----
        $("btnFilters").addEventListener("click", function () {
            this.classList.toggle("active");
            showToast("Filters: " + visibleListings().length + " stays match");
        });
        $("btnTaxToggle").addEventListener("click", function () {
            showTotals = !showTotals;
            this.classList.toggle("on", showTotals);
            this.setAttribute("aria-checked", showTotals ? "true" : "false");
            renderGrid();
        });
        var inspTabs = document.querySelectorAll(".insp-tab");
        for (var k = 0; k < inspTabs.length; k++) {
            inspTabs[k].addEventListener("click", function () {
                for (var j = 0; j < inspTabs.length; j++) inspTabs[j].classList.remove("active");
                this.classList.add("active");
                renderInspiration(this.getAttribute("data-insp"));
            });
        }
        $("listingGrid").addEventListener("keydown", function (e) {
            var card = e.target.closest("[data-listing]");
            if (card && e.key === "Enter") openListing(card.getAttribute("data-listing"), "home_grid");
        });

        // ---- Listing ----
        $("ldSave").addEventListener("click", function () {
            if (currentListing) toggleSave(currentListing.id, "listing_page");
        });
        $("btnShare").addEventListener("click", function () {
            var url = window.location.href.split("#")[0] + "#" + (currentListing ? currentListing.id : "");
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).catch(function () {});
            }
            showToast("Link copied");
        });
        $("btnShowMore").addEventListener("click", function () {
            var expanded = $("ldDesc").classList.toggle("expanded");
            this.textContent = expanded ? "Show less" : "Show more";
        });
        $("btnAmenities").addEventListener("click", function () {
            renderAmenities(this.getAttribute("data-all") !== "1");
        });
        $("pbCheckInBtn").addEventListener("click", scrollToCalendar);
        $("pbCheckOutBtn").addEventListener("click", scrollToCalendar);
        $("pbGuestsBtn").addEventListener("click", function (e) {
            e.stopPropagation();
            var pop = $("pbGuestsPop");
            var open = !pop.classList.contains("open");
            closePopovers();
            pop.classList.toggle("open", open);
        });
        $("pbGuestsClose").addEventListener("click", function (e) {
            e.stopPropagation();
            $("pbGuestsPop").classList.remove("open");
        });
        $("pbReserve").addEventListener("click", startBooking);
        $("btnReport").addEventListener("click", function () {
            showToast("Thanks, we'll take a look");
        });

        // ---- Gallery ----
        $("gmClose").addEventListener("click", closeGallery);

        // ---- Checkout ----
        $("coEditDates").addEventListener("click", function () {
            goBack();
            setTimeout(scrollToCalendar, 50);
        });
        $("coEditGuests").addEventListener("click", function () {
            goBack();
            setTimeout(function () {
                $("pbGuestsPop").classList.add("open");
            }, 50);
        });
        var payOpts = document.querySelectorAll('input[name="payPlan"]');
        for (var p = 0; p < payOpts.length; p++) {
            payOpts[p].addEventListener("change", function () {
                var labels = document.querySelectorAll(".pay-opt");
                for (var q = 0; q < labels.length; q++) labels[q].classList.remove("selected");
                this.closest(".pay-opt").classList.add("selected");
            });
        }
        $("ccNumber").addEventListener("input", formatCardNumber);
        $("ccExp").addEventListener("input", formatExpiry);
        $("ccCvv").addEventListener("input", digitsOnly);
        $("btnTestCard").addEventListener("click", function () {
            $("ccNumber").value = "4242 4242 4242 4242";
            $("ccExp").value = "12 / 30";
            $("ccCvv").value = "123";
            $("ccZip").value = "94107";
            clearFieldErrors();
            showToast("Test card added");
        });
        $("cardForm").addEventListener("submit", function (e) {
            e.preventDefault();
            confirmAndPay();
        });
        $("btnConfirmPay").addEventListener("click", confirmAndPay);
        $("btnPolicy").addEventListener("click", function () {
            showToast("Full refund within 48 hours of booking");
        });

        // ---- Confirmed ----
        $("btnItinerary").addEventListener("click", function () {
            showToast("Itinerary sent to your email");
        });
        $("btnMessageHost").addEventListener("click", function () {
            showToast("Message thread opened with " + (currentListing ? currentListing.host : "your host"));
        });
        $("btnKeepExploring").addEventListener("click", function () {
            clearDates();
            goHome();
        });

        // ---- Footer ----
        var footerLinks = document.querySelectorAll("[data-footer]");
        for (var f = 0; f < footerLinks.length; f++) {
            footerLinks[f].addEventListener("click", function () {
                showToast(this.textContent + " isn't part of this demo");
            });
        }

        // ---- Keyboard ----
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                closeGallery();
                closePopovers();
            }
        });

        // ---- Error panel ----
        var toggle = $("errorPanelToggle");
        var panel = $("errorPanel");
        toggle.addEventListener("click", function () {
            panel.classList.toggle("open");
        });
        $("errorPanelClose").addEventListener("click", function () {
            panel.classList.remove("open");
        });

        var errorMap = {
            "btn-type-error": triggerTypeError,
            "btn-ref-error": triggerReferenceError,
            "btn-range-error": triggerRangeError,
            "btn-syntax-error": triggerSyntaxError,
            "btn-uri-error": triggerURIError,
            "btn-network-error": triggerNetworkError,
            "btn-promise-error": triggerPromiseRejection,
            "btn-custom-error": triggerCustomError,
            "btn-console-error": triggerConsoleError,
            "btn-console-warn": triggerConsoleWarn
        };
        Object.keys(errorMap).forEach(function (id) {
            $(id).addEventListener("click", function () {
                flashButton(this);
                showToast("Logged: " + this.textContent);
                errorMap[id]();
            });
        });

        // ---- Reset ----
        document.getElementById("btnReset").addEventListener("click", function () {
            if (typeof window.RESET === "function") window.RESET();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
