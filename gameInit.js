function Game() {
}


var gamesList = {};

$(document).ready(function() {
	$.get('xml/games/games.xml',function(data) { 
		$(data).find('game').each(function() {
			var $game = $(this);
			var title = $game.find('title').text(),
				description = $game.find('description').text(),
				asset = $game.find('asset').text();
			
			gamesList[asset] = [title, description];
			console.log(gameList);
		});
	});
});