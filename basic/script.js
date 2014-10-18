$(function () {
  refresh();
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

var frag;

function drawBoard (svg, boardString) {
    var turn = 0;
    var text = document.createElementNS('ttp://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 20);
    text.setAttribute('y', 20);
    text.setAttribute('fill', 'black');
    text.textContent = "Hello World";
    svg.append(text);
    var color = "yellow";
  var board = svg.rect(50,20,900,900);
  var player = 0;
  board.attr({
      fill: "saddlebrown",
      stroke : "#000",
      strokeWidth: 5
  });
  var grid = [];
  for (a=0;a<4;a++) {
      grid[a] = [];
  }
  var exist = [];
  for (a=0;a<4;a++) {
      exist[a] = [];
      for (b=0; b<4; b++) {
          exist[a][b] = 0;
      }
  }
    
  var callback = function (location, ppiece) {
      var move = function() {
          var tlocation = grid[location[0]][location[1]];
          $("[id=arrow]").remove();
          svg.append(ppiece);
          exist[parseFloat(ppiece.attr("x"))][parseFloat(ppiece.attr("y"))] = 0;
          exist[location[0]][location[1]] = 1;
          ppiece.animate({cx:tlocation[0], cy:tlocation[1]}, 1000);
          ppiece.attr({"x": location[0]});
          ppiece.attr({"y": location[1]});
          callback(playgame()());
      };
      return move;
  }
  var piececallback = function (piece) {
      var innerfunc = function() {
          //test horizontal direction to right
          console.log(parseFloat(piece.attr("x")));
          var wt = parseFloat(piece.attr("x"));
          var ht = parseFloat(piece.attr("y"));
          var locations = [];
          var testx = wt;
          var counter = 0;
          while (testx + 1 < 4) {
              if (exist[testx + 1][ht] != 1) {
                  testx = testx + 1;
              } else {
                  break;
              }
          }
          if (testx != wt && testx < 4) {
              locations[counter] = [testx, ht];
              counter = counter + 1;
          }
          //test horizontal direction to left
          testx = wt;
          while (testx - 1 > -1) {
              if (exist[testx - 1][ht] != 1) {
                  testx = testx - 1;
              } else {
                  break;
              }
          }
          if (testx != wt && testx > -1) {
              locations[counter] = [testx, ht];
              counter = counter + 1;
          }
          //test vertical direction up
          var testy = ht;
          while (testy - 1 > -1) {
              if (exist[wt][testy - 1] != 1) {
                  testy = testy - 1;
              } else {
                  break;
              }
          }
          if (testy != ht && testy > -1) {
              locations[counter] = [wt, testy];
              counter = counter + 1;
          }
          //test vertical direction down
          testy = ht;
          while (testy + 1 < 4) {
              if (exist[wt][testy + 1] != 1) {
                  testy = testy + 1;
              } else {
                  break;
              }
          }
          if (testy != ht && testy < 4) {
              locations[counter] = [wt, testy];
              counter = counter + 1;
          }
          for (var i = 0; i < locations.length; i++) {
              var arrowx = grid[parseFloat(piece.attr("x"))][parseFloat(piece.attr("y"))][0] - 10;
              var arrowy = grid[parseFloat(piece.attr("x"))][parseFloat(piece.attr("y"))][1];
              var arrowl = 20;
              var arroww = 20;
              var location = locations[i];
              if (location[0] - wt == 0) {
                  arrowl = arrowl + 20;
                  if (location[1] - ht > 0) {
                      arrowy = arrowy + 20;
                  } else {
                      arrowy = arrowy - 40;
                  }
              } else {
                  arroww = arroww + 20;
                  if (location[0] - wt > 0) {
                      arrowx = arrowx + 20;
                  } else {
                      arrowx = arrowx - 40;
                  }
              }
              var arrow = svg.rect(arrowx, arrowy, arroww, arrowl);
              arrow.attr("class", "hover_group");
              arrow.attr({id: "arrow"});
              arrow.attr({fill: "green"});
              arrow.node.onclick = callback(location, piece);
          }
      };
      return innerfunc;
  }
  var playgame = function() {
      function play () {
          $("#start").remove();
          if (player == 0) {
              player = 1;
              var players = svg.selectAll("#p1");
              for (var i = 0; i < players.length; i++ ) {
                  piececallback(players[i])();
              }
              // $("[player = p1]").click();
          } else {
              player = 0;
              var players = svg.selectAll("#p2");
              for (var i = 0; i < players.length; i++ ) {
                  piececallback(players[i])();
              }
              // $("[player = p2]").click();
          }
      }
      return play;
  }
  var startbtn = svg.rect(0, 920, 100, 30).attr({fill: "white"});
  startbtn.attr({id: "start"});
  startbtn.node.onclick = playgame();
  for (k = 0; k < 4; k++) {
      for (l = 0; l < 4; l++) {
          console.log(l);
          var h = 0;
          Snap.load("Yin_yang.svg", function (f) {
              frag = f;
              // f.selectAll(":not([style='fill:#ffffff'])").attr({style: "fill:#00f"});
              var g = svg.g(f.selectAll('*'));
              var height = Math.floor(h / 4);
              var width = h % 4;
              var x = 500 * width - 100;
              var y = 500 * height - 180;
              var gridx = x * 2/5 + 230;
              var gridy = y * 2/5 + 230;
              //grid.splice()
              grid[width][height] = [gridx, gridy];
              var temp1 = x.toString();
              var temp2 = y.toString();
              var temp0 = 's0.4 t';
              temp0 = temp0.concat(temp1);
              temp0 = temp0.concat(',');
              temp0 = temp0.concat(temp2);
              console.log(g);
              g.transform(temp0);
              //f.transform( 't100,100');
              g.attr({"x": x, "y": y});
              g.attr({"gx": width});
              g.attr({"gy": height});
               svg.append(f);
              var startposition = [0, 3, 5,6,9,10,12,15];
              if (startposition.indexOf(h) > -1) {
                  if (1) {
                      // console.log(svg.g(f.selectAll('*')).getAttribute("x"));
                      // var xloc = parseFloat(g.attr("x")) * 2/5 + 230;
                      // var yloc = parseFloat(g.attr("y")) * 2/5 + 230;
                      var wt = parseFloat(g.attr("gx")); 
                      var ht = parseFloat(g.attr("gy"));
                      var xloc = grid[wt][ht][0];
                      var yloc = grid[wt][ht][1];
                      exist[wt][ht] = 1;
                      var gamepiece = svg.circle(xloc, yloc, 90);
                      gamepiece.attr({"position": [width,height]});
                      gamepiece.attr({"x": wt});
                      gamepiece.attr({"y": ht});
                      gamepiece.animate({r:70}, 500);
                      gamepiece.animate({cx:xloc, cy:yloc}, 500);
                      // gamepiece.node.animate({opacity: 0}, 1000);
                      gamepiece.attr({animation: "popup 10s 6.5s ease infinite"});
                      if (player == 0) {
                          gamepiece.attr({id: "p1"});
                          player = 1;
                      } else {
                          gamepiece.attr({id: "p2"});
                          player = 0;
                      }
                      gamepiece.drag();
                      if (turn % 2 == 0) {
                          turn = turn + 1;
                          color = "red";
                          gamepiece.attr({fill: color});
                      } else {
                          turn = turn + 1;
                          color = "yellow";
                          gamepiece.attr({fill: color});
                      }
                      //gamepiece.node.onclick = piececallback(gamepiece);
                  }
              }
              h = h + 1;
              // g.node.onclick = function () {
              //     if (piece == 0) {
              //         // console.log(svg.g(f.selectAll('*')).getAttribute("x"));
              //         var xloc = parseFloat(g.attr("x")) * 2/5 + 230;
              //         var yloc = parseFloat(g.attr("y")) * 2/5 + 230;
              //         var gamepiece = svg.circle(xloc + 50, yloc + 50, 90);
              //         gamepiece.animate({r:70}, 500);
              //         gamepiece.animate({cx:xloc, cy:yloc}, 500);
              //         // gamepiece.node.animate({opacity: 0}, 1000);
              //         gamepiece.attr({animation: "popup 10s 6.5s ease infinite"});
              //         piece = 1;
              //         gamepiece.drag();
              //         if (turn % 2 == 0) {
              //             turn = turn + 1;
              //             color = "red";
              //             gamepiece.attr({fill: color});
              //         } else {
              //             turn = turn + 1;
              //             color = "yellow";
              //             gamepiece.attr({fill: color});
              //         }
              //         // console.log(g.attr("x"));
              //         // console.log(gamepiece.attr("cx"));
              //     }
              // };
          });
        }
    }
  console.log('drawing', boardString);
}
