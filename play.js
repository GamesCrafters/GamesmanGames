
$(document).ready(function() {
jQuery.fn.extend({
  startGame: function(params) {
    var initialBoard, notify;
    $("#game").html("<canvas id='GCAPI-main' />\n<div id='GCAPI-noclick' />\n<canvas id='GCAPI-control' />\n<canvas id='GCAPI-vvh' />\n<div id='GCAPI-status' />");
    window.mainCanvas = document.getElementById('GCAPI-main');
    window.coverCanvas = document.getElementById('GCAPI-noclick');
    window.controlPanel = document.getElementById('GCAPI-control');
    window.vvhPanel = document.getElementById('GCAPI-vvh');
    $(mainCanvas).css('display', 'block');
    $(mainCanvas).css('position', 'absolute');
    $(coverCanvas).css('display', 'none');
    $(coverCanvas).css('z-index', '1000');
    $(coverCanvas).css('background-color', 'rgba(255,255,255,.5)');
    $(coverCanvas).css('position', 'absolute');
    $(controlPanel).css('display', 'block');
    $(controlPanel).css('position', 'absolute');
    $(controlPanel).css('left', '0px');
    $(vvhPanel).css('display', 'none');
    $(vvhPanel).css('position', 'absolute');
    $(this).css('width', window.innerWidth);
    $(this).css('height', window.innerHeight);
    $('#GCAPI-status').css('position', 'absolute');
    $('#GCAPI-status').css('bottom', '0px');
    $('#GCAPI-status').css('text-align', 'center');
    $('#GCAPI-status').css('width', '100%');
    $('#GCAPI-status').css('height', '20px'); 
    //temp setting

    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    params = {
      p1: vars['p1'],
      p2: vars['p2'],
      width: vars['width'],
      height: vars['height']
    };
    //initialBoard = game.getInitialBoard(params);
    notify = new game.notifier(window.mainCanvas, params);
    window.gameController = new GCAPI.Game(game.asset, params, notify, coverCanvas, '#GCAPI-status', vvhPanel);
    window.uiController = new GCAPI.Ui(gameController, mainCanvas, controlPanel, vvhPanel, coverCanvas, '#GCAPI-status', this, GCAPI.getAspectRatio(params));
    return uiController.startGame();
  }
});



});
