var gameVal = getURLVars()["game"];
var games = Session.get("games");
var game = games[gameVal];
window.configurationHash = JSON.stringify(game);
window.game.asset = gameVal;
$.getScript('games/'+gameVal+'.js');

function getURLVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
		function(m,key,value) {
			vars[key] = value;
		});
	return vars;
}
