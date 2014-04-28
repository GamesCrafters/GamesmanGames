window.game || (window.game = {});

window.game.title = "Tic Tac Toe";

window.game.asset = "ttt";

window.game.description = "This is Tic Tac Toe";

window.game.type = "c";

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
          var change, char, color, column, index, me, row, start, x_pixels, xpos, y_pixels, ypos, i, j, ref, ref1, results;
          me = this;

          //temp set up
          this.canvas.width = document.getElementById('GCAPI-main').width;
          this.canvas.height = document.getElementById('GCAPI-main').height;


         console.log("Board: '"+board+"'");
         x_pixels = Math.floor(this.canvas.width / this.conf.width);
         y_pixels = Math.floor(this.canvas.height / this.conf.height);
         xpos = 0;
         ypos = 0;
         results = [];

         for (row = i = 0, ref = this.conf.height - 1; 0 <= ref ? i <= ref : i >= ref; row = 0 <= ref ? ++i : --i) {
               xpos = 0;
               start = row * this.conf.width;
               for (column = j = 0, ref1 = this.conf.width - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; column = 0 <= ref1 ? ++j : --j) {
                    index = start + column;
                    char = board[index];
                    change = x_pixels * 0.1;
                    color = "#FFF";
                    if (char === "X" || char === "x") {
                         color = "#00F";
                    } else if (char === "O" || char === "o") {
                         color = "#F00";
                    }
              
                    this.canvas.fillStyle = "#FFF";
                    this.canvas.fillRect(xpos+1,ypos+1,x_pixels-2,y_pixels-2);
                    
                    if (color == "#F00") {                    
                         this.canvas.fillStyle=color;
                         this.canvas.fillRect(xpos+change,ypos+change,x_pixels - (change * 2), y_pixels - (change*2));
                         this.canvas.strokeRect(xpos+change,ypos+change,x_pixels - (change * 2), y_pixels - (change*2));
                    } else {
                         this.canvas.beginPath();
                         this.canvas.arc(xpos + (x_pixels / 2), ypos + (y_pixels / 2), (x_pixels / 2) - change, 0, Math.PI * 2, false);
                         this.canvas.closePath();
                         this.canvas.fillStyle=color;
                         this.canvas.fill();
                    }

                    xpos += x_pixels;
               }
               results.push(ypos += y_pixels);
          }
          return results;
     };

     notifier.prototype.drawMoves = function(data, game) {
          var color, column, move, row, val, x_pixels, xpos, y_pixels, ypos, i, len, results;
          x_pixels = Math.floor(game.notifier.canvas.width / game.notifier.conf.width);
          y_pixels = Math.floor(game.notifier.canvas.height / game.notifier.conf.height);
          window.moves = {};
          data = GCAPI.Game.sortMoves(data);
          results = [];
          for (i = 0, len = data.length; i < len; i++) {
               move = data[i];
               window.moves[move.move] = move;
               color = "#FFF";
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
               game.notifier.canvas.fillStyle=color;
               game.notifier.canvas.fillRect(xpos, ypos, x_pixels, y_pixels);
               game.notifier.canvas.strokeStyle='#000';
               game.notifier.canvas.strokeRect(xpos, ypos, x_pixels, y_pixels);
               // if (game.showValueMoves) {
               //  game.notifier.canvas.beginPath();
               //  game.notifier.canvas.arc(xpos + (x_pixels / 2), ypos + (y_pixels / 2), (x_pixels / 2) -change, 0, Math.PI * 2, false);
               //  game.notifier.canvas.closePath();
               //  game.notifier.canvas.fillStyle=color;
               //  game.notifier.canvas.fill();
               // }

               
          }

          function tttClick(e) {
               var cell, r, col, mov;
               cell = game.getCursorPosition(e);
               r = Math.floor(parseInt(cell.ypos)/y_pixels);
               var col = Math.floor(parseInt(cell.xpos)/x_pixels);
              // console.log("Row: "+r+', Column: '+col);
               var mov = r*3 + col+1;
               console.log("calling make move from ttt: " + mov);
               game.makeMove(window.moves[mov]);
          }
          if (!game.notifier.listener) {
            game.notifier.canvasElement.addEventListener("click", tttClick, false);
            game.notifier.listener = true;
          }
          return results;
     };
