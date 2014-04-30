$(document).ready(function() {
jQuery.fn.extend({
  startGame: function(params) {
    var initialBoard, notify;
    $(this).css('width', window.innerWidth);
    $(this).css('height', window.innerHeight);
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
      height: vars['height'],
      misere: vars['misere']
    };
    
    notify = new game.notifier($('#GCAPI-main')[0], params);
    window.gameController = new GCAPI.Game(game.asset, params, notify, $('#GCAPI-noclick')[0], '#GCAPI-status', $('#GCAPI-vvh')[0]);
    window.uiController = new GCAPI.Ui(gameController, $('#GCAPI-main')[0], $('#GCAPI-control')[0], $('#GCAPI-vvh')[0], $('#GCAPI-noclick')[0], '#GCAPI-status', this, GCAPI.getAspectRatio(params));
    return uiController.startGame();
  }
});



});