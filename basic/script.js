$(function () {
  refresh();
  $('#game-input').on('input', refresh);
  $('#position').on('input', function () {
    drawBoard(Snap('#main-svg'), $('#position').val());
    ai.update($('#position').val());
    ai.makeMove(function(resp){
        if(resp.over){
            console.log("Game is over.");
            return
        }
        console.log(resp.response.move);
    });
  });
});

function refresh() {
  getStart($('#game-input').val(), function (start) {
    $('#position').val(start);
    drawBoard(Snap('#main-svg'), start);
    ai = new ComputerPlayer('PerfectAi', $('#game-input').val() ,$('#position').val());
    ai.makeMove(function(resp){
        console.log(resp.response.move);
    });
  });
}

function getStart(game, callback) {
    var server_orig = 'http://nyc.cs.berkley.edu:8081/' + game + '/getStart';
    var server_new = 'http://0.0.0.0:8081/' + game + '/getStart';
  $.get(server_new, function (res) {
    var res = JSON.parse(res);
    callback(res.response);
  });
}

function drawBoard (svg, boardString) {
  console.log('drawing', boardString);
}
