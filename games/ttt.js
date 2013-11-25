var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.game || (window.game = {});

window.game.title = "Tic Tac Toe";

window.game.asset = "ttt";

window.game.description = "This is Tic Tac Toe";

window.game.type = "c";

window.game.parameters = {
  width: {
    type: "integer",
    values: [3, 4, 5],
    desc: "Board Width"
  },
  height: {
    type: "integer",
    values: [3, 4, 5],
    desc: "Board Height"
  },
  pieces: {
    type: "integer",
    values: [3, 4, 5],
    desc: "Number in a row"
  }
};

window.game.getInitialBoard = function(p) {
  var a, b, retval, _i, _j, _ref, _ref1;
  retval = "";
  for (a = _i = 1, _ref = p.width; 1 <= _ref ? _i <= _ref : _i >= _ref; a = 1 <= _ref ? ++_i : --_i) {
    for (b = _j = 1, _ref1 = p.height; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; b = 1 <= _ref1 ? ++_j : --_j) {
      retval += " ";
    }
  }
  return retval;
};

window.game.getDimensions = function(p) {
  return [p.width, p.height];
};

window.game.notifier = notifier = 
    function notifier(canvas, params) {
    gameNotifier.call(this);
    this.canvas = canvas;
    this.params = params;
  };

  notifier.prototype = new gameNotifier();

  notifier.prototype.constructor = notifier;

  notifier.prototype.drawBoard = function(board, game) {
    var change, char, color, column, index, me, row, start, x_pixels, xpos, y_pixels, ypos, _i, _j, _ref, _ref1, _results;
    me = this;
    x_pixels = Math.floor(this.canvas.width() / this.conf.width);
    y_pixels = Math.floor(this.canvas.height() / this.conf.height);
    xpos = 0;
    ypos = 0;
    _results = [];
    for (row = _i = 0, _ref = this.conf.height - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; row = 0 <= _ref ? ++_i : --_i) {
      xpos = 0;
      start = row * this.conf.width;
      for (column = _j = 0, _ref1 = this.conf.width - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; column = 0 <= _ref1 ? ++_j : --_j) {
        index = start + column;
        char = board[index];
        change = x_pixels * 0.1;
        color = "#FFF";
        if (char === "X" || char === "x") {
          color = "#00F";
        } else if (char === "O" || char === "o") {
          color = "#F00";
        }
        this.canvas.drawRect({
          fillStyle: "#7F7F7F",
          strokeStyle: "#000",
          strokeWidth: 3,
          x: xpos,
          y: ypos,
          width: x_pixels,
          height: y_pixels,
          fromCenter: false,
          layer: true
        });
        if (color === "#F00") {
          this.canvas.drawRect({
            fillStyle: color,
            strokeStyle: "#000",
            strokeWidth: 3,
            x: xpos + change,
            y: ypos + change,
            width: x_pixels - (change * 2),
            height: y_pixels - (change * 2),
            fromCenter: false,
            layer: true
          });
        } else if (color === "#00F") {
          this.canvas.drawArc({
            fillStyle: color,
            strokeStyle: "#000",
            strokeWidth: 3,
            x: xpos + (x_pixels / 2),
            y: ypos + (y_pixels / 2),
            radius: (x_pixels / 2) - change,
            layer: true
          });
        }
        xpos += x_pixels;
      }
      _results.push(ypos += y_pixels);
    }
    return _results;
  };

  notifier.prototype.drawMoves = function(data, game) {
    var color, column, move, row, val, x_pixels, xpos, y_pixels, ypos, _i, _len, _results;
    x_pixels = Math.floor(game.notifier.canvas.width() / game.notifier.conf.width);
    y_pixels = Math.floor(game.notifier.canvas.height() / game.notifier.conf.height);
    window.moves = {};
    data = GCAPI.Game.sortMoves(data);
    _results = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      move = data[_i];
      window.moves[move.move] = move;
      color = "#FFF";
      if (game.showValueMoves) {
        color = game.getColor(move, data);
        console.log(color);
      }
      column = row = 0;
      if (game.isC()) {
        val = parseInt(move.move) - 1;
        column = val % 3;
        row = Math.floor(val / 3);
      } else {
        column = move.move.charCodeAt(0) - 65;
        row = move.move[1] - 1;
      }
      xpos = x_pixels * column;
      ypos = y_pixels * row;
      game.notifier.canvas.drawRect({
        layer: true,
        name: move.move,
        fillStyle: "#7F7F7F",
        strokeStyle: "#000",
        strokeWidth: 3,
        x: xpos,
        y: ypos,
        width: x_pixels,
        height: y_pixels,
        fromCenter: false,
        click: function(layer) {
          return game.makeMove(window.moves[layer.name]);
        }
      });
      if (game.showValueMoves) {
        _results.push(game.notifier.canvas.drawArc({
          fillStyle: color,
          x: xpos + (x_pixels / 2),
          y: ypos + (y_pixels / 2),
          radius: x_pixels / 5,
          layer: true
        }));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };



