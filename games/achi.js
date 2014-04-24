window.game || (window.game = {});

window.game.title = "Achi";

window.game.asset = "achi";

window.game.description = "This is Achi";

window.game.type = "c";

window.firstClick = true; // Set to false after the first click in the sliding phase.

window.firstMove = 0; // Record the first position clicked.

window.game.getInitialBoard = function(p) {
  return "         ;pos=0";
};

window.game.getDimensions = function(p) {
  return [p.width, p.height];
};

window.game.notifier = notifier = 
     function notifier(canvas, conf) {
          gameNotifier.call(this);
          this.canvasElement = canvas;
          this.canvas = canvas.getContext("2d");
         this.conf = conf;
         this.listener = false;
     };

     notifier.prototype = new gameNotifier();

     notifier.prototype.constructor = notifier;

     notifier.prototype.drawBoard = function(board, game) {
          var char, color, column, index, row, start, x_pixels, xpos, y_pixels, ypos, i, j, ref, ref1, results;

          //temp set up
          this.canvas.width = document.getElementById('GCAPI-main').width;
          this.canvas.height = document.getElementById('GCAPI-main').height;

          this.canvas.clearRect(0,0,this.canvas.width, this.canvas.height);

          console.log("Board: '" + board + "'");
          x_pixels = Math.floor(this.canvas.width / this.conf.width);
          y_pixels = Math.floor(this.canvas.height / this.conf.height);
          xpos = 0;
          ypos = 0;
          results = [];
       
          // The following code Draws the lines of the Board:

          var px = [x_pixels/2, x_pixels+x_pixels/2, 2*x_pixels + x_pixels/2];
          var py = [y_pixels/2, y_pixels+y_pixels/2, 2*y_pixels + y_pixels/2];

          var d = this.canvas;

          d.strokeStyle = "#000";
          d.lineWidth = 2;
          d.beginPath();

          d.moveTo(px[0],py[0]);
          d.lineTo(px[2],py[0]);

          d.moveTo(px[0],py[0]);
          d.lineTo(px[0],py[2]);

          d.moveTo(px[0],py[0]);
          d.lineTo(px[2],py[2]);

          d.moveTo(px[1],py[0]);
          d.lineTo(px[1],py[2]);

          d.moveTo(px[0],py[1]);
          d.lineTo(px[2],py[1]);

          d.moveTo(px[2],py[0]);
          d.lineTo(px[2],py[2]);

          d.moveTo(px[0],py[2]);
          d.lineTo(px[2],py[2]);

          d.moveTo(px[0],py[2]);
          d.lineTo(px[2],py[0]);
          
          d.stroke();

          // End drawing the lines of the board.

         for (row = i = 0, ref = this.conf.height - 1; 0 <= ref ? i <= ref : i >= ref; row = 0 <= ref ? ++i : --i) {
               xpos = 0;
               start = row * this.conf.width;
               for (column = j = 0, ref1 = this.conf.width - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; column = 0 <= ref1 ? ++j : --j) {
                    index = start + column;
                    char = board[index];
                    color = "#FFF";
                    if (char === "X" || char === "x") {
                         color = "#00F";
                    } else if (char === "O" || char === "o") {
                         color = "#F00";
                    }
                 
                    // The following code draws the circles in the board.
                 

                    this.canvas.fillStyle=color;
                    this.canvas.strokeStyle = "#000";
                    this.canvas.lineWidth = 2;

                    this.canvas.beginPath();
                    this.canvas.arc(xpos + (x_pixels / 2), ypos + (y_pixels / 2), (x_pixels / 4) + 5, 0, Math.PI * 2, false);
                    this.canvas.closePath();

                    this.canvas.fill();
                    this.canvas.stroke();
                 
                    // End of drawing circles.

                    xpos += x_pixels;
               }
               results.push(ypos += y_pixels);
          }
          return results;
     };

     notifier.prototype.drawMoves = function(data, game) {
          var color, column, move, row, val, x_pixels, xpos, y_pixels, ypos, i, len, results, change;
          x_pixels = Math.floor(this.canvas.width / game.notifier.conf.width);
          y_pixels = Math.floor(this.canvas.height / game.notifier.conf.height);
          change = x_pixels * 0.1;
          window.moves = {};
          results = [];

          // Using the moveNum attribute of game to know when it is the sliding phase:
          if (game.moveNum < 6) {

            // Placing phase:

            data = GCAPI.Game.sortMoves(data);
            for (i = 0, len = data.length; i < len; i++) {

                 move = data[i];
                 window.moves[move.move] = move;
                 color = "rgba(0,0,0,0)";
                 if (game.showValueMoves) {
                      color = game.getColor(move, data);
                 }
                 column = row = 0;
                 if (game.isC()) {
                      val = parseInt(move.move) - 1;
                      column = val % 3;
                      row = Math.floor(val/3);
                 } else {
                      column = move.move.charCodeAt(0) - 65;
                      row = move.move[1] - 1;
                 }
                 xpos = x_pixels * column;
                 ypos = y_pixels * row;

                this.canvas.fillStyle = "rgba(0,0,0,0)";
                this.canvas.strokeStyle = color;
                this.canvas.lineWidth = 10;

                this.canvas.beginPath();
                this.canvas.arc(xpos + (x_pixels / 2), ypos + (y_pixels / 2), (x_pixels / 4), 0, Math.PI * 2, false);
                this.canvas.closePath();

                this.canvas.fill();
                this.canvas.stroke();

                 //this.canvas.fillStyle=color;
                 //this.canvas.fillRect(xpos, ypos, x_pixels, y_pixels);
            }
          } else {

            // Sliding phase:

            var val2;

            for (i = 0, len = data.length; i < len; i++) {
                move = data[i];
                window.moves[move.move] = move;

                color = "rgba(0,0,0,0)";
                if (game.showValueMoves) {
                  color = game.getColor(move, data);
                }

                val = parseInt(move.move[0]);
                val2 = parseInt(move.move[1]);

                drawAnArrow(this.canvas, val, val2, color);


            }
          }

          function drawAnArrow(context, val, val2, color) {
                val = val - 1;
                val2 = val2 - 1;

                var px = [x_pixels/2, x_pixels+x_pixels/2, 2*x_pixels + x_pixels/2];
                var py = [y_pixels/2, y_pixels+y_pixels/2, 2*y_pixels + y_pixels/2];

                var column = val % 3;
                row = Math.floor(val/3);
                
                var column2 = val2 % 3;
                row2 = Math.floor(val2/3);

                var fromx = px[column];
                var fromy = py[row];
                var tox = px[column2];
                var toy = py[row2];
                var angle = Math.atan2(toy-fromy,tox-fromx);
                var skipBefore = (x_pixels / 4) + 6;
                var skipAfter = (x_pixels / 4) + 13;

                fromx += skipBefore * Math.cos(angle);
                fromy += skipBefore * Math.sin(angle);
                tox -= skipAfter * Math.cos(angle);
                toy -= skipAfter * Math.sin(angle);

                context.strokeStyle = color;
                context.lineWidth = 10;
                context.beginPath();

                drawAnArrowFromCoord(context, fromx, fromy, tox, toy);

                context.stroke();
          }

          function drawAnArrowFromCoord(context, fromx, fromy, tox, toy) {
              var headlen = 30;   // length of head in pixels
              var angle = Math.atan2(toy-fromy,tox-fromx);
              context.moveTo(fromx, fromy);
              context.lineTo(tox, toy);
              context.moveTo(tox-headlen*Math.cos(angle-Math.PI/4),toy-headlen*Math.sin(angle-Math.PI/4));
              context.lineTo(tox, toy);
              //context.moveTo(tox, toy);
              context.lineTo(tox-headlen*Math.cos(angle+Math.PI/4),toy-headlen*Math.sin(angle+Math.PI/4));
          }

          function achiClick(e) {
            var cell, row, col, mov;
            cell = game.getCursorPosition(e);
            row = Math.floor(parseInt(cell.ypos)/y_pixels);
            col = Math.floor(parseInt(cell.xpos)/x_pixels);
            mov = row*3 + col + 1;

            if (game.moveNum < 6) {
              console.log("Calling make move from achi: " + mov);
              game.makeMove(window.moves[mov]);
            } else {
              if (window.firstClick) {
                var found = false;
                for (var move in window.moves) {
                  if (parseInt(move[0]) == mov) {
                    found = true;
                  }
                }
                if (found) {
                  for (var move in window.moves) {
                    if (parseInt(move[0]) == mov) {
                      if (!game.showValueMoves) {
                        drawAnArrow(game.notifier.canvas, parseInt(move[0]), parseInt(move[1]), "#000");
                      }
                    } else {
                      if (game.showValueMoves) {
                        drawAnArrow(game.notifier.canvas, parseInt(move[0]), parseInt(move[1]), "#FFF");
                      }
                    }
                  }
                  window.firstClick = false;
                  window.firstMove = mov;
                }
              } else {
                movstr = window.firstMove.toString() + mov.toString();
                mov = window.moves[movstr];
                if (typeof(mov) != "undefined") {
                  game.makeMove(mov);
                  window.firstClick = true;
                }
              }
            }
          }

          if (!game.notifier.listener) {
            this.canvasElement.addEventListener("click", achiClick, false);
            game.notifier.listener = true;
          }
          return results;
     };
