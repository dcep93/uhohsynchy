// https://console.firebase.google.com/u/0/project/moviedatesync/database/moviedatesync/data

const VERSION = "v4.0.0";

var PREFIX = "data";
var FREQUENCY = 1000;

var db;
var listenerRef;
var reportInverval;

function getDb() {
	if (db === undefined) {
		var config = {
			databaseURL: "https://moviedatesync.firebaseio.com",
		};
		firebase.initializeApp(config);
		db = firebase.database();
	}
	return db;
}

function beginReporting() {
	if (reportInverval !== undefined) return;
	getDb();
	reportState();
	reportInverval = setInterval(reportState, FREQUENCY);
}

function setDateOffset() {
	var path = ".info/serverTimeOffset";
	return getDb()
		.ref(path)
		.once("value")
		.then(function (data) {
			dateOffset = data.val();
		});
}

function getState() {
	var rawId = `${window.location.host || "local"}`;
	var id = rawId.replace(/\./g, "_");
	var speed = element.playbackRate;
	var time = element.currentTime;
	var paused = element.paused;
	var duration = element.duration;
	var date = getCurrentTime();
	var url = window.location.href;
	return {
		id,
		email,
		speed,
		time,
		paused,
		duration,
		date,
		dateOffset,
		url,
		syncingStatus,
		version: VERSION,
	};
}

function reportState() {
	var args = getState();
	if (isNaN(args.duration)) return console.log(args);
	postToFirebase(args);
}

function postToFirebase(args) {
	var emailKey = args.email.replace(/\./g, "_");
	var firebaseId = [PREFIX, args.id].join("/");
	var path = [firebaseId, emailKey].join("/");
	db.ref(path).set(args).catch(alert);

	listen(firebaseId);
}

function listen(firebaseId) {
	if (listenerRef !== undefined) {
		if (listenerRef.path.pieces_.join("/") == firebaseId) return;
		listenerRef.off();
	}
	listenerRef = db.ref(firebaseId);
	listenerRef.on("value", function (snapshot) {
		peers = snapshot.val();
	});
}
