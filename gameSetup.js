var gameVal = getURLVars()["game"];
var games = Session.get("games");
var game = games[gameVal];

function getURLVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
		function(m,key,value) {
			vars[key] = value;
		});
	return vars;
}
