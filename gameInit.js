function Game(title, description, image) {
	this.title = title;
	this.description = description;
	this.image = image;
}

$(document).ready(function() {
	Session.clear();
	$.get('xml/games/games.xml',function(data) { 
		$(data).find('game').each(function() {
			var $game = $(this);
			var title = $game.find('title').text(),
				description = $game.find('description').text(),
				asset = $game.find('asset').text();
				image = $game.find('image').text();
			
			numGames++;
			gamesList[asset] = new Game(title, description, image);
			//console.log(gamesList[asset].title.toString());
			fillHomePage(asset);
		});
	});
	Session.set("games", gamesList);
});

