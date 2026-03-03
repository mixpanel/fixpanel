/**
 * @fileoverview  analytics.js
 * ^ this file defines mixpanel initialization and tracking
 * it runs on every page load 
 * ? docs https://mixpanel.com/help/reference/javascript
 */


const PARAMS = qsToObj(window.location.search);
console.log('\nmixpanel.js params\n', PARAMS, '\n\n');
let {
	user = "",
	token = "5d6ca81b005ddbc2dbf8eeca0a058869",
	project_id = "3403883",
	workspace_id = "3908647",
	mask = ".sensitive",
	percent = 100,
	...restParams
} = PARAMS;
if (!restParams) restParams = {};

percent = Number(percent);
if (Number.isNaN(percent)) {
	percent = 100; // Default value if percent is invalid
}



/**
 * MIXPANEL SNIPPET
 */

(function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for (var d = {}, e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === f.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);

/**
 * INIT MONKEY PATCH
 */

if (mixpanel && mixpanel.init) {
	// Store a reference to the original init function
	const originalInit = mixpanel.init;

	// Monkey-patch mixpanel.init
	mixpanel.init = function (...args) {
		console.log(`init patch!`);

		if (token) {
			args[0] = token;
		}

		if (!args[1]) {
			args[1] = {};
		}

		args[1].debug = true;
		args[1].record_sessions_percent = percent;
		args[1].record_mask_text_selector = mask;
		args[1].record_inline_images = true;
		args[1].record_collect_fonts = true;
		args[1].record_console = true;
		args[1].ignore_dnt = true;
		args[1].batch_flush_interval_ms = 0;
		args[1].api_payload_format = 'json';



		args[1].loaded = function (mp) {
			const device_id = mp.get_property('$device_id');
			const user_id = mp.get_property('$user_id');
			console.log(`mixpanel ready\n\nuser_id: ${user_id || "< EMPTY >"}\ndevice_id: ${device_id}\n\n`);
			if (project_id && workspace_id) {
				const is_device = !user_id;
				const url = generateURL(user_id || device_id, { project_id, workspace_id }, is_device);
				console.log(`\n\nOpen this URL to view the session in mixpanel:\n${url}\n\n`);
			}
			if (user) {
				mp.identify(user);
				mp.people.set({ $name: user, $email: user });
			}
			if (restParams && Object.keys(restParams).length) {
				mp.register(restParams);
			}
		};
		return originalInit.apply(this, args);
	};
}



/**
 * MIXPANEL INIT
 */

mixpanel.init('5d6ca81b005ddbc2dbf8eeca0a058869');







/**
 * HELPER FUNCTIONS
 */

function loadScript(url, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	// Bind the event to the callback function.
	// There are several events for cross browser compatibility.
	script.onreadystatechange = callback;
	script.onload = callback;

	// Append the script to the head or body, doesn't really matter
	document.head.appendChild(script);
}


function qsToObj(queryString) {
	try {
		const parsedQs = new URLSearchParams(queryString);
		const params = Object.fromEntries(parsedQs);
		return params;
	}

	catch (e) {
		return {};
	}
}


function openInNewTab(user, options, is_device = true) {
	setTimeout(() => {
		const { project_id, workspace_id } = options;
		let href = `https://mixpanel.com/project/${project_id}/view/${workspace_id}/app/profile#distinct_id=`;
		if (is_device) href += `$device:`;

		Object.assign(document.createElement('a'), {
			target: '_blank',
			rel: 'noopener noreferrer',
			href: href + user,
		}).click();
	}, 3000);
}

function generateURL(user, options, is_device = true) {
	const { project_id, workspace_id } = options;
	let href = `https://mixpanel.com/project/${project_id}/view/${workspace_id}/app/profile#distinct_id=`;
	if (is_device) href += `$device:`;
	const url = href + user;
	return url;
}


function RESET() {
	console.log('resetting....\n\n');
	if (mixpanel) {
		mixpanel.reset();
	}
	window.location.reload();
}

