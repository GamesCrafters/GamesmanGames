var Game, reduce,
__indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty;;

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

  function Game(name, parameters, notifierClass, coverCanvas, statusBar, vvhPanel) {
    this.coverCanvas = coverCanvas;
    this.statusBar = statusBar;
    this.vvhPanel = vvhPanel;
    this.gameName = name;
    this.params = parameters;
    this.notifier = notifierClass;
    this.startBoard = [];
    this.allStates = [];
    //this.nextStates = [];
    this.currentState = {
      board: {
        board: ""
      },
      moves: []
    };
    this.moveNum = 0;
    this.width = this.params['width'];
    this.height = this.params['height'];
    this.baseUrl = "http://nyc.cs.berkeley.edu:8080/gcweb/service/gamesman/puzzles/";
    this.showValueMoves = false;
    this.currentPlayer = 0;
    if (this.params["fake"]) {
      this.fakeIt();
    }
    if (game.type === "c") {
      this.useC();
    }

    //TEMPORARY COMPUTER PLAYER
    this.p1Comp = false;
    this.p2Comp = false;
    if (this.params["p1"] == 'comp') {
      this.p1Comp = true;
    }
    if (this.params["p2"] == 'comp') {
      this.p2Comp = true;
    }

  }

  Game.prototype.fakeIt = function() {
    return this.baseUrl = "/fake/";
  };

  Game.prototype.useC = function() {
    return this.baseUrl = "http://nyc.cs.berkeley.edu:8081/";
  };

  Game.prototype.isC = function() {
    return this.baseUrl === "http://nyc.cs.berkeley.edu:8081/";
  };

  Game.prototype.updateSettings = function() {
    var base, here, params;

    this.storeGameState();
    here = window.location;
    console.log("here is here---------------------->");
    console.log(here);
    console.log("here is params---------------------->");
    params = here.search;
    console.log(params);
    console.log("here is base---------------------->");


    //base = here.origin + here.pathname.slice(0, -4) + "new";

    base = here.origin + "/startGame.html?game=" + this.gameName;
    console.log(base);
    console.log("here we go---------------------->");
    window.location = base;
    //return window.location = base + params + "&update-settings=true";
  };

   Game.prototype.setDrawProcedure = function(draw) {
    return this.draw = draw;
  };

  Game.prototype.getPlayerName = function(player) {
    var p;
    if (player == null) {
      player = this.currentPlayer;
    }
    p = 'player' + (player + 1);
    if (!!this.params[p]) {
      return this.params[p];
    } else {
      return 'Player ' + (player + 1);
    }
  };

  Game.prototype.getPlayerType = function(player) {
    var n;
    if (player == null) {
      player = this.currentPlayer;
    }
    n = 'p' + (player + 1) + '-type';
    if (!!this.params[n]) {
      return this.params[n];
    } else {
      return 'human';
    }
  };

  Game.prototype.getColor = function(m, moves) {
    var alpha, b, g, move, r, remoteness, remotenesses, _i, _len, _ref;
    console.log("getting value for:");
    console.log(m);
    remoteness = {
      win: [],
      lose: [],
      tie: []
    };
    for (_i = 0, _len = moves.length; _i < _len; _i++) {
      move = moves[_i];
      if (move.value != null) {
        if (_ref = move.remoteness, __indexOf.call(remoteness[move.value], _ref) < 0) {
          remoteness[move.value].push(move.remoteness);
          remoteness[move.value].sort();
          if (move.value === "lose") {
            remoteness[move.value].reverse();
          }
        }
      }
    }
    r = "0";
    g = "0";
    b = "0";
    if (m.value === "win") {
      g = "255";
    } else if (m.value === "tie") {
      r = "255";
      g = "255";
    } else {
      r = "139";
    }
    alpha = ".10";
    console.log(remoteness);
    remotenesses = remoteness[m.value];
    if (remotenesses != null) {
      if (remotenesses.indexOf(m.remoteness) === 0) {
        alpha = "1";
      } else if (remotenesses.indexOf(m.remoteness) === 1) {
        alpha = ".5";
      }
    } else {
      alpha = "0";
    }
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
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

  Game.prototype.advancePlayer = function() {
    return this.currentPlayer = this.nextPlayer();
  };

  Game.prototype.nextPlayer = function(player) {
    if (player == null) {
      player = this.currentPlayer;
    }
    return (player + 1) % 2;
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

  Game.prototype.playAsComputer = function(moves) {
    console.log("COMPUTER SHOULD MOVE");
   // move = GCAPI.Game.getMove(moves);
    moves = GCAPI.Game.sortMoves(moves);
    if (moves[0] != null) {
      return this.makeMove(moves[0]);
    }
  };

   Game.getMove = function(moveList) {
    for (var i=0; i< moveList.length; i++) {
      curMove = moveList[i];
      if (i == 0) {
        bestMove = moveList[i];
      } else {
        if (bestMove.value == 'win') {
          if (curMove.value == 'win' && curMove.remoteness < bestMove.remoteness) {
            bestMove = curMove;
          }
        } else if (bestMove.value == 'tie') {
          if (curMove.value == 'win' || (curMove.value == 'tie' && curMove.remoteness < bestMove.remoteness)) {
            bestMove = curMove;
          }
        } else {
          if (curMove.value == 'win' || curMove.value == 'tie' || (curMove.value == 'lose' && curMove.remoteness < bestMove.remoteness)) {
            bestMove = curMove;
          }
        }
      }
    }
    return bestMove.move;
  };
  Game.prototype.canUndo = function() {
    return this.allStates.length > 0;
  };

  Game.prototype.undo = function() {
    var pcType, pnType;
    if (this.canUndo()) {
      this.moveNum--;
      pcType = this.getPlayerType();
      pnType = this.getPlayerType(this.nextPlayer());
      if ((pcType === pnType && pnType === "computer")) {
        while (this.canUndo()) {
          this.advancePlayer();
          this.currentState = this.allStates[this.moveNum];         // this.nextStates.push(this.currentState);
          //this.currentState = this.pallStates.pop();
        }
      } else if (pcType === "computer" || pnType === "computer" && this.previousBoards.length >= 2) {
        //this.nextStates.push(this.currentState);
       // this.nextStates.push(this.allStates.pop());
        this.currentState = this.allStates.pop();
      } else {
        console.log(this.moveNum);
        this.advancePlayer();
        //this.nextStates.push(this.currentState);
        this.currentState = this.allStates[this.moveNum];
      }
      return this.updateBoard();
    }
  };

  Game.prototype.canRedo = function() {
    return this.allStates.length > 0;
  };

  Game.prototype.redo = function() {
    if (this.canRedo()) {
      this.advancePlayer();
     // this.previousStates.push(this.currentState);
     this.moveNum++;
     console.log("redo: "+this.moveNum);
      this.currentState = this.allStates[this.moveNum];
      return this.updateBoard();
    }
  };


  Game.prototype.startGame = function() {
    console.log("Starting game");
    if (this.params["continue-game"] === "yes") {
      console.log("Restoring...");
      this.restoreGameState();
      console.log(this.currentState);
      console.log("Restored");
      return this.updateBoard();
    } else {
      return this.getStart();
     }
  };

  Game.prototype.makeMove = function(move) {
    var _ref;
    if ((_ref = GCAPI.console) != null) {
      _ref.log("Player '" + (this.getPlayerName()) + "' making move");
    }
    this.advancePlayer();
    this.allStates[moveNum] = this.currentState;
    this.currentState = {
      board: move
    };
    return this.updateBoard();
  };

  Game.prototype.getMoveHistory = function() {
    var retval, state, _i, _len, _ref;
    retval = [];
    _ref = this.allStates;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      state = _ref[_i];
      retval.push(state);
    }
    retval.push(this.currentState);
    return retval;
  };

  Game.prototype.storeGameState = function() {

    $.cookie();
    console.log("successful")

    $.cookie("GCAPI-currentState", JSON.stringify(this.currentState), {
      path: '/'
    });
    $.cookie("GCAPI-previousStates", JSON.stringify(this.allStates), {
      path: '/'
    });
    return $.cookie("GCAPI-nextStates", JSON.stringify(this.nextStates), {
      path: '/'
    });
  };

  Game.prototype.restoreGameState = function() {
    var cs, ns, ps;
    cs = $.cookie("GCAPI-currentState");
    ps = $.cookie("GCAPI-previousStates");
    ns = $.cookie("GCAPI-nextStates");
    console.log(cs);
    console.log(ps);
    console.log(ns);
    if ((cs != null) && (ps != null) && (ns != null)) {
      this.currentState = JSON.parse(cs);
      this.allStates = JSON.parse(ps);
      return this.nextStates = JSON.parse(ns);
    }
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
      var i, len, results;
      results = [];
      for (i = 0, len = moves.length; i < len; i++) {
        m = moves[i];
        results.push(fixMove(m));
      }
      return results;
    })();
    console.log("Fix moves result: " + moves);
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
      console.log(this.notifier);
      this.notifier.drawBoard(this.currentState.board.board,this);

       this.currentState.moves = this.newMoves.response;
       //console.log(this.newMoves.response);
       if ((this.currentPlayer == 1 && this.p2Comp) || (this.currentPlayer == 0 && this.p1Comp)) {
          this.playAsComputer(this.fixMoves(this.newMoves.response, this));
       } else {
        this.notifier.drawMoves(this.fixMoves(this.newMoves.response, this), this);
      }
    }
    // this.drawVVH();
    //  if (this.getPlayerType() === "computer") {
    //    me = this;
    //    call = function() {
    //      if (!!me.newMoves) {
    //        return me.playAsComputer(me.newMoves.response);
    //      }
    //    };
    //    return setTimeout(call, 500);
    //  } else {
    if (this.gameOver(this.newMoves)) {
      console.log("game over");
    }
    return $(this.coverCanvas).hide();
   //  }
  };

  Game.prototype.updateBoard = function() {
    //$(this.coverCanvas).show();
    //console.log("PRINTINGBOARD"+this.currentBoard.board);
    $(game.notifier.canvas).removeLayers();
      return this.startBoardUpdate();
  };

  Game.prototype.gameOver = function(moves) {
    //console.log("Checking if end game: " + moves)
    if (moves.response != null) {
      for (i=0; i < moves.response.length; i++) {
       if(moves.response[i].remoteness != 0) {
         return false;
       }
     }
     return true;
    }
    return false;
  };

   Game.prototype.startBoardUpdate = function() {
    this.newBoardData = null;
    this.newMoves = null;
    console.log("STARTING BOARD UPDATE");
    $(this.coverCanvas).show();
    this.getBoardValues(this.currentState.board.board);
   return this.getPossibleMoves(this.currentState.board.board);
  };

  Game.prototype.makeMove = function(move) {
    var _ref;
    if ((_ref = GCAPI.console) != null) {
    //  _ref.log("Player '" + (this.getPlayerName()) + "' making move");
    }
    this.advancePlayer();
    console.log("make move: "+this.moveNum);
    this.allStates[this.moveNum] = this.currentState;
    this.moveNum++;
    //this.nextStates = [];
    this.currentState = {
      board: move
    };
    return this.updateBoard();
  };

  Game.prototype.getStart = function() {
    var me, requestUrl;
    requestUrl = this.baseUrl + this.gameName + "/getStart";
    me = this;
    return $.ajax(requestUrl, {
      dataType: "json",
      success: function(data) {
        me.startBoard = data.response;
        me.currentState = {
        board: {
          board: me.startBoard
        }
      }
        return me.updateBoard();
      },
      error: function(data) {
        return console.log("Could not get start board.");
      }
    });
  };

  Game.prototype.drawVVH = function() {
    return drawVVH(this.vvhPanel, this.getMoveHistory());
  };

  Game.prototype.getNotifier = function() {
    return this.notifier;
  };

  Game.prototype.toggleValueMoves = function() {
    this.showValueMoves = !this.showValueMoves;
    return this.updateBoard();
  };

  Game.prototype.drawArrow = function(x, y, len, theta) {
    return $("canvas").drawLine({
      fillStyle: "#000",
      x1: x,
      y1: y,
      x2: x + len / 6 * Math.sin(theta),
      y2: y - len / 6 * Math.cos(theta),
      x3: x + 2 / 3 * len * Math.cos(theta) + len / 6 * Math.sin(theta),
      y3: y - len / 6 * Math.cos(theta) + 2 / 3 * len * Math.sin(theta),
      x4: x + 2 / 3 * len * Math.cos(theta) + len / 3 * Math.sin(theta),
      y4: y - len / 3 * Math.cos(theta) + 2 / 3 * len * Math.sin(theta),
      x5: x + len * Math.cos(theta) + len / 12 * Math.sin(theta),
      y5: y - len / 12 * Math.cos(theta) + len * Math.sin(theta),
      x6: x + 2 / 3 * len * Math.cos(theta) - len / 6 * Math.sin(theta),
      y6: y + len / 6 * Math.cos(theta) + 2 / 3 * len * Math.sin(theta),
      x7: x + 2 / 3 * len * Math.cos(theta),
      y7: y + 2 / 3 * len * Math.sin(theta),
      x8: x,
      y8: y
    });
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
