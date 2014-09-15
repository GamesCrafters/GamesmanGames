window.game || (window.game = {});

window.game.title = "Title";

window.game.asset = "asset";

window.game.description = "";

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
};

notifier.prototype.drawMoves = function(data, game) {
  function click(e) {
  }
  if (!game.notifier.listener) {
    game.notifier.canvasElement.addEventListener("click", click, false);
    game.notifier.listener = true;
  }
  return results;
};
