window.game || (window.game = {});

window.game.title = "Connect 4";

window.game.asset = "c4";

window.game.description = "This is Connect 4";

window.game.type = "cs61c";

window.game.getInitialBoard = function(p) {
  return "         ";
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
         this.canvas.fillStyle = 'grey';
         this.canvas.fillRect(0,0,this.canvas.width,this.canvas.height);

         for (var i = 0; i <this.conf.width; i++) {
          start = i * this.conf.width;
          for (var j = 0; j <this.conf.height; j++) {
            index = start + j;
            char = board[index];
            color = "#FFF";
            if (char === "X" || char === "x") {
              color = "#00F";
             }else if (char === "O" || char === "o") {
             color = "#F00";
            }

            this.canvas.beginPath();
            this.canvas.fillStyle = color;
            this.canvas.arc(x_pixels/2 + i*x_pixels,y_pixels/2+ j*y_pixels,x_pixels/3,0,2*Math.PI);
            this.canvas.fill();
          }
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
          for (i = 0, len = this.conf.width; i < len; i++) {
            window.moves[i] = data[i].board;
            color = "lightgrey";
            if (game.showValueMoves) {
              color = game.getColor(move, data);
            }
            game.notifier.canvas.beginPath();
            game.notifier.canvas.fillStyle = color;
            game.notifier.canvas.arc(x_pixels/2 + i*x_pixels,y_pixels/2,x_pixels/8,0,2*Math.PI);
            game.notifier.canvas.fill();
          }

          function c4Click(e) {
               var cell, mov;
               cell = game.getCursorPosition(e);
               var mov = Math.floor(parseInt(cell.xpos)/x_pixels);
               console.log("calling make move from connect 4: " + mov);
               console.log(window.moves[mov]);
               game.makeMove(window.moves[mov]);
          }
          if (!game.notifier.listener) {
            game.notifier.canvasElement.addEventListener("click", c4Click, false);
            game.notifier.listener = true;
          }
          return results;
     };
