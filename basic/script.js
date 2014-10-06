$(function () {
  drawBoard(Snap('#main-svg'), '');
  refresh();
  //$('#game-input').val('quickchess');
  $('#game-input').on('input', refresh);
  $('#position').on('input', function () {
    drawBoard(Snap('#main-svg'), $('#position').val());
  });
});

function refresh() {
  getStart($('#game-input').val(), function (start) {
    $('#position').val(start);
    drawBoard(Snap('#main-svg'), start);
  });
}

function getStart(game, callback) {
  $.get('http://nyc.cs.berkeley.edu:8081/' + game + '/getStart', function (res) {
    var res = JSON.parse(res);
    callback(res.response);
  });
}

function drawBoard (svg, boardString) {
  $('#main-svg').html('');
  console.log('drawing', boardString);
  console.log(svg);
  for (var x = 0; x < 4; x++) {
    for (var y = 0; y < 4; y++) {
      var r = svg.rect(x * 108, y * 108, 100, 100);
      r.attr({
        'fill': 'grey'
      });
      var c = boardString[x + y * 4];
      var s;
      if (c === 'B') {
        s = svg.circle(x * 108 + 50, y * 108 + 50, 40);
        s.attr({
          'fill': 'black'
        });
      }
      if (c === 'W') {
        s = svg.circle(x * 108 + 50, y * 108 + 50, 40);
        s.attr({
          'fill': 'white'
        });
      }
      if (s) {
        s.click(function () {
          s.selected = !s.selected;
          if (s.selected) {
            this.attr({
              'r': 50,
            });
          } else {
            this.attr({
              'r': 40,
            });
          }
        });
      }
      console.log(c)
    }
  }
  //svg.attr({
    //'transform': 'scale(1.2)'
  //});
}
