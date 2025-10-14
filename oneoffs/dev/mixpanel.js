mixpanel.init(MIXPANEL_TOKEN, {
	debug: true,
	ignore_dnt: true,
	flags: {},
	persistence: "localStorage",
	loaded: function (mixpanel) {
		console.log("MIXPANEL LOADED", mixpanel);
		// debugger;
	},
});
