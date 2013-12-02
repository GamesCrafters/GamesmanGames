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

  Game.prototype.getBoardValues = function(board, notifier) {
    var me, requestUrl;
    requestUrl = this.baseUrl + this.gameName + "/getMoveValue?board=" + board;
    me = this;
    if (this.newBoardData != null) {
      return;
    }
    return $.ajax(requestUrl, {
      dataType: "json",
      success: function(data) {
        me.newBoardData = data;
        return me.finishBoardUpdate();
      }, 
      error: function(data) {
        console.log("Get Board Values failed.");
      }
    });
  };

  Game.prototype.getPossibleMoves = function(board, notifier) {
   this.notifier.drawBoard(this.currentState.board.board,this);
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

  Game.prototype.finishBoardUpdate = function() {
    var call, me, _ref, _ref1;
    if (!this.newBoardData || !this.newMoves) {
      return;
     }
     if ((_ref = GCAPI.console) != null) {
       _ref.log(this.newBoardData);
     }
     console.log(this.newBoardData);
    this.currentState = {};
    if (this.newBoardData.status === "ok" && this.newMoves.status === "ok") {
        this.boardData = this.newBoardData.response;
        this.currentState.board = this.boardData;
    //   $(this.statusBar).html("" + (this.getPlayerName()) + " " + this.boardData.value + " in " + this.boardData.remoteness);
      if ((_ref1 = GCAPI.console) != null) {
        _ref1.log("Drawing board state '" + this.currentState.board.board + "'");
      }
        this.drawBoard(this.currentState.board.board,this);
       this.currentState.moves = this.newMoves.response;
       this.notifier.drawMoves();
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
    this.getBoardValues(this.currentState.board.board);
   return this.getPossibleMoves(this.currentState.board.board);
  };

  return Game;
})();