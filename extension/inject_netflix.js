// Netflix doesn't let currentTime change in the regular way :/
// use this to allow mutation
(function () {
	// Netflix specific start
	const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
	const player = videoPlayer.getVideoPlayerBySessionId(
		videoPlayer.getAllPlayerSessionIds()[0]
	);

	function setTime(timeS) {
		var timeMS = timeS * 1000;
		player.seek(timeMS);
	}
	// Netflix specific end

	const CHECK_FREQUENCY = 10;
	const INJECTED_ELEMENT_ID = "moviedate-injected-element";

	var injectedElement = document.createElement("input");
	injectedElement.setAttribute("id", INJECTED_ELEMENT_ID);
	document.head.appendChild(injectedElement);

	function determineTime(state) {
		if (state.paused) return state.time;
		var ageMs = Date.now() - parseInt(state.date);
		var secondsAdvanced = (ageMs * parseFloat(state.speed)) / 1000;
		return parseFloat(state.time) + secondsAdvanced;
	}

	var seen = "";

	function checkForChange() {
		var value = injectedElement.value;
		if (value !== seen) {
			seen = value;
			var state = JSON.parse(value);
			var timeS = determineTime(state);
			setTime(timeS);
		}
	}

	setInterval(checkForChange, CHECK_FREQUENCY);
})();
