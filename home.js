//Add game to front page
function fillHomePage(gameName) {
	$(".wrapper").append("<div class='row'>" +
		"<div class='three columns mobile-two'>" +
		"<img src='"+gamesList[gameName].image+"'/></div>" +
		"<div class='nine columns mobile-two'><p><h5><a class='nostyle' href='startGame.html?game="+gameName+"'>"+gamesList[gameName].title+"</a></h5>" + 
		gamesList[gameName].description+"</p></div></div>");
}