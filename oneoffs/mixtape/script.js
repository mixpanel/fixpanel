// ── Data ──

var TRACKS = [
    { id: 1,  title: "Midnight Rain",        artist: "Cloudset",        genre: "lo_fi_ambient",  duration: "3:42", color1: "#1a1a2e", color2: "#4a3f8a" },
    { id: 2,  title: "Sunday Morning Haze",  artist: "Sleepy Waves",    genre: "lo_fi_ambient",  duration: "4:15", color1: "#2d3436", color2: "#636e72" },
    { id: 3,  title: "Quiet Hours",          artist: "Driftwood",       genre: "lo_fi_ambient",  duration: "3:58", color1: "#0c1445", color2: "#3c5186" },
    { id: 4,  title: "Paper Lanterns",       artist: "Yume",            genre: "lo_fi_ambient",  duration: "4:32", color1: "#1b1b3a", color2: "#6b5b95" },
    { id: 5,  title: "Fog and Moss",         artist: "Terrain",         genre: "lo_fi_ambient",  duration: "5:01", color1: "#1a332e", color2: "#4a8a6e" },
    { id: 6,  title: "Two AM Coffee",        artist: "Rooftop Sessions", genre: "lo_fi_ambient", duration: "3:27", color1: "#2c1810", color2: "#6b4423" },
    { id: 7,  title: "Static Lullaby",       artist: "Cloudset",        genre: "lo_fi_ambient",  duration: "4:48", color1: "#1a1a2e", color2: "#5a4f9a" },
    { id: 8,  title: "Windowsill",           artist: "Sleepy Waves",    genre: "lo_fi_ambient",  duration: "3:33", color1: "#2a2a3e", color2: "#7a6faa" },
    { id: 9,  title: "Neon Lights",          artist: "Aria Cole",       genre: "pop",            duration: "3:18", color1: "#ff006e", color2: "#ff7eb3" },
    { id: 10, title: "Summer Drive",         artist: "Luna Park",       genre: "pop",            duration: "3:45", color1: "#ff9a00", color2: "#ffcd38" },
    { id: 11, title: "Heartbeat City",       artist: "The Echoes",      genre: "pop",            duration: "3:22", color1: "#e63946", color2: "#f4a261" },
    { id: 12, title: "Golden Hour",          artist: "Aria Cole",       genre: "pop",            duration: "4:01", color1: "#ffd700", color2: "#ffb347" },
    { id: 13, title: "Satellite",            artist: "Prism",           genre: "pop",            duration: "3:55", color1: "#00b4d8", color2: "#90e0ef" },
    { id: 14, title: "Thunderstruck Road",   artist: "Iron Coast",      genre: "rock",           duration: "4:33", color1: "#8b0000", color2: "#dc143c" },
    { id: 15, title: "Burning Bridges",      artist: "Voltage",         genre: "rock",           duration: "3:49", color1: "#1a1a1a", color2: "#555555" },
    { id: 16, title: "Midnight Engine",      artist: "The Wrecks",      genre: "rock",           duration: "5:12", color1: "#333333", color2: "#888888" },
    { id: 17, title: "Wildfire",             artist: "Iron Coast",      genre: "rock",           duration: "4:07", color1: "#8b2500", color2: "#cd5c5c" },
    { id: 18, title: "Block Party",          artist: "K.Nova",          genre: "hip_hop",        duration: "3:28", color1: "#2d132c", color2: "#801336" },
    { id: 19, title: "Crown",               artist: "DOT.",            genre: "hip_hop",        duration: "3:55", color1: "#0d0d0d", color2: "#4a0e4e" },
    { id: 20, title: "Late Night Metro",     artist: "SoundWave",       genre: "hip_hop",        duration: "4:12", color1: "#1a0533", color2: "#5b2c8e" },
    { id: 21, title: "No Signal",            artist: "K.Nova",          genre: "hip_hop",        duration: "3:41", color1: "#2d1b4e", color2: "#7b5ea7" },
    { id: 22, title: "Pulse",               artist: "Synthwave Dreams", genre: "electronic",     duration: "5:30", color1: "#0f0c29", color2: "#302b63" },
    { id: 23, title: "Circuit",             artist: "Neon Grid",       genre: "electronic",     duration: "4:45", color1: "#000428", color2: "#004e92" },
    { id: 24, title: "Binary Sunset",       artist: "CTRL+Z",          genre: "electronic",     duration: "6:12", color1: "#0f2027", color2: "#2c5364" },
    { id: 25, title: "Datastream",          artist: "Synthwave Dreams", genre: "electronic",     duration: "4:58", color1: "#1a0533", color2: "#3a1c71" },
    { id: 26, title: "Afterglow",           artist: "Photon",          genre: "electronic",     duration: "5:15", color1: "#11001c", color2: "#3d0066" },
    { id: 27, title: "Blue Note Evening",    artist: "Miles Apart",     genre: "jazz",           duration: "6:45", color1: "#1b2838", color2: "#2c5f7c" },
    { id: 28, title: "Smokey Room",          artist: "The Quintet",     genre: "jazz",           duration: "5:33", color1: "#3e2723", color2: "#795548" },
    { id: 29, title: "Velvet Keys",          artist: "Ivory",           genre: "jazz",           duration: "4:28", color1: "#1a1a2e", color2: "#544179" },
    { id: 30, title: "Harlem Sunrise",       artist: "Miles Apart",     genre: "jazz",           duration: "5:55", color1: "#2c1810", color2: "#a0522d" },
];

var GENRE_DISPLAY = {
    lo_fi_ambient: "Lo-Fi & Ambient",
    pop: "Pop",
    rock: "Rock",
    hip_hop: "Hip-Hop",
    electronic: "Electronic",
    jazz: "Jazz"
};

var GENRE_EMOJI = {
    lo_fi_ambient: "🌙",
    pop: "⭐",
    rock: "🤘",
    hip_hop: "🎤",
    electronic: "⚡",
    jazz: "🎷"
};

var ARTISTS = [
    { name: "Cloudset", genre: "lo_fi_ambient" },
    { name: "Sleepy Waves", genre: "lo_fi_ambient" },
    { name: "Driftwood", genre: "lo_fi_ambient" },
    { name: "Yume", genre: "lo_fi_ambient" },
    { name: "Terrain", genre: "lo_fi_ambient" },
    { name: "Rooftop Sessions", genre: "lo_fi_ambient" },
    { name: "Nujabes", genre: "lo_fi_ambient" },
    { name: "Tycho", genre: "lo_fi_ambient" },
    { name: "Aria Cole", genre: "pop" },
    { name: "Luna Park", genre: "pop" },
    { name: "The Echoes", genre: "pop" },
    { name: "Prism", genre: "pop" },
    { name: "Dua Lipa", genre: "pop" },
    { name: "Billie Eilish", genre: "pop" },
    { name: "Harry Styles", genre: "pop" },
    { name: "Olivia Rodrigo", genre: "pop" },
    { name: "Iron Coast", genre: "rock" },
    { name: "Voltage", genre: "rock" },
    { name: "The Wrecks", genre: "rock" },
    { name: "Arctic Monkeys", genre: "rock" },
    { name: "Foo Fighters", genre: "rock" },
    { name: "The Strokes", genre: "rock" },
    { name: "Tame Impala", genre: "rock" },
    { name: "Radiohead", genre: "rock" },
    { name: "K.Nova", genre: "hip_hop" },
    { name: "DOT.", genre: "hip_hop" },
    { name: "SoundWave", genre: "hip_hop" },
    { name: "Kendrick Lamar", genre: "hip_hop" },
    { name: "Tyler, The Creator", genre: "hip_hop" },
    { name: "J. Cole", genre: "hip_hop" },
    { name: "Mac Miller", genre: "hip_hop" },
    { name: "Anderson .Paak", genre: "hip_hop" },
    { name: "Synthwave Dreams", genre: "electronic" },
    { name: "Neon Grid", genre: "electronic" },
    { name: "CTRL+Z", genre: "electronic" },
    { name: "Photon", genre: "electronic" },
    { name: "Bonobo", genre: "electronic" },
    { name: "ODESZA", genre: "electronic" },
    { name: "Flume", genre: "electronic" },
    { name: "Rufus Du Sol", genre: "electronic" },
    { name: "Miles Apart", genre: "jazz" },
    { name: "The Quintet", genre: "jazz" },
    { name: "Ivory", genre: "jazz" },
    { name: "Kamasi Washington", genre: "jazz" },
    { name: "Robert Glasper", genre: "jazz" },
    { name: "Snarky Puppy", genre: "jazz" },
    { name: "Norah Jones", genre: "jazz" },
    { name: "Chet Baker", genre: "jazz" },
];

var GENRE_ORDER = ["lo_fi_ambient", "pop", "rock", "hip_hop", "electronic", "jazz"];

// ── Navigation ──

var screenHistory = [];

function navigateTo(screenId, skipAbandonCheck) {
    var onboardingScreens = ["screen-onboarding-1", "screen-onboarding-2", "screen-onboarding-3"];
    var current = document.querySelector(".screen.active");
    if (!skipAbandonCheck && current && onboardingScreens.indexOf(current.id) !== -1 && onboardingScreens.indexOf(screenId) === -1) {
        if (current.id !== "screen-onboarding-3") {
            var lastCompleted = window.mixtapeState.lastCompletedOnboardingStep || null;
            trackTasteProfileAbandoned(lastCompleted);
        }
    }

    if (current) {
        screenHistory.push(current.id);
        current.classList.remove("active");
    }
    document.getElementById(screenId).classList.add("active");
    window.mixtapeState.currentScreen = screenId.replace("screen-", "");
    window.scrollTo(0, 0);
    trackPageViewed(screenId.replace("screen-", ""));
}

function navigateBack() {
    if (screenHistory.length === 0) return;
    var current = document.querySelector(".screen.active");
    if (current) current.classList.remove("active");
    var prevId = screenHistory.pop();
    document.getElementById(prevId).classList.add("active");
    window.mixtapeState.currentScreen = prevId.replace("screen-", "");
}

// ── Track Card Rendering ──

function createTrackCard(track) {
    var card = document.createElement("div");
    card.className = "track-card";
    card.setAttribute("data-track-id", track.id);

    card.innerHTML =
        '<div class="track-card-art" style="background:linear-gradient(135deg,' + track.color1 + ',' + track.color2 + ')">' +
            '<div class="play-overlay">&#9654;</div>' +
        '</div>' +
        '<div class="track-card-info">' +
            '<div class="track-card-title">' + track.title + '</div>' +
            '<div class="track-card-artist">' + track.artist + '</div>' +
            '<div class="track-card-meta">' +
                '<span class="track-card-duration">' + track.duration + '</span>' +
                '<button class="track-save-btn" data-save-track-id="' + track.id + '">&#9825;</button>' +
            '</div>' +
        '</div>';

    card.addEventListener("click", function (e) {
        if (e.target.closest(".track-save-btn")) return;
        playTrack(track);
    });

    var saveBtn = card.querySelector(".track-save-btn");
    saveBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        this.classList.toggle("saved");
        this.innerHTML = this.classList.contains("saved") ? "&#9829;" : "&#9825;";
        trackTrackSaved(track);
    });

    return card;
}

// ── Browse Screen ──

function renderBrowseScreen() {
    var pillsContainer = document.getElementById("genrePills");
    var sectionsContainer = document.getElementById("browseGenreSections");
    pillsContainer.innerHTML = "";
    sectionsContainer.innerHTML = "";

    GENRE_ORDER.forEach(function (genre) {
        var pill = document.createElement("button");
        pill.className = "genre-pill";
        pill.textContent = GENRE_DISPLAY[genre];
        pill.addEventListener("click", function () {
            showGenreView(genre);
        });
        pillsContainer.appendChild(pill);
    });

    GENRE_ORDER.forEach(function (genre) {
        var genreTracks = TRACKS.filter(function (t) { return t.genre === genre; });
        var section = document.createElement("div");
        section.className = "genre-section";
        section.innerHTML = '<h3 class="genre-section-title">' + GENRE_DISPLAY[genre] + '</h3>';
        var row = document.createElement("div");
        row.className = "track-row";
        genreTracks.forEach(function (track) {
            row.appendChild(createTrackCard(track));
        });
        section.appendChild(row);
        sectionsContainer.appendChild(section);
    });
}

// ── Genres Page ──

var GENRE_GRADIENTS = {
    lo_fi_ambient: "linear-gradient(135deg, #1a1a2e, #4a3f8a)",
    pop: "linear-gradient(135deg, #ff006e, #ff7eb3)",
    rock: "linear-gradient(135deg, #1a1a1a, #8b0000)",
    hip_hop: "linear-gradient(135deg, #2d132c, #801336)",
    electronic: "linear-gradient(135deg, #0f0c29, #302b63)",
    jazz: "linear-gradient(135deg, #1b2838, #2c5f7c)"
};

function renderGenresPage() {
    var grid = document.getElementById("genresCardGrid");
    grid.innerHTML = "";

    GENRE_ORDER.forEach(function (genre) {
        var count = TRACKS.filter(function (t) { return t.genre === genre; }).length;
        var card = document.createElement("div");
        card.className = "genre-card-large";
        card.style.background = GENRE_GRADIENTS[genre];
        card.innerHTML =
            '<span class="genre-card-emoji">' + GENRE_EMOJI[genre] + '</span>' +
            '<span class="genre-card-name">' + GENRE_DISPLAY[genre] + '</span>' +
            '<span class="genre-card-count">' + count + ' tracks</span>';
        card.addEventListener("click", function () {
            showGenreView(genre);
        });
        grid.appendChild(card);
    });
}

// ── Genre View ──

function showGenreView(genre) {
    document.getElementById("genreViewTitle").textContent = GENRE_DISPLAY[genre];
    var genreTracks = TRACKS.filter(function (t) { return t.genre === genre; });
    document.getElementById("genreTrackCount").textContent = genreTracks.length + " tracks";
    var grid = document.getElementById("genreGrid");
    grid.innerHTML = "";
    genreTracks.forEach(function (track) {
        grid.appendChild(createTrackCard(track));
    });
    navigateTo("screen-genre");
}

// ── Player Bar ──

var playerBarEl = document.getElementById("playerBar");
var playerTrackTitleEl = document.getElementById("playerTrackTitle");
var playerTrackArtistEl = document.getElementById("playerTrackArtist");
var playerDurationEl = document.getElementById("playerDuration");
var playerProgressFill = document.getElementById("playerProgressFill");
var playerPlayBtn = document.getElementById("playerPlayBtn");
var playerSaveBtn = document.getElementById("playerSaveBtn");
var bugModePlaybackStart = null;

var playbackElapsed = 0;
var playbackDuration = 0;

function playTrack(track) {
    if (window.mixtapeState.playbackTimer) {
        clearInterval(window.mixtapeState.playbackTimer);
        window.mixtapeState.playbackTimer = null;
    }

    window.mixtapeState.currentTrack = track;
    window.mixtapeState.isPlaying = true;
    playerTrackTitleEl.textContent = track.title;
    playerTrackArtistEl.textContent = track.artist;
    playerDurationEl.textContent = track.duration;
    playerProgressFill.style.width = "0%";
    playerBarEl.classList.add("visible");
    playerBarEl.classList.remove("error-state", "loading");
    playerPlayBtn.innerHTML = "&#9646;&#9646;";

    playerSaveBtn.classList.remove("saved");
    playerSaveBtn.innerHTML = "&#9825;";

    playbackElapsed = 0;

    if (window.mixtapeState.bugMode) {
        playerBarEl.classList.add("loading");
        bugModePlaybackStart = Date.now();

        window.mixtapeState.sessionTrackCount++;

        setTimeout(function () {
            playerBarEl.classList.remove("loading");
            playerBarEl.classList.add("error-state");
            trackPlaybackError();
            window.mixtapeState.isPlaying = false;

            checkTrackLimit();
        }, 3000);
    } else {
        trackTrackPlayed(track);

        playbackDuration = 8000 + Math.random() * 2000;
        startPlaybackTimer(track);
    }
}

function startPlaybackTimer(track) {
    var startTime = Date.now() - playbackElapsed;

    window.mixtapeState.playbackTimer = setInterval(function () {
        playbackElapsed = Date.now() - startTime;
        var pct = Math.min((playbackElapsed / playbackDuration) * 100, 100);
        playerProgressFill.style.width = pct + "%";

        if (pct >= 100) {
            clearInterval(window.mixtapeState.playbackTimer);
            window.mixtapeState.playbackTimer = null;
            window.mixtapeState.isPlaying = false;
            playerPlayBtn.innerHTML = "&#9654;";
            var listenDepth = 75 + Math.random() * 25;
            trackTrackCompleted(track, Math.round(listenDepth));

            checkTrackLimit();
        }
    }, 100);
}

function checkTrackLimit() {
    if (window.mixtapeState.sessionTrackCount >= window.mixtapeState.trackLimit) {
        trackListenLimitReached();
        showPaywall("listen_limit");
    }
}

playerPlayBtn.addEventListener("click", function () {
    if (window.mixtapeState.bugMode && playerBarEl.classList.contains("error-state")) {
        trackRageClick();
        return;
    }

    if (!window.mixtapeState.currentTrack) return;

    if (window.mixtapeState.isPlaying) {
        window.mixtapeState.isPlaying = false;
        playerPlayBtn.innerHTML = "&#9654;";
        if (window.mixtapeState.playbackTimer) {
            clearInterval(window.mixtapeState.playbackTimer);
            window.mixtapeState.playbackTimer = null;
        }
        trackPlaybackPaused(window.mixtapeState.currentTrack);
    } else {
        trackPlaybackResumed(window.mixtapeState.currentTrack);
        window.mixtapeState.isPlaying = true;
        playerPlayBtn.innerHTML = "&#9646;&#9646;";
        startPlaybackTimer(window.mixtapeState.currentTrack);
    }
});

playerSaveBtn.addEventListener("click", function () {
    if (!window.mixtapeState.currentTrack) return;
    this.classList.toggle("saved");
    this.innerHTML = this.classList.contains("saved") ? "&#9829;" : "&#9825;";
    trackTrackSaved(window.mixtapeState.currentTrack);
});

// Player Exited tracking for bug mode
function trackPlayerExitIfBugMode() {
    if (window.mixtapeState.bugMode && bugModePlaybackStart) {
        var seconds = Math.round((Date.now() - bugModePlaybackStart) / 1000);
        trackPlayerExited(seconds);
        bugModePlaybackStart = null;
    }
}

// ── Paywall Modal ──

var paywallModal = document.getElementById("paywallModal");
var paywallCard = document.getElementById("paywallCard");
var paywallTrigger = "listen_limit";

function showPaywall(triggerReason) {
    paywallTrigger = triggerReason;
    var v = window.mixtapeState.experimentVariant;
    paywallCard.classList.remove("paywall-subscribing", "paywall-subscribed");

    var authSection = document.getElementById("paywallAuth");
    authSection.style.display = window.mixtapeState.isAnonymous ? "block" : "none";
    document.getElementById("paywallName").value = "";
    document.getElementById("paywallEmail").value = "";

    document.getElementById("paywallSocialProof").style.display = "none";
    document.getElementById("paywallTestimonial").style.display = "none";
    document.getElementById("paywallProgressIndicator").style.display = "none";

    if (v === "a" || v === "b") {
        var sp = document.getElementById("paywallSocialProof");
        sp.textContent = "Join 4 million listeners who went ad-free this year";
        sp.style.display = "block";
    }

    if (v === "b") {
        var test = document.getElementById("paywallTestimonial");
        test.innerHTML = '"I switched to annual and haven\'t looked back. The offline mode alone is worth it." &mdash; Maya, listener since 2023';
        test.style.display = "block";

        var prog = document.getElementById("paywallProgressIndicator");
        var remaining = Math.max(0, window.mixtapeState.trackLimit - window.mixtapeState.sessionTrackCount + 1);
        prog.innerHTML =
            '<div class="paywall-progress-text">You\'re ' + remaining + ' track' + (remaining !== 1 ? 's' : '') + ' away from your limit</div>' +
            '<div class="paywall-progress-bar-outer"><div class="paywall-progress-bar-inner" style="width:' + Math.min(100, (window.mixtapeState.sessionTrackCount / window.mixtapeState.trackLimit) * 100) + '%"></div></div>';
        prog.style.display = "block";
    }

    var variantLabels = { c: "Control", a: "Variant A", b: "Variant B" };
    document.getElementById("paywallVariantLabel").textContent = variantLabels[v] || v;

    paywallModal.classList.add("show");
    trackPaywallViewed(triggerReason);
}

document.getElementById("paywallClose").addEventListener("click", function () {
    paywallModal.classList.remove("show");
    trackPaywallDismissed();
    window.mixtapeState.signupTrigger = "paywall_cta";
});

paywallModal.addEventListener("click", function (e) {
    if (e.target === paywallModal) {
        paywallModal.classList.remove("show");
        trackPaywallDismissed();
        window.mixtapeState.signupTrigger = "paywall_cta";
    }
});

function handleSubscribe(plan) {
    if (window.mixtapeState.isAnonymous) {
        var name = document.getElementById("paywallName").value.trim();
        var email = document.getElementById("paywallEmail").value.trim();
        if (!name || !email) {
            document.getElementById("paywallEmail").style.borderColor = !email ? "var(--error)" : "";
            document.getElementById("paywallName").style.borderColor = !name ? "var(--error)" : "";
            return;
        }
        trackSignUpStarted("paywall_cta");
        mixpanel.identify(email);
        mixpanel.people.set({ $name: name, $email: email });
        trackAccountCreated("paywall_cta");
        window.mixtapeState.isAnonymous = false;
        window.mixtapeState.userEmail = email;
        window.mixtapeState.trackLimit = 8;
    }

    paywallCard.classList.add("paywall-subscribing");

    setTimeout(function () {
        paywallCard.classList.remove("paywall-subscribing");
        paywallCard.classList.add("paywall-subscribed");
        trackSubscriptionStarted(plan, paywallTrigger === "listen_limit" ? "paywall_cta" : "organic");

        window.mixtapeState.isSubscriber = true;
        window.mixtapeState.trackLimit = Infinity;
        window.mixtapeState.subscriptionPlan = plan;
        updateHeaderForAuth();

        setTimeout(function () {
            paywallModal.classList.remove("show");
        }, 1000);
    }, 1500);
}

document.getElementById("btnSubscribeMonthly").addEventListener("click", function () { handleSubscribe("monthly"); });
document.getElementById("btnSubscribeAnnual").addEventListener("click", function () { handleSubscribe("annual"); });

// ── Header ──

function updateHeaderForAuth() {
    var headerRight = document.getElementById("headerRight");
    var headerNav = document.getElementById("headerNav");

    if (window.mixtapeState.isAnonymous) return;

    headerNav.innerHTML =
        '<a href="#" class="nav-link active" data-nav="feed">Home</a>' +
        '<a href="#" class="nav-link" data-nav="browse">Browse</a>';

    headerNav.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            var target = this.getAttribute("data-nav");
            trackPlayerExitIfBugMode();
            headerNav.querySelectorAll(".nav-link").forEach(function (l) { l.classList.remove("active"); });
            this.classList.add("active");
            if (target === "feed") navigateTo("screen-feed");
            else if (target === "browse") navigateTo("screen-browse");
        });
    });

    var email = window.mixtapeState.userEmail || "";
    headerRight.innerHTML =
        '<div class="header-user-menu">' +
            '<button class="header-user-btn" id="userMenuBtn">' + email + ' &#9662;</button>' +
            '<div class="header-dropdown" id="userDropdown">' +
                '<button class="dropdown-item" id="dropdownLibrary">My Library</button>' +
                '<button class="dropdown-item" id="dropdownSubscription">Manage Subscription' +
                    (window.mixtapeState.isSubscriber ? '<div class="dropdown-sub">' + (window.mixtapeState.subscriptionPlan || "monthly") + ' plan</div>' : '') +
                '</button>' +
                (window.mixtapeState.isSubscriber ? '<button class="dropdown-item" id="dropdownCancelSub" style="color:var(--error)">Cancel Subscription</button>' : '') +
                '<div class="dropdown-divider"></div>' +
                '<button class="dropdown-item" id="dropdownLogout">Log Out</button>' +
            '</div>' +
        '</div>';

    document.getElementById("userMenuBtn").addEventListener("click", function (e) {
        e.stopPropagation();
        document.getElementById("userDropdown").classList.toggle("show");
    });

    if (!window._dropdownListenerAdded) {
        window._dropdownListenerAdded = true;
        document.addEventListener("click", function () {
            var dd = document.getElementById("userDropdown");
            if (dd) dd.classList.remove("show");
        });
    }

    document.getElementById("dropdownLogout").addEventListener("click", function () {
        if (typeof window.RESET === "function") window.RESET();
    });

    var cancelBtn = document.getElementById("dropdownCancelSub");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            trackSubscriptionCancelled();
            window.mixtapeState.isSubscriber = false;
            window.mixtapeState.subscriptionPlan = null;
            window.mixtapeState.trackLimit = 8;
            updateHeaderForAuth();
            showToast("Subscription cancelled");
        });
    }
}

// ── Login ──

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("loginEmail").value.trim();
    if (!email) return;

    mixpanel.identify(email);
    mixpanel.people.set({ $email: email });
    window.mixtapeState.isAnonymous = false;
    window.mixtapeState.userEmail = email;
    window.mixtapeState.trackLimit = 8;
    updateHeaderForAuth();
    renderFeedScreen();
    navigateTo("screen-feed");
});

document.getElementById("loginToSignup").addEventListener("click", function (e) {
    e.preventDefault();
    navigateTo("screen-signup");
});

// ── Sign Up ──

document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("signupName").value.trim();
    var email = document.getElementById("signupEmail").value.trim();
    if (!name || !email) return;

    var trigger = window.mixtapeState.signupTrigger;
    trackSignUpStarted(trigger);
    mixpanel.identify(email);
    mixpanel.people.set({ $name: name, $email: email });
    trackAccountCreated(trigger);
    window.mixtapeState.isAnonymous = false;
    window.mixtapeState.userEmail = email;
    window.mixtapeState.trackLimit = 8;
    updateHeaderForAuth();
    navigateTo("screen-onboarding-1");
    trackTasteProfileStarted();
    renderOnboardingStep1();
});

document.getElementById("signupToLogin").addEventListener("click", function (e) {
    e.preventDefault();
    navigateTo("screen-login");
});

// ── Header Buttons ──

document.getElementById("btnLogin").addEventListener("click", function () {
    trackPlayerExitIfBugMode();
    navigateTo("screen-login");
});

document.getElementById("btnSignup").addEventListener("click", function () {
    trackPlayerExitIfBugMode();
    navigateTo("screen-signup");
});

// Header nav links for anonymous state
document.getElementById("headerNav").querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        var target = this.getAttribute("data-nav");
        trackPlayerExitIfBugMode();
        document.getElementById("headerNav").querySelectorAll(".nav-link").forEach(function (l) { l.classList.remove("active"); });
        this.classList.add("active");
        if (target === "browse") navigateTo("screen-browse");
        else if (target === "genres") { renderGenresPage(); navigateTo("screen-genres"); }
    });
});

// ── Genre View Back Button ──

document.getElementById("genreBackBtn").addEventListener("click", function () {
    navigateBack();
});

// ── Hero Play Button ──

document.getElementById("heroPlayBtn").addEventListener("click", function () {
    playTrack(TRACKS[0]);
});

// ── Onboarding Step 1 ──

function renderOnboardingStep1() {
    var grid = document.getElementById("genreSelectGrid");
    grid.innerHTML = "";
    window.mixtapeState.selectedGenres = [];

    GENRE_ORDER.forEach(function (genre) {
        var card = document.createElement("div");
        card.className = "genre-select-card";
        card.setAttribute("data-genre", genre);
        card.innerHTML =
            '<span class="genre-emoji">' + GENRE_EMOJI[genre] + '</span>' +
            '<span class="genre-name">' + GENRE_DISPLAY[genre] + '</span>' +
            '<span class="genre-check">&#10003;</span>';

        card.addEventListener("click", function () {
            this.classList.toggle("selected");
            var sel = window.mixtapeState.selectedGenres;
            var idx = sel.indexOf(genre);
            if (idx === -1) sel.push(genre);
            else sel.splice(idx, 1);
            document.getElementById("onboarding1Continue").disabled = sel.length === 0;
        });
        grid.appendChild(card);
    });
}

document.getElementById("onboarding1Continue").addEventListener("click", function () {
    if (window.mixtapeState.selectedGenres.length === 0) return;
    window.mixtapeState.lastCompletedOnboardingStep = "genre_selection";
    trackOnboardingStepCompleted("genre_selection");
    navigateTo("screen-onboarding-2");
    renderOnboardingStep2();
});

document.getElementById("onboarding1Skip").addEventListener("click", function (e) {
    e.preventDefault();
    trackTasteProfileAbandoned(null);
    renderFeedScreen();
    navigateTo("screen-feed", true);
});

// ── Onboarding Step 2 ──

function renderOnboardingStep2() {
    window.mixtapeState.selectedArtists = [];
    renderArtistChips();
    renderArtistList("");
    document.getElementById("artistSearchInput").value = "";
}

function renderArtistChips() {
    var container = document.getElementById("selectedArtistsChips");
    container.innerHTML = "";
    window.mixtapeState.selectedArtists.forEach(function (name) {
        var chip = document.createElement("span");
        chip.className = "artist-chip";
        chip.innerHTML = name + ' <span class="artist-chip-remove" data-artist="' + name + '">&times;</span>';
        container.appendChild(chip);
    });

    container.querySelectorAll(".artist-chip-remove").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var artist = this.getAttribute("data-artist");
            var idx = window.mixtapeState.selectedArtists.indexOf(artist);
            if (idx !== -1) window.mixtapeState.selectedArtists.splice(idx, 1);
            renderArtistChips();
            renderArtistList(document.getElementById("artistSearchInput").value);
        });
    });
}

function renderArtistList(query) {
    var container = document.getElementById("artistList");
    container.innerHTML = "";
    var q = query.toLowerCase().trim();
    var selectedGenres = window.mixtapeState.selectedGenres;

    var filtered = ARTISTS.filter(function (a) {
        if (q) return a.name.toLowerCase().indexOf(q) !== -1;
        if (selectedGenres.length > 0) return selectedGenres.indexOf(a.genre) !== -1;
        return true;
    });

    filtered.forEach(function (artist) {
        var item = document.createElement("div");
        item.className = "artist-item";
        if (window.mixtapeState.selectedArtists.indexOf(artist.name) !== -1) {
            item.classList.add("selected");
        }
        item.innerHTML =
            '<div><div class="artist-item-name">' + artist.name + '</div>' +
            '<div class="artist-item-genre">' + GENRE_DISPLAY[artist.genre] + '</div></div>' +
            '<span class="artist-item-check">&#10003;</span>';

        item.addEventListener("click", function () {
            var idx = window.mixtapeState.selectedArtists.indexOf(artist.name);
            if (idx === -1) {
                window.mixtapeState.selectedArtists.push(artist.name);
            } else {
                window.mixtapeState.selectedArtists.splice(idx, 1);
            }
            renderArtistChips();
            renderArtistList(document.getElementById("artistSearchInput").value);
        });

        container.appendChild(item);
    });
}

document.getElementById("artistSearchInput").addEventListener("input", function () {
    renderArtistList(this.value);
});

document.getElementById("onboarding2Continue").addEventListener("click", function () {
    trackOnboardingStepCompleted("artist_preferences", window.mixtapeState.selectedArtists.length);
    navigateTo("screen-onboarding-3");
    renderOnboardingStep3();
});

document.getElementById("onboarding2Back").addEventListener("click", function (e) {
    e.preventDefault();
    navigateBack();
});

document.getElementById("onboarding2Skip").addEventListener("click", function (e) {
    e.preventDefault();
    trackTasteProfileAbandoned("genre_selection");
    renderFeedScreen();
    navigateTo("screen-feed", true);
});

// ── Onboarding Step 3 ──

function renderOnboardingStep3() {
    var summary = document.getElementById("profileSummary");
    var genres = window.mixtapeState.selectedGenres.map(function (g) { return GENRE_DISPLAY[g]; }).join(", ") || "None selected";
    var artists = window.mixtapeState.selectedArtists.join(", ") || "None selected";
    summary.innerHTML =
        '<div class="summary-section"><div class="summary-label">Selected Genres</div><div class="summary-value">' + genres + '</div></div>' +
        '<div class="summary-section"><div class="summary-label">Favorite Artists</div><div class="summary-value">' + artists + '</div></div>';

    trackOnboardingStepCompleted("profile_complete");
    trackTasteProfileCompleted();
}

document.getElementById("startListeningBtn").addEventListener("click", function () {
    mixpanel.people.set({
        favorite_genres: window.mixtapeState.selectedGenres.map(function (g) { return GENRE_DISPLAY[g]; }),
        favorite_artists: window.mixtapeState.selectedArtists,
        onboarding_completed: true
    });
    trackFirstPersonalizedFeedLoaded();
    renderFeedScreen();
    navigateTo("screen-feed");
});

// ── Feed Screen ──

function renderFeedScreen() {
    var container = document.getElementById("feedContent");
    container.innerHTML = "";

    var selectedGenres = window.mixtapeState.selectedGenres;

    var dailyMix = [];
    if (selectedGenres.length > 0) {
        dailyMix = TRACKS.filter(function (t) { return selectedGenres.indexOf(t.genre) !== -1; }).slice(0, 6);
    } else {
        dailyMix = TRACKS.slice(0, 6);
    }

    var recommended = TRACKS.slice(6, 12);
    var newReleases = TRACKS.slice(12, 18);

    function makeSection(title, tracks) {
        var sec = document.createElement("div");
        sec.className = "feed-section";
        sec.innerHTML = '<h3 class="feed-section-title">' + title + '</h3>';
        var row = document.createElement("div");
        row.className = "track-row";
        tracks.forEach(function (t) { row.appendChild(createTrackCard(t)); });
        sec.appendChild(row);
        return sec;
    }

    container.appendChild(makeSection("Your Daily Mix", dailyMix));
    container.appendChild(makeSection("Recommended for You", recommended));
    container.appendChild(makeSection("New Releases", newReleases));

    if (!window.mixtapeState.isAnonymous) {
        var playlistBtn = document.createElement("button");
        playlistBtn.className = "feed-new-playlist";
        playlistBtn.textContent = "+ New Playlist";
        playlistBtn.addEventListener("click", function () {
            trackPlaylistCreated();
            showToast("Playlist created!");
        });
        container.appendChild(playlistBtn);
    }
}

// ── Toast ──

function showToast(msg) {
    var toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 2500);
}

// ── Reset Button ──

document.getElementById("btnReset").addEventListener("click", function () {
    if (typeof window.RESET === "function") window.RESET();
});

document.getElementById("btnMixpanelProject").addEventListener("click", function () {
    var distinctId = "";
    try {
        distinctId = mixpanel.get_distinct_id();
    } catch (e) {}
    if (distinctId) {
        this.href = "https://mixpanel.com/project/4021104/view/4517235/app/profile#distinct_id=" + encodeURIComponent(distinctId);
    }
});

// ── Landing Page ──

function enterApp() {
    document.getElementById("appHeader").classList.remove("hidden");
    renderBrowseScreen();
    navigateTo("screen-browse");
}

document.getElementById("headerLogoLink").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("appHeader").classList.add("hidden");
    navigateTo("screen-landing");
});

document.getElementById("landingCta").addEventListener("click", function () {
    enterApp();
});

document.getElementById("landingCtaBottom").addEventListener("click", function () {
    enterApp();
});

// ── Init ──

function init() {
    renderBrowseScreen();
    trackPageViewed("landing");

    if (preIdentifyUser) {
        window.mixtapeState.isAnonymous = false;
        window.mixtapeState.userEmail = preIdentifyUser;
        window.mixtapeState.trackLimit = 8;
        document.getElementById("appHeader").classList.remove("hidden");
        updateHeaderForAuth();
        renderFeedScreen();
        navigateTo("screen-feed");
    }
}

if (typeof window.onMixpanelReady === "undefined") {
    window.onMixpanelReady = function () {};
}

init();
