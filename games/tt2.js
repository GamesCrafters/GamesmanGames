window.game || (window.game = {});

window.game.title = "Tic Tac Two";

window.game.asset = "tt2";

window.game.description = "This is Tic Tac Two";

window.game.type = "c";

window.game.getInitialBoard = function(p) {
  return "                  ";
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


            //defining our own board size
            var width = 6;
            var height = 3;
            
         console.log("Board: '"+board+"'");
         x_pixels = Math.floor(this.canvas.width / width);
         y_pixels = Math.floor(this.canvas.height / height);
                         
          //console.log("x_pix: "+this.canvas.width,'y_pix: '+this.canvas.height);
          
         xpos = 0;
         ypos = 0;
         results = [];

           //First Board
           
           //row
         for (row = 0; row < height; row++) {
           
                    xpos = 0;
                  
                   //collum
                for (column = 0; column < width; column++) {
                   
                   //Changed indexing to account for two boards
                    start = (column <= 2 ? row * (width/2) : row * (width/2) + 9);
                    index = start + (column <= 2 ? column : column - 3);
                    //--------------------------------------------
                         
                         //console.log("x_pix: "+start,'y_pix: '+index);
                    
                    char = board[index];
                    change = x_pixels * 0.1;
                    color = "#FFF";
                    backColor = "lightgrey";
                    
                    this.canvas.fillStyle = "lightgrey";
                    this.canvas.fillRect(xpos+1,ypos+1,x_pixels-2,y_pixels-2);
                    
                    if (char === "X" || char === "x") {
                         color = "#00F";
                    } else if (char === "O" || char === "o") {
                         color = "#F00";
                    }
                    else
                    {
                        if(index < 9)
                        {
                            backChar = board[index+9];
                        }
                        else if(index >= 9)
                        {
                            backChar = board[index-9];
                        }
                        
                        if (backChar === "X" || backChar === "x")
                        {
                            backColor = "rgba(0,0,255,.5)";
                        }
                        else if (backChar === "O" || backChar === "o")
                        {
                            backColor = "rgba(255,0,0,.5)";
                        }   
                    }
                    var yShift = ((y_pixels - (change * 2)) - (x_pixels - (change * 2))) / 2;
                    var grd = this.canvas.createRadialGradient(xpos + (x_pixels / 2),ypos + (y_pixels / 2),((x_pixels / 2)) / 2,xpos + (x_pixels / 2),ypos + (y_pixels / 2),(x_pixels / 2));
                    grd.addColorStop(0, "blue");
                    grd.addColorStop(1, "white");

                    if (color == "#F00") {                    
                         this.canvas.fillStyle=color;
                         this.canvas.fillRect(xpos+change,ypos+change+yShift,x_pixels - (change * 2), x_pixels - (change*2));
                         this.canvas.strokeRect(xpos+change,ypos+change+yShift,x_pixels - (change * 2), x_pixels - (change*2));
                    } else if (color == "#00F") {
                         this.canvas.beginPath();
                         this.canvas.arc(xpos + (x_pixels / 2), ypos + (y_pixels / 2), (x_pixels / 2) , 0, Math.PI * 2, false);
                         this.canvas.closePath();
                         this.canvas.fillStyle=grd;
                         this.canvas.fill();
                    } else {
                        if (backColor == "rgba(255,0,0,.5)") {                    
                            this.canvas.fillStyle=backColor;
                            this.canvas.fillRect(xpos+change,ypos+change+yShift,x_pixels - (change * 2), x_pixels - (change*2));
                            this.canvas.strokeRect(xpos+change,ypos+change+yShift,x_pixels - (change * 2), x_pixels - (change*2));
                        } else if (backColor == "rgba(0,0,255,.5)") {
                            this.canvas.beginPath();
                            this.canvas.arc(xpos + (x_pixels / 2), ypos + (y_pixels / 2), (x_pixels / 2), 0, Math.PI * 2, false);
                            this.canvas.closePath();
                            grd.addColorStop(0, "rgba(0, 0, 255, 0.5)");
                            grd.addColorStop(1, "rgba(255, 255, 255, 0.5)");
                            this.canvas.fillStyle=grd;
                            this.canvas.fill();
                        }
                    }

                    xpos += x_pixels;
               }
               results.push(ypos += y_pixels);
          }
          
          return results;
     };

     notifier.prototype.drawMoves = function(data, game) {
          var color, column, move, row, val, x_pixels, xpos, y_pixels, ypos, i, len, results;
            
            //defining our own board size
            var width = 6;
            var height = 3;
            
          x_pixels = Math.floor(game.notifier.canvas.width / width);
          y_pixels = Math.floor(game.notifier.canvas.height / height);
          window.moves = {};
          data = GCAPI.Game.sortMoves(data);
          results = [];
          for (i = 0, len = data.length; i < len; i++) {
               move = data[i];
               window.moves[move.move] = move;
               color = "rgb(255, 255, 255)";
               if (game.showValueMoves) {
                    color = game.getColor(move, data);

                    colorList = color.substring(4, color.length-1)
                    .replace(/ /g, '')
                    .split(',');
                    color = "rgb"+colorList[0]+","+colorList[1]+","+colorList[2]+")";
                    console.log(color)
               }
               column = row = 0;
                  
               val = parseInt(move.move) - 1;
                  
                  //console.log("Value: "+val);
                  
               column = val < 9 ? val % 3 : val % 3 + 3;
               row = val < 9 ? Math.floor(val/3) : Math.floor((val-9)/3);
                    
                  //console.log("Row: "+row+', Column: '+column);

               xpos = x_pixels * column;
               ypos = y_pixels * row;         
                  
               game.notifier.canvas.fillStyle= "rgba(115, 115, 115, 0.5)";
               game.notifier.canvas.fillRect(xpos, ypos, x_pixels, y_pixels);
               
               if (game.showValueMoves) {
                    game.notifier.canvas.strokeStyle=color;
                    var offset = 6;
                    game.notifier.canvas.lineWidth = 6;
                    game.notifier.canvas.strokeRect(xpos + offset, ypos + offset, x_pixels - offset, y_pixels - offset);
               }
               else{
                    game.notifier.canvas.strokeStyle='#000';
                    game.notifier.canvas.strokeRect(xpos, ypos, x_pixels, y_pixels);
               }
               game.notifier.canvas.fillStyle = "#000";
               game.notifier.canvas.fillRect(game.notifier.canvas.width / 2 - 3, 0, 6, game.notifier.canvas.height);
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
              //console.log("Row: "+r+', Column: '+col);
               var mov = ( col <= 2 ? r*3+col+1 : (r-1)*3+col+10);
               console.log("calling make move from tt2: " + mov);
               game.makeMove(window.moves[mov]);
          }
          if (!game.notifier.listener) {
            game.notifier.canvasElement.addEventListener("click", tttClick, false);
            game.notifier.listener = true;
          }
          return results;
     };
