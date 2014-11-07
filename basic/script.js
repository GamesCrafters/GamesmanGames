$(function () {
  refresh();
  $('#game-input').on('input', refresh);
  $('#position').on('input', function () {
    drawBoard(Snap('#main-svg'), $('#position').val());
  });
});

function refresh() {
  if (1) {
      getStart($('#game-input').val(), function (start) {
          $('#position').val(start);
          drawBoard(Snap('#main-svg'), start);
      });
  }
}

function getStart(game, callback) {
  $.get('http://nyc.cs.berkeley.edu:8081/' + game + '/getStart', function (res) {
    var res = JSON.parse(res);
    callback(res.response);
  });
}

var frag;

function checkWin(player) {
    var players = player
    //check in horizontal line
    var inrow  = 0;
    var x = players[0].attr("gx");
    var y = players[0].attr("gy");
    players.forEach( function(entry) {
        if (entry.attr("gx") == x) {
            inrow = inrow + 1;
        }
    });
    if (inrow == 4) {
        return 1;
    }
       
    //check in vertical line
    var incol = 0;
    players.forEach( function(entry) {
        if (entry.attr("gy") == y) {
            incol = incol + 1;
        }
    });
    if (incol == 4) {
        return 1;
    }
    var diffs = [];
    x = parseFloat(x);
    y = parseFloat(y);
    var otherx = -1;
    var othery = -1;
    players.forEach( function(entry) {
        var diffx = Math.abs(parseFloat(entry.attr("gx")) - x);
        var diffy = Math.abs(parseFloat(entry.attr("gy")) - y);    
        diffs.push([diffx, diffy]);
        if (diffx == 1 && diffy == 1) {
            otherx = parseFloat(entry.attr("gx"));
            othery = parseFloat(entry.attr("gy"));
        }
    });
    var square = [[1,1],[1,0],[0,1]];
    diffs.forEach( function(value) {
        var found = -1;
        for (var i = 0; i < square.length; i++) {
            if (value[0] == square[i][0] && value[1] == square[i][1]) {
                found = i;
            }
        }
        if (found != -1) {
            square.splice(found, 1);
        }
    });
    diffs = [];
    if (square.length == 0) {
        players.forEach( function(entry) {
            var diffx = Math.abs(parseFloat(entry.attr("gx")) - otherx);
            var diffy = Math.abs(parseFloat(entry.attr("gy")) - othery);    
            diffs.push([diffx, diffy]);
        });
        square = [[1,1],[1,0],[0,1]];
        diffs.forEach( function(value) {
            var found = -1;
            for (var i = 0; i < square.length; i++) {
                if (value[0] == square[i][0] && value[1] == square[i][1]) {
                    found = i;
                }
            }
            if (found != -1) {
                square.splice(found, 1);
            }
        });
    }
    if (square.length == 0) {
        return 1;
    }
    return 0;
}

function drawBoard (svg, boardString) {
    var turn = 0;
    var f_Shadow = svg.paper.filter(Snap.filter.shadow(-4, 6, 6));
    var f_blur = svg.paper.filter(Snap.filter.blur(1, 1));
   //  var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
   //  text.setAttribute('x', 10);
   //  text.setAttribute('y', 940);
   //  text.setAttribute('fill', 'black');
   //  text.setAttribute('fontFamily', 'Comic Sans MS');
   //  text.textContent = "Start Game";
   // // svg.append(text);
    var text = svg.paper.text(10,940, 'Start Game').attr({fill: '#000', fontFamily: 'Comic Sans MS'});
    var color = "yellow";
    var board = svg.rect(50,20,900,900);
    var player = 0;
    // var p_line1 = svg.paper.line(50,20, 150, 920).attr({stroke: '#000'});
    // var p_line2 = svg.paper.line(50,920, 150,20).attr({stroke: '#000'});
    var p_rect = svg.paper.rect(50, 20, 100,900).attr({fill: "saddlebrown", opacity: 0.9, stroke: "brown", filter: f_blur});
    var p_elip = svg.paper.ellipse(100, 470, 30, 400).attr({fill: "saddlebrown", stroke: "#000", filter: f_blur});
    var p_elip2 = svg.paper.ellipse(100, 470, 20, 300).attr({fill: "saddlebrown", stroke: "#000", filter: f_blur});
    var p_elip3 = svg.paper.ellipse(100, 470, 10, 200).attr({fill: "saddlebrown", stroke: "#000", filter: f_blur});
    var p_elip4 = svg.paper.ellipse(100, 470, 5, 100).attr({fill: "saddlebrown", stroke: "#000", filter: f_blur});
    var pattern = svg.paper.g(p_rect, p_elip, p_elip2, p_elip3, p_elip4).pattern(50, 20, 100, 900);
  board.attr({
      fill: "#888",
      stroke : "#000",
      strokeWidth: 5
  });
  var transformgrid  = [];
  for (a=0;a<4;a++) {
      transformgrid[a] = [];
  }  
  var grid = [];
  for (a=0;a<4;a++) {
      grid[a] = [];
  }
  var background1 = svg.g(board);
  var exist = [];
  for (a=0;a<4;a++) {
      exist[a] = [];
      for (b=0; b<4; b++) {
          exist[a][b] = 0;
      }
  }
  function drawArrow (x, y, endx, endy, w, l, start) {
      var oldy = y;
      var oldx = x;
      x = x + 20;
      //subtract to modify distance of arrows to outeredge
      l = Math.sqrt(Math.pow(x - endx, 2) + Math.pow(y - endy, 2)) - 40; 
      if (start == 1) {
          var r = w/2;
          t = svg.polygon(x, y, x + r, y, x + r, y - l + 2 * w, x + w, y - l + 2 * w, x, y - l, x - w, y - l + 2 * w, x - r, y - l + 2 * w, x - r, y, x, y);
      } else {
          var r = w/2;
          y = y - l * (start - 1);
          t = svg.polygon(x, y, x + r, y + w, x + r, y - l + 2 * w, x + w, y - l + 2 * w, x, y - l, x - w, y - l + 2 * w, x - r, y - l + 2 * w, x - r, y + w, x, y);
      }
      dy = oldy - endy;
      dx = endx - oldx;        
      theta = Math.atan2(dy, dx);
      theta *= 180/Math.PI;
      if (dy < 0 && dx > 0) {
          theta = theta + 180;
      }
      if (dy > 0 && dx < 0) {
          theta = theta + 180;
      }
      console.log(theta);
      if (dx == 0) {
          if (dy > 0) {
              theta = 0;
          } else {
              theta = 180;
          }
      }
      if (dy == 0) {
          if (dx > 0) {
              theta = 90;
          } else {
              theta = 270;
          }
      }
      var trans = "r"
      var final_transform = trans + theta + " "  + oldx + " " + oldy;
      t.transform(final_transform);
      t.attr("class", "hover_group");
      t.attr({id: "arrow"});
      t.attr({fill: "green"});
      return svg.g(t);
  }
  function daoDrawArrow(x, y, endx, endy, w, l, start, piece, endcorx, endcory) {
      temp = drawArrow(x, y, endx, endy, w, l, start);
      temp.node.onclick = callback([endcorx, endcory], piece);
      var background = svg.rect();
      var location = grid[parseFloat(piece.attr("gx"))][parseFloat(piece.attr("gy"))];
      var clon = svg.circle().attr({r: 90, cx: location[0], cy: location[1]})
      clon.attr({fill: "white", opacity: 1});
      background.attr({fill: "#fff", height: "100%", width: "100%"})
      clon.attr({fill: "black", opacity: 1});
      temp.attr({mask: svg.g(background, clon)});
      console.log("hi")
  }
  var callback = function (location, ppiece) {
      var move = function() {
          //var tlocation = grid[location[0]][location[1]];
          var tlocation = transformgrid[location[0]][location[1]];
          $("[id=arrow]").remove();
          svg.append(ppiece);
          exist[parseFloat(ppiece.attr("gx"))][parseFloat(ppiece.attr("gy"))] = 0;
          exist[location[0]][location[1]] = 1;
          //ppiece.animate({cx:tlocation[0], cy:tlocation[1]}, 500);
          var custom = function(n) {
              return Math.pow(n, .4);
          };
          ppiece.animate({transform: tlocation}, 1000, custom);
          var pieces = svg.selectAll("#" + ppiece.attr("id"));
          // pieces.forEach( function(entry) {
          //     entry.animate({r : parseFloat(entry.attr("r")) - 10}, 100);
          // });
          ppiece.attr({"gx": location[0]});
          ppiece.attr({"gy": location[1]});
          if (checkWin(pieces)) {
              console.log("You have won");
              Snap.load("Potato.svg", function(f) {
                  var potato = svg.g(f.selectAll('*'));
                  potato.transform("s.5 t200");
                  potato.drag();
                  svg.append(potato);
              });  
              return 0;
          }
          callback(playgame()());
      };
      return move;
  }
  var piececallback = function (piece) {
      var calculatemoves = function() {
          //test horizontal direction to right
          var wt = parseFloat(piece.attr("gx"));
          var ht = parseFloat(piece.attr("gy"));
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

          //test diagonal downwardright
          testy = ht;
          testx = wt;
          while (testy + 1 < 4 && testx + 1 < 4) {
              if (exist[testx + 1][testy + 1] != 1) {
                  testy = testy + 1;
                  testx = testx + 1;
              } else {
                  break;
              }
          }
          if (testy != ht  && testy < 4) {
              locations[counter] = [testx, testy];
              counter = counter + 1;
          }
          //test diagonal upwardright
          testy = ht;
          testx = wt;
          while (testy - 1 > -1 && testx + 1 < 4) {
              if (exist[testx + 1][testy - 1] != 1) {
                  testy = testy - 1;
                  testx = testx + 1;
              } else {
                  break;
              }
          }
          if (testy != ht  && testy > -1) {
              locations[counter] = [testx, testy];
              counter = counter + 1;
          }
          //test diagonal downwardleft
          testy = ht;
          testx = wt;
          while (testy + 1 < 4 && testx -1 > -1) {
              if (exist[testx - 1][testy + 1] != 1) {
                  testy = testy + 1;
                  testx = testx - 1;
              } else {
                  break;
              }
          }
          if (testy != ht  && testy < 4) {
              locations[counter] = [testx, testy];
              counter = counter + 1;
          }
          //test diagonal upwardleft
          testy = ht;
          testx = wt;
          while (testy - 1 > -1 && testx - 1 > -1) {
              if (exist[testx - 1][testy - 1] != 1) {
                  testy = testy - 1;
                  testx = testx - 1;
              } else {
                  break;
              }
          }
          if (testy != ht  && testy > -1) {
              locations[counter] = [testx, testy];
              counter = counter + 1;
          }
          for (var i = 0; i < locations.length; i++) {
              var arrowx = grid[parseFloat(piece.attr("gx"))][parseFloat(piece.attr("gy"))][0] - 10;
              var arrowy = grid[parseFloat(piece.attr("gx"))][parseFloat(piece.attr("gy"))][1];
              daoDrawArrow(arrowx + 10, arrowy, grid[locations[i][0]][locations[i][1]][0], grid[locations[i][0]][locations[i][1]][1], 20, 150, 1, piece, locations[i][0], locations[i][1]);
          }
      };
      return calculatemoves;
  }
  var playgame = function() {
      function play () {
          $("#start").remove();
          if (player == 0) {
              player = 1;
              var players = svg.selectAll("#yp1");
              for (var i = 0; i < players.length; i++ ) {
                  players[i].animate({r: parseFloat(players[i].attr("r")) + 10}, 100);
                  piececallback(players[i])();
              }
              // $("[player = p1]").click();
          } else {
              player = 0;
              var players = svg.selectAll("#yp2");
              for (var i = 0; i < players.length; i++ ) {
                  players[i].animate({r: parseFloat(players[i].attr("r")) + 10}, 100);
                  piececallback(players[i])();
              }
              // $("[player = p2]").click();           
          }
          if (svg.selectAll("#arrow").length == 0) {
                  console.log("You won by default");
                  return 0;
          }
      }
      return play;
  }
  var startposition = [0, 3, 5,6,9,10,12,15];
  var change = 0;
  var piecenum = 0;
  var startgrid = []
  var h  = 0;
  for (k = 0; k < 4; k++) {
      for (l = 0; l < 4; l++) {
          console.log(l);
          var f_blur2 = svg.paper.filter(Snap.filter.blur(10, 10));
          //Snap.load("Yin_yang.svg", function (f) {
              //frag = f;
              //f.selectAll("*").attr({filter: f_Shadow});
              // f.selectAll(":not([style='fill:#ffffff'])").attr({style: "fill:#00f"});
              //var g = svg.g(f.selectAll('*'));
              var height = Math.floor(h / 4);
              var width = h % 4;
              var x = 500 * width - 100;
              var y = 500 * height - 180;
              var locx = x * 2/5 + 230;
              var locy = y * 2/5 + 230;
              grid[width][height] = [locx, locy];
              var temp1 = x.toString();
              var temp2 = y.toString();
              var temp0 = 's0.4 t';
              temp0 = temp0.concat(temp1);
              temp0 = temp0.concat(',');
              temp0 = temp0.concat(temp2);
              transformgrid[width][height] = temp0;
          var positionpiece = svg.circle(locx, locy, 90);
          background1.append(positionpiece);
              //console.log(g);
              //g.transform(temp0);
              //g.attr({"x": x, "y": y});
              //g.attr({"gx": width});
              //g.attr({"gy": height});
              //svg.append(f);
              //background1.append(g);

          if (startposition.indexOf(h) > -1) {
              //if (1) {
              startgrid.push([width, height]);
              // console.log(svg.g(f.selectAll('*')).getAttribute("x"));
              // var xloc = parseFloat(g.attr("x")) * 2/5 + 230;
              // var yloc = parseFloat(g.attr("y")) * 2/5 + 230;
              Snap.load("Yin_yang.svg", function (a) {
                  console.log(player)
                  var piecex = startgrid[piecenum][0];
                  var piecey = startgrid[piecenum][1];
                  exist[piecex][piecey] = 1;
                  piecenum = piecenum + 1;
                  if (player == 1) {
                      a.selectAll(":not([style='fill:#ffffff'])").attr({style: "fill:#ffd700"});
                  } else {
                      a.selectAll(":not([style='fill:#ffffff'])").attr({style: "fill:#00f"});
                  }
                  var yypiece = svg.g(a.selectAll('*'));
                  if (player == 0) {
                      //for alternation of piece placing
                      yypiece.attr({id: "yp1"});
                  } else {
                      yypiece.attr({id: "yp2"});
                  }
                  if (piecenum % 4 == 0 && piecenum != 0) {
                      player = player + 1;
                  }
                  player = (player + 1) % 2;
                  
                  yypiece.attr({gx: piecex, gy: piecey});
                  yypiece.transform(transformgrid[piecex][piecey]);
                  svg.append(yypiece);
                  //yypiece.node.onclick = piececallback(yypiece);
                  
              });
              // var wt = parseFloat(g.attr("gx")); 
              // var ht = parseFloat(g.attr("gy"));
              // var xloc = grid[wt][ht][0];
              // var yloc = grid[wt][ht][1];
              // exist[wt][ht] = 1;
              // var gamepiece = svg.circle(xloc, yloc, 90);
              // gamepiece.attr({"position": [width,height]});
              // gamepiece.attr({"x": wt});
              // gamepiece.attr({"y": ht});
              // gamepiece.animate({r:70}, 500);
              // gamepiece.animate({cx:xloc, cy:yloc}, 500);
              // // gamepiece.node.animate({opacity: 0}, 1000);
              // gamepiece.attr({animation: "popup 10s 6.5s ease infinite"});
              // if (player == 0) {
              //     //for alternation of piece placing
              //     gamepiece.attr({id: "p1"});
              //     change = change + 1;
              // } else {
              //     gamepiece.attr({id: "p2"});
              //     change = change + 1;
              // }
              // // player = (player + 1 + (Math.floor(change / 4))) % 2;
              // if (player == 0) {
              //     turn = turn + 1;
              //     color = "blue";
              //     gamepiece.attr({fill: color});
              // } else {
              //     turn = turn + 1;
              //     color = "gold";
              //     gamepiece.attr({fill: color});
              // }
              // if (change % 4 == 0 && change != 0) {
              //     player = player + 1;
              // }
              // player = (player + 1) % 2;
              
              // var f_blur2 = svg.paper.filter(Snap.filter.blur(5, 1));
              // gamepiece.attr({opacity: .7, filter: f_Shadow});
              // var newgamepiece = svg.g(gamepiece);
              // newgamepiece.attr({filter: f_blur2});
              //gamepiece.node.onclick = piececallback(gamepiece);
              //   }
          }
              h = h + 1;
         // });
        }
    }
  var startbtn = svg.rect(0, 920, 100, 30).attr({fill: "white"});
    startbtn.attr({id: "start", filter: f_Shadow});
    startbtn.attr("class", "hover_group");
    startbtn.node.onclick = function () {
        text.remove();
        playgame()();
    };
    text.remove();
    svg.append(text);
  console.log('drawing', boardString);
}
