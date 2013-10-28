
window.drawVVH = function(canvas, moveList) {
  var c, cenPad, colSpace, disTop, dotDefault, draw, drawDot, drawDots, drawGrid, drawLine, grid, horCen, lineColor, linePadding, linecolor, loseC, maxH, maxRemote, maxVal, maxW, padx, pady, prevBestMoveVal, prevBestMoveX, prevBestMoveY, rowSpace, setFinalBestMove, setLineColor, setTempBestMove, setTurnNum, sketchLine, tempBestMoveVal, tempBestMoveX, tempBestMoveY, tempMoveVal, tempMoveX, tempMoveY, textcolor, tieC, turnNum, turnPadding, winC, xLabelPad, xlabel, yLabelPad, ylabel;
  c = canvas;
  turnNum = 0;
  maxRemote = null;
  lineColor = null;
  tempBestMoveVal = null;
  prevBestMoveVal = null;
  tempMoveVal = null;
  tempMoveX = null;
  tempMoveY = null;
  maxH = c.height;
  maxW = c.width;
  horCen = maxW / 2;
  tempBestMoveX = null;
  tempBestMoveY = null;
  prevBestMoveX = null;
  prevBestMoveY = null;
  colSpace = null;
  rowSpace = null;
  padx = 15;
  pady = 5;
  disTop = 25;
  xLabelPad = disTop - 5;
  yLabelPad = disTop + 3;
  cenPad = 10;
  dotDefault = disTop + 3;
  turnPadding = 25;
  linePadding = disTop + 2.5;
  tieC = "rgb(255, 255, 0)";
  winC = "rgb(0, 127, 0)";
  loseC = "rgb(139, 0, 0)";
  textcolor = "white";
  linecolor = "white";
  /*
          Determines which turn it is
  */

  setTurnNum = function() {
    return turnNum = moveList.length - 1;
  };
  /*
          Gets the color of the selected move to use in drawing the line between
          points on the VVH. Because the turns alternate, in order to draw the
          line with the correct color, it's necessary to invert the color.
  */

  setLineColor = function(turn) {
    tempMoveVal = moveList[turn].board.value;
    if (tempMoveVal === "lose") {
      return lineColor = "win";
    } else if (tempMoveVal === "win") {
      return lineColor = "lose";
    } else {
      return lineColor = tempMoveVal;
    }
  };
  /*
          Sets the tempBestMove variable values to those associated
          with the best move of the turn passed in. Add one to the 
          remoteness value to account for difference in indexing.
  */

  setTempBestMove = function(turn) {
    var i, loopTempVal, loopTempX;
    loopTempX = null;
    loopTempVal = null;
    tempBestMoveY = turn;
    i = 0;
    /*
                    console.log turnNum
                    console.log i
                    console.log moveList
    */

    tempMoveVal = moveList[turn].moves[i].value;
    tempMoveX = moveList[turn].moves[i].remoteness;
    i += 1;
    while (i < moveList[turn].moves.length) {
      loopTempX = moveList[turn].moves[i].remoteness;
      loopTempVal = moveList[turn].moves[i].value;
      if (tempMoveVal === "lose") {
        if (loopTempVal === "lose") {
          if (loopTempX > tempMoveX) {
            tempMoveX = loopTempX;
          }
        } else if (loopTempVal === "tie") {
          tempMoveX = loopTempX;
          tempMoveVal = loopTempVal;
        } else {
          tempMoveX = loopTempX;
          tempMoveVal = loopTempVal;
        }
      } else if (tempMoveVal === "tie") {
        if (loopTempVal === "win") {
          tempMoveX = loopTempX;
          tempMoveVal = loopTempVal;
        }
      } else {
        if (loopTempVal === "win") {
          if (loopTempX < tempMoveX) {
            tempMoveX = loopTempX;
          }
        }
      }
      i += 1;
    }
    tempBestMoveX = tempMoveX + 1;
    return tempBestMoveVal = tempMoveVal;
  };
  setFinalBestMove = function() {
    tempBestMoveX -= 1;
    return tempBestMoveVal = "lose";
  };
  /*
          Determines the maximum number of moves until the endgame based on the initial
          moveList passed in. Add two to the largest value in the initial moveList so
          that there are (largest value in moveList) number of spots on each side of
          the grid's center line
  */

  maxVal = function() {
    var i;
    i = 0;
    maxRemote = moveList[0].moves[i].remoteness;
    i += 1;
    while (i < moveList[0].moves.length) {
      if (moveList[0].moves[i].remoteness > maxRemote) {
        maxRemote = moveList[0].moves[i].remoteness;
      }
      i += 1;
    }
    return maxRemote += 2;
  };
  /*
          Draws the x-labels displaying how many moves until win for each
          player.
  */

  xlabel = function() {
    var ctx, i, j, label;
    ctx = c.getContext("2d");
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = textcolor;
    label = maxRemote;
    i = horCen;
    j = horCen;
    ctx.fillText("D", horCen, 10);
    while (label >= 0) {
      if (label % rowSpace === 0) {
        ctx.fillText(label, i, xLabelPad);
        ctx.fillText(label, j, xLabelPad);
      }
    }
    i += colSpace;
    j -= colSpace;
    return label--;
  };
  /*
          Draws the y-labels along the side of the grid, one
          value at a time.
  */

  ylabel = function(turn) {
    var ctx, label;
    ctx = c.getContext("2d");
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = textcolor;
    label = turn + 1;
    ctx.fillText(label, pady, yLabelPad + (turn * turnPadding));
    return ctx.fillText(label, maxW - pady, yLabelPad + (turn * turnPadding));
  };
  /*
          Draws the gridlines
  */

  grid = function() {
    var adjRemote, ctx, i, j, label, _results;
    i = horCen;
    j = horCen;
    adjRemote = null;
    if (maxRemote > 15) {
      adjRemote = maxRemote / 10;
      colSpace = (horCen - padx) / adjRemote;
    } else {
      adjRemote = maxRemote;
    }
    ctx = c.getContext("2d");
    ctx.strokeStyle = linecolor;
    ctx.lineWidth = 1;
    label = adjRemote;
    while (label >= 0) {
      ctx.moveTo(i, disTop);
      ctx.lineTo(i, maxH - pady);
      ctx.stroke();
      i += colSpace;
      label -= 1;
    }
    label = adjRemote;
    _results = [];
    while (label >= 0) {
      ctx.moveTo(j, disTop);
      ctx.lineTo(j, maxH - pady);
      ctx.stroke();
      j -= colSpace;
      _results.push(label -= 1);
    }
    return _results;
  };
  /*
          Draws the gridlines as well as the x-labels across the top.
  */

  drawGrid = function() {
    colSpace = (horCen - padx) / maxRemote;
    rowSpace = Math.floor(maxRemote / 4);
    xlabel();
    return grid();
  };
  /*
          Draws individual dots based on the remoteness, the move value,
          and the turn number.
  */

  drawDot = function(remoteness, value, turn) {
    var color, ctx, radius, turnRemote, xpos, ypos;
    color = null;
    xpos = null;
    ypos = dotDefault + (turnPadding * turn);
    turnRemote = remoteness;
    radius = 5;
    ctx = c.getContext("2d");
    if (value === "win") {
      color = winC;
    } else if (value === "lose") {
      color = loseC;
    } else {
      color = tieC;
    }
    if (value === "tie") {
      xpos = horCen + ((maxRemote - turnRemote) * colSpace);
      ctx.beginPath();
      ctx.arc(xpos, ypos, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.stroke();
      xpos = horCen - ((maxRemote - turnRemote) * colSpace);
      ctx.beginPath();
      ctx.arc(xpos, ypos, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      return ctx.stroke();
    } else if (turn % 2 === 0) {
      if (value === "lose") {
        xpos = horCen + ((maxRemote - turnRemote) * colSpace);
      } else {
        xpos = horCen - ((maxRemote - turnRemote) * colSpace);
      }
      ctx.beginPath();
      ctx.arc(xpos, ypos, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      return ctx.stroke();
    } else {
      if (value === "lose") {
        xpos = horCen - ((maxRemote - turnRemote) * colSpace);
      } else {
        xpos = horCen + ((maxRemote - turnRemote) * colSpace);
      }
      ctx.beginPath();
      ctx.arc(xpos, ypos, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      return ctx.stroke();
    }
  };
  /*
          Handles drawing all of the dots necessary for the given turn.
  */

  drawDots = function(turn) {
    if (turn !== 0) {
      drawDot(prevBestMoveX, prevBestMoveVal, turn - 1);
    }
    console.log(tempBestMoveX, tempBestMoveVal);
    drawDot(tempBestMoveX, tempBestMoveVal, turn);
    return ylabel(turn);
  };
  /*
          Slaps one line onto the grid.
  */

  sketchLine = function(startX, endX, startY, endY, color) {
    var ctx;
    ctx = c.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    return ctx.stroke();
  };
  /*
          Draws a colored line based using data from the previous move as well as
          the most recent move
  */

  drawLine = function(lineVal, turn) {
    var color, firstPlayerEnd, firstPlayerStart, secondPlayerEnd, secondPlayerStart, xend, xstart, yend, ystart;
    xstart = null;
    xend = null;
    ystart = linePadding + (prevBestMoveY * turnPadding);
    yend = linePadding + (tempBestMoveY * turnPadding);
    firstPlayerStart = horCen + ((maxRemote - prevBestMoveX) * colSpace);
    secondPlayerStart = horCen - ((maxRemote - prevBestMoveX) * colSpace);
    firstPlayerEnd = horCen - ((maxRemote - tempBestMoveX) * colSpace);
    secondPlayerEnd = horCen + ((maxRemote - tempBestMoveX) * colSpace);
    color = null;
    if (lineVal === "win") {
      color = winC;
    } else if (lineVal === "lose") {
      color = loseC;
    } else {
      color = tieC;
    }
    if (prevBestMoveVal === "tie") {
      if (tempBestMoveVal === "tie") {
        xstart = firstPlayerStart;
        xend = secondPlayerEnd;
        sketchLine(xstart, xend, ystart, yend, color);
        xstart = secondPlayerStart;
        xend = firstPlayerEnd;
        return sketchLine(xstart, xend, ystart, yend, color);
      } else if (turn % 2 === 0) {
        xstart = firstPlayerStart;
        xend = firstPlayerEnd;
        sketchLine(xstart, xend, ystart, yend, color);
        xstart = secondPlayerStart;
        xend = firstPlayerEnd;
        return sketchLine(xstart, xend, ystart, yend, color);
      } else {
        xstart = firstPlayerStart;
        xend = secondPlayerEnd;
        sketchLine(xstart, xend, ystart, yend, color);
        xstart = secondPlayerStart;
        xend = secondPlayerEnd;
        return sketchLine(xstart, xend, ystart, yend, color);
      }
    } else if (tempBestMoveVal === "tie") {
      if (turn % 2 === 0) {
        xstart = firstPlayerStart;
        xend = firstPlayerEnd;
        sketchLine(xstart, xend, ystart, yend, color);
        xstart = firstPlayerStart;
        xend = secondPlayerEnd;
        return sketchLine(xstart, xend, ystart, yend, color);
      } else {
        xstart = secondPlayerStart;
        xend = secondPlayerEnd;
        sketchLine(xstart, xend, ystart, yend, color);
        xstart = secondPlayerStart;
        xend = firstPlayerEnd;
        return sketchLine(xstart, xend, ystart, yend, color);
      }
    } else if (prevBestMoveVal === "win") {
      if (lineVal === "win" && turn % 2 === 0) {
        xstart = firstPlayerStart;
        xend = secondPlayerEnd;
      } else if (lineVal === "win" && turn % 2 === 1) {
        xstart = secondPlayerStart;
        xend = firstPlayerEnd;
      } else if (lineVal === "lose" && turn % 2 === 0) {
        xstart = firstPlayerStart;
        xend = firstPlayerEnd;
      } else {
        xstart = secondPlayerStart;
        xend = secondPlayerEnd;
      }
      return sketchLine(xstart, xend, ystart, yend, color);
    } else if (prevBestMoveVal === "lose") {
      if (lineVal === "lose" && turn % 2 === 0) {
        xstart = secondPlayerStart;
        xend = firstPlayerEnd;
      } else if (lineVal === "lose" && turn % 2 === 1) {
        xstart = firstPlayerStart;
        xend = secondPlayerEnd;
      } else if (lineVal === "win" && turn % 2 === 0) {
        xstart = secondPlayerStart;
        xend = secondPlayerEnd;
      } else {
        xstart = firstPlayerStart;
        xend = firstPlayerEnd;
      }
      return sketchLine(xstart, xend, ystart, yend, color);
    }
  };
  /*
          Updates the VVH after every turn.
  */

  draw = function() {
    var ctx, i, _results, _results1;
    setTurnNum();
    console.log(moveList[turnNum].board.value);
    if (moveList[turnNum].board.remoteness !== 0) {
      ctx = c.getContext("2d");
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, maxW, maxH);
      if (moveList[turnNum].moves.length !== 0) {
        maxVal();
        drawGrid();
        i = 0;
        _results = [];
        while (i < turnNum + 1) {
          setLineColor(i);
          setTempBestMove(i);
          if (i !== 0) {
            drawLine(lineColor, i);
          }
          drawDots(i);
          prevBestMoveX = tempBestMoveX;
          prevBestMoveY = tempBestMoveY;
          prevBestMoveVal = tempBestMoveVal;
          _results.push(i += 1);
        }
        return _results;
      }
    } else if (moveList[turnNum].board.remoteness === 0 && moveList[turnNum - 1].board.remoteness !== 0) {
      ctx = c.getContext("2d");
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, maxW, maxH);
      maxVal();
      drawGrid();
      i = 0;
      _results1 = [];
      while (i < turnNum + 1) {
        setLineColor(i);
        setTempBestMove(i);
        if (i === turnNum) {
          setFinalBestMove();
        }
        if (i !== 0) {
          drawLine(lineColor, i);
        }
        drawDots(i);
        prevBestMoveX = tempBestMoveX;
        prevBestMoveY = tempBestMoveY;
        prevBestMoveVal = tempBestMoveVal;
        _results1.push(i += 1);
      }
      return _results1;
    }
  };
  console.log(moveList);
  draw();
  return draw();
};
