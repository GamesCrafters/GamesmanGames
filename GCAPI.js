window.GCAPI || (window.GCAPI = {});

window.GCAPI.console = console;

window.GCAPI.GameNotifier = gameNotifier = (function() {

  function gameNotifier(canvas, conf) {
    this.canvas = canvas;
    this.conf = conf;
    this.showMoveValues = false;

    gameNotifier.prototype.drawBoard = function(board, game) {
      return alert("GameNotifier must implement drawBoard");
    };

    gameNotifier.prototype.drawMoves = function(data, game) {
      return alert("GameNotifier must implement drawMoves");
    };

    gameNotifier.prototype.setShowMoveValues = function(showMoveValues) {
      this.showMoveValues = showMoveValues;
    };
  }
});

window.GCAPI.getAspectRatio = function(p) {
  var dim;
  dim = game.getDimensions(p);
  return reduce(dim[0], dim[1]);
};


var reduce = function(num, denom) {
  var d, gcd;
  gcd = function(a, b) {
    if (b) {
      return gcd(b, a % b);
    } else {
      return a;
    }
  };
  d = gcd(num, denom);
  return [num / d, denom / d];
};


window.GCAPI.Game = Game = (function() {

  function Game(name, parameters, notifierClass, board, coverCanvas, statusBar, vvhPanel) {
    this.coverCanvas = coverCanvas;
    this.statusBar = statusBar;
    this.vvhPanel = vvhPanel;
    this.gameName = name;
    this.params = parameters;
    this.notifier = notifierClass;
    this.startBoard = [];
    this.previousStates = [];
    this.nextStates = [];
    this.currentState = {
      board: {
        board: board
      },
      moves: []
    };
    this.baseUrl = "http://nyc.cs.berkeley.edu:8080/gcweb/service/gamesman/puzzles/";
    this.showValueMoves = false;
    this.currentPlayer = 0;
    if (this.params["fake"]) {
      this.fakeIt();
    }
    if (game.type === "c") {
      this.useC();
    }
    
  }

  Game.prototype.useC = function() {
    return this.baseUrl = "http://nyc.cs.berkeley.edu:8081/";
  };

  Game.prototype.isC = function() {
    return this.baseUrl === "http://nyc.cs.berkeley.edu:8081/";
  };

  Game.sortMoves = function(moves) {
    return moves.sort(function(a, b) {
      if (a.value === b.value) {
        if (a.value === "win") {
          if (a.remoteness < b.remoteness) {
            return 1;
          } else if (a.remoteness > b.remoteness) {
            return -1;
          } else {
            return 0;
          }
        } else {
          if (a.remoteness < b.remoteness) {
            return -1;
          } else if (a.remoteness > b.remoteness) {
            return 1;
          } else {
            return 0;
          }
        }
      } else {
        if (a.value === "win") {
          return -1;
        }
        if (b.value === "win") {
          return 1;
        }
        if (a.value === "tie") {
          return -1;
        }
        if (b.value === "tie") {
          return 1;
        }
      }
    });
  };

  Game.prototype.getUrlTail = function(board) {
    var k, retval, v, _ref, _ref1;
    retval = "";
    if (this.isC()) {
      retval = "?";
      _ref = this.params;
      for (k in _ref) {
        v = _ref[k];
        retval += "" + k + "=" + v + "&";
      }
      retval += "board=" + escape(board);
    } else {
      retval = "";
      _ref1 = this.params;
      for (k in _ref1) {
        v = _ref1[k];
        retval += ";" + k + "=" + v;
      }
      retval += ";board=" + escape(board);
    }
    return retval;
  };

  Game.prototype.getBoardValues = function(board, notifier) {
    var me, requestUrl;
    requestUrl = this.baseUrl + this.gameName + "/getMoveValue" + this.getUrlTail(board);
    me = this;
    if (this.newBoardData != null) {
      return;
    }
    return $.ajax(requestUrl, {
      dataType: "json",
      success: function(data) {
        console.log("getboardValues success");
        me.newBoardData = data;
        return me.finishBoardUpdate();
      }, 
      error: function(data) {
        console.log("Get Board Values failed.");
      }
    });
  };

  Game.prototype.getPossibleMoves = function(board, notifier) {
    var me, requestUrl;
    requestUrl = this.baseUrl + this.gameName + "/getNextMoveValues"+ this.getUrlTail(board);
    me = this;
    if (this.newMoves != null) {
      return;
    }
    return $.ajax(requestUrl, {
      dataType: "json",
      success: function(data) {
        me.newMoves = data;
        me.finishBoardUpdate();
      },
      error: function(data) {
        console.log("GetPossible Moves failed");
      }
    });
  };

  Game.prototype.startGame = function() {
    if (this.params["continue-game"] === "yes") {
      console.log("Restoring...");
      this.restoreGameState();
      console.log(this.currentState);
      console.log("Restored");
    }
    return this.updateBoard();
  };

  Game.prototype.fixMoves = function(moves, me) {
    var fixMove, m;
    fixMove = function(m) {
      if (me.isC()) {
        if (m.value === "win") {
          m.value = "lose";
        } else if (m.value === "lose") {
          m.value = "win";
        }
      }
      return m;
    };
    moves = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = moves.length; _i < _len; _i++) {
        m = moves[_i];
        _results.push(fixMove(m));
      }
      return _results;
    })();
    console.log(moves);
    return moves;
  };

  Game.prototype.finishBoardUpdate = function() {
    var call, me, _ref, _ref1;
   if (!this.newBoardData || !this.newMoves) {
      return;
     }
     if ((_ref = GCAPI.console) != null) {
       _ref.log(this.newBoardData);
     }
    this.currentState = {};
    if (this.newBoardData.status === "ok" && this.newMoves.status === "ok") {
        this.boardData = this.newBoardData.response;
        this.currentState.board = this.boardData;
    //   $(this.statusBar).html("" + (this.getPlayerName()) + " " + this.boardData.value + " in " + this.boardData.remoteness);
      if ((_ref1 = GCAPI.console) != null) {
        _ref1.log("Drawing board state '" + this.currentState.board.board + "'");
      }
        this.notifier.drawBoard(this.currentState.board.board,this);

       this.currentState.moves = this.newMoves.response;
       console.log(this.newMoves.response);
       this.notifier.drawMoves(this.fixMoves(this.newMoves.response, this), this);
    }
 //   this.drawVVH();
 //    if (this.getPlayerType() === "computer") {
 //      me = this;
 //      call = function() {
 //        if (!!me.newMoves) {
 //          return me.playAsComputer(me.newMoves.response);
 //        }
 //      };
 //      return setTimeout(call, 500);
 //    } else {
      return $(this.coverCanvas).hide();
 //    }
  };

  Game.prototype.updateBoard = function() {
    $(this.coverCanvas).show();
    $(game.notifier.canvas).removeLayers();
    return this.startBoardUpdate();
  };

   Game.prototype.startBoardUpdate = function() {
    this.newBoardData = null;
    this.newMoves = null;
    //console.log("'"+this.currentState.board.board+"'");
    this.getBoardValues(this.currentState.board.board);
   return this.getPossibleMoves(this.currentState.board.board);
  };

  Game.prototype.makeMove = function(move) {
    var _ref;
    if ((_ref = GCAPI.console) != null) {
    //  _ref.log("Player '" + (this.getPlayerName()) + "' making move");
    }
    //this.advancePlayer();
    this.previousStates.push(this.currentState);
    this.nextStates = [];
    this.currentState = {
      board: move
    };
    return this.updateBoard();
  };

  Game.prototype.getCursorPosition = function(e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
      x = e.pageX;
      y = e.pageY;
    } else {
       x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
       y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
      x -= this.notifier.canvasElement.offsetLeft;
      y -= this.notifier.canvasElement.offsetTop;
      return {xpos: x, ypos: y};
  };

  return Game;
})();