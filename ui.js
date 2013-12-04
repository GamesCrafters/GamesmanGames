
window.GCAPI || (window.GCAPI = {});

window.GCAPI.Ui = Ui =  (function() {

  function Ui(game, canvas, controlPanel, vvhPanel, coverCanvas, status, bg, ratio) {
    this.game = game;
    this.canvas = canvas;
    this.controlPanel = controlPanel;
    this.vvhPanel = vvhPanel;
    this.coverCanvas = coverCanvas;
    this.status = status;
    this.bg = bg;
    this.ratio = ratio;
    this._displayVVH = false;
  }

  Ui.prototype.resizeBG = function() {
    this.bg.css('width', window.innerWidth);
    return this.bg.css('height', window.innerHeight);
  };

  Ui.prototype.resizeCanvas = function() {
    var hei1, hei2, hpad, padding, wid1, wid2;
    hpad = ((window.innerHeight / 1.5 / 6) + 10) * 2;
    padding = window.innerHeight * 0.1;
    wid1 = window.innerWidth - hpad;
    hei1 = (wid1 / this.ratio[0]) * this.ratio[1];
    hei2 = window.innerHeight - padding;
    wid2 = (hei2 / this.ratio[1]) * this.ratio[0];
    if (hei1 <= window.innerHeight - padding) {
      this.canvas.width = wid1;
      this.canvas.height = hei1;
      $(this.coverCanvas).width(wid1);
      $(this.coverCanvas).height(hei1);
    } else {
      this.canvas.width = wid2;
      this.canvas.height = hei2;
      $(this.coverCanvas).width(wid2);
      $(this.coverCanvas).height(hei2);
    }
    $(this.canvas).css('top', (window.innerHeight / 2) - (this.canvas.height / 2) - 10);
    $(this.canvas).css('left', (window.innerWidth / 2) - (this.canvas.width / 2));
    $(this.coverCanvas).css('top', (window.innerHeight / 2) - (this.canvas.height / 2) - 10);
    $(this.coverCanvas).css('left', (window.innerWidth / 2) - (this.canvas.width / 2));
    return this.game.updateBoard();
  };

  Ui.prototype.resizeVVH = function() {
    var h, left, w;
    h = window.innerHeight / 1.2;
    w = h / 2;
    left = h / 5.7;
    this.vvhPanel.width = w;
    this.vvhPanel.height = h;
    $(this.vvhPanel).css('left', left);
    $(this.vvhPanel).css('top', (window.innerHeight / 2) - (h / 2));
    $(this.vvhPanel).drawRect({
      layer: true,
      fillStyle: "#000",
      fromCenter: false,
      x: 0,
      y: 0,
      width: w,
      height: h
    });
    //return this.game.drawVVH();
  };

  Ui.prototype.resizeControl = function() {
    var h, me, w, ypos;
    me = this;
    h = window.innerHeight / 1.2;
    w = h / 4.9;
    this.controlPanel.width = w;
    this.controlPanel.height = h;
    $(this.controlPanel).css('top', (window.innerHeight / 2) - (h / 2));
    $(this.controlPanel).removeLayers();
    $(this.controlPanel).drawRect({
      layer: true,
      fillStyle: "#000",
      fromCenter: false,
      x: 0,
      y: 0,
      width: w,
      height: h
    });
    ypos = 5;
    $(this.controlPanel).drawImage({
      source: "/images/undo@2x.png",
      fromCenter: false,
      layer: true,
      x: 5,
      y: ypos,
      width: w - 10,
      height: w - 10,
      click: function(layer) {
        return me.game.undo();
      }
    });
    ypos += (w - 10) + 5;
    $(this.controlPanel).drawImage({
      source: "/images/redo@2x.png",
      fromCenter: false,
      layer: true,
      x: 5,
      y: ypos,
      width: w - 10,
      height: w - 10,
      click: function(layer) {
        return me.game.redo();
      }
    });
    ypos += (w - 10) + 5;
    $(this.controlPanel).drawImage({
      source: "/images/vvh@2x.png",
      fromCenter: false,
      layer: true,
      x: 5,
      y: ypos,
      width: w - 10,
      height: w - 10,
      click: function(layer) {
        $(me.vvhPanel).toggle();
        return me.resizeVVH();
      }
    });
    ypos += (w - 10) + 5;
    $(this.controlPanel).drawImage({
      source: "/images/values@2x.png",
      fromCenter: false,
      layer: true,
      x: 5,
      y: ypos,
      width: w - 10,
      height: w - 10,
      click: function(layer) {
        return me.game.toggleValueMoves();
      }
    });
    ypos += (w - 10) + 5;
    $(this.controlPanel).drawImage({
      source: "/images/settings@2x.png",
      fromCenter: false,
      x: 5,
      y: ypos,
      width: w - 10,
      height: w - 10,
      layer: true,
      click: function(layer) {
        return me.game.updateSettings();
      }
    });
    return ypos += (w - 10) + 5;
  };

  Ui.prototype.startGame = function() {
    var me;
    me = this;
    this.resizeCanvas();
    this.resizeVVH();
    this.resizeBG();
    this.resizeControl();
    $(window).resize(function() {
      me.resizeCanvas();
      me.resizeVVH();
      me.resizeBG();
      return me.resizeControl();
    });
   //return this.game.startGame();
  };

  return Ui;

})();
