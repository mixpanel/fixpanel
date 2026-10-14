/**
 * Lodgely Stays - Mixpanel Integration
 * Vacation rental marketplace demo: session replay, heatmaps, and console capture
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

    // Error tracking: console output is captured in session replay
    record_console: true,

    // Session replay
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

        // Console branding
        console.log(
            "%c\n" +
            "=======================================================\n" +
            "   Lodgely Stays\n" +
            "   Mixpanel Demo\n" +
            "=======================================================",
            "color: #F43F5E; font-weight: bold; font-size: 12px;"
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
    },
});

/**
 * Setup global RESET function
 */
function setupResetFunction(mp) {
    window.RESET = function () {
        console.log("[LODGELY] Initiating reset...");

        var overlay = document.createElement("div");
        overlay.style.cssText =
            "position:fixed;inset:0;background:#000;opacity:0;z-index:9999;transition:opacity 0.5s ease;pointer-events:none;";
        document.body.appendChild(overlay);

        requestAnimationFrame(function () {
            overlay.style.opacity = "1";
        });

        setTimeout(function () {
            console.log("[LODGELY] Stopping session recording...");
            mp.stop_session_recording();

            setTimeout(function () {
                console.log("[LODGELY] Resetting user...");
                mp.reset();
                window.location.assign(window.location.href.split("?")[0]);
            }, 300);
        }, 500);
    };

    window.sessionStartTime = Date.now();
}

/**
 * Track custom events with standard properties
 */
function trackEvent(eventName, properties) {
    properties = properties || {};
    mixpanel.track(eventName, properties);
}

// ============================================================
// CUSTOM EVENT TRACKING HELPERS
// Add demo-specific tracking functions below.
// These are called from script.js.
// ============================================================

function trackSearchPerformed(city, checkIn, checkOut, guests, resultCount) {
    trackEvent("search_performed", {
        city: city || "Anywhere",
        check_in: checkIn,
        check_out: checkOut,
        guests: guests,
        result_count: resultCount
    });
    if (city) {
        mixpanel.people.set({ last_searched_city: city, typical_party_size: guests });
    }
}

function trackListingViewed(listing, source) {
    trackEvent("listing_viewed", {
        listing_id: listing.id,
        city: listing.city,
        nightly_price: listing.price,
        category: listing.categories[0],
        source: source
    });
}

function trackPhotoGalleryOpened(listing, photoCount, startPhoto) {
    trackEvent("photo_gallery_opened", {
        listing_id: listing.id,
        city: listing.city,
        photo_count: photoCount,
        start_photo: startPhoto
    });
}

function trackListingSaved(listing, source, wishlistSize) {
    trackEvent("listing_saved", {
        listing_id: listing.id,
        city: listing.city,
        nightly_price: listing.price,
        source: source,
        wishlist_size: wishlistSize
    });
    mixpanel.people.set({ wishlist_size: wishlistSize });
}

function trackDatesSelected(city, checkIn, checkOut, nights, source) {
    trackEvent("dates_selected", {
        city: city || "Anywhere",
        check_in: checkIn,
        check_out: checkOut,
        nights: nights,
        source: source
    });
}

function trackBookingStarted(listing, nights, guests, totalPrice) {
    trackEvent("booking_started", {
        listing_id: listing.id,
        city: listing.city,
        nights: nights,
        guests: guests,
        total_price: totalPrice
    });
}

/**
 * Timing event: timeToBookSeconds is measured with Date.now() from the
 * first time the guest opened this listing to the confirmed booking.
 */
function trackBookingCompleted(listing, nights, guests, totalPrice, timeToBookSeconds) {
    trackEvent("booking_completed", {
        city: listing.city,
        nights: nights,
        guests: guests,
        total_price: totalPrice,
        time_to_book_seconds: timeToBookSeconds
    });
    mixpanel.people.set({
        last_booked_city: listing.city,
        last_trip_nights: nights,
        last_booking_total: totalPrice
    });
    mixpanel.people.increment("bookings_completed", 1);
}
