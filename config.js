var $,
  __hasProp = {}.hasOwnProperty;

$ = jQuery;

$.fn.extend({
  getConfigure: function(options) {
    var c, contents, gameInfo, info, log, makeInput, makeRange, name, settings;
    settings = {
      debug: false
    };
    settings = $.extend(settings, options);
    log = function(msg) {
      if (settings.debug) {
        return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
      }
    };
    c = this.first();
    contents = "";
    makeRange = function(n, i) {
      var description, ival, retval, selected, v, value, _i, _len, _ref;
      v = i.values;
      description = i.desc;
      retval = '';
      retval += '<div class="three columns end">';
      retval += description;
      retval += "<select id='custom" + n + "' name='" + n + "' >";
      ival = parseInt(configurationHash[n]);
      _ref = i.values;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        value = _ref[_i];
        selected = ival === value ? "selected='selected'" : "";
        retval += ("<option " + selected + " value='") + value + "'>" + value + "</option>";
      }
      retval += "</select>";
      retval += "</div>";
      return retval;
    };
    makeInput = function() {
      var retval;
      retval = "";
      return retval;
    };
    gameInfo = "";
    for (name in settings) {
      if (!__hasProp.call(settings, name)) continue;
      info = settings[name];
      if (typeof info === "object") {
        switch (info.type) {
          case "integer":
            gameInfo += makeRange(name, info);
        }
      }
    }
    contents = "<form action='play' class='custom'>\n  <fieldset>\n    <legend>Player Info</legend>\n    <div class=\"row\">\n      <div class=\"three columns\">\n        <input type='text' name='player1' " + (configurationHash["player1"] ? "value='" + configurationHash["player1"] + "'" : void 0) + " placeholder='Player 1 Name' />\n      </div>\n      <div class=\"three columns\">\n        <div class=\"row collapse\">\n          <div class=\"six columns\">\n            <a class='" + (configurationHash['p1-type'] === 'computer' ? "secondary" : void 0) + " button expand prefix' id='p1-human'>Human</a>\n          </div>\n          <div class=\"six columns\">\n            <a class='" + (configurationHash['p1-type'] !== 'computer' ? "secondary" : void 0) + " button expand prefix' id='p1-comp'>Computer</a>\n          </div>\n        </div>\n      </div>\n      <div class=\"three columns\">\n        <input type='text' name='player2' " + (configurationHash["player2"] ? "value='" + configurationHash["player2"] + "'" : void 0) + " placeholder='Player 2 Name' />\n      </div>\n      <div class=\"three columns\">\n        <div class=\"row collapse\">\n          <div class=\"six columns\">\n            <a class='" + (configurationHash['p2-type'] === 'computer' ? "secondary" : void 0) + " button expand prefix' id='p2-human'>Human</a>\n          </div>\n          <div class=\"six columns\">\n            <a class='" + (configurationHash['p2-type'] !== 'computer' ? "secondary" : void 0) + " button expand prefix' id='p2-comp'>Computer</a>\n          </div>\n        </div>\n      </div>\n    </div>\n  </fieldset>\n  <fieldset>\n    <legend>Game Info</legend>\n    " + gameInfo + "\n  </fieldset>\n  <input type=\"hidden\" name=\"p1-type\" id=\"p1-type\" value=\"" + (configurationHash['p1-type'] === "computer" ? "computer" : "human") + "\" />\n  <input type=\"hidden\" name=\"p2-type\" id=\"p2-type\" value=\"" + (configurationHash['p2-type'] === "computer" ? "computer" : "human") + "\" />\n  <input type=\"hidden\" name=\"continue-game\" id=\"continue-game\" value=\"" + (configurationHash['update-settings'] != null ? "yes" : "no") + "\" />\n  <input class=\"button\" type=\"submit\" value=\"" + (configurationHash['update-settings'] != null ? "Continue Game" : "Let's Play!") + "\" />\n  " + (configurationHash['update-settings'] ? '<input class="button" type="submit" id="restartButton" value="New Game" />' : '') + "\n</form>";
    c.html(contents);
    $('#p1-human').click(function(event) {
      $('#p1-human').removeClass('secondary');
      $('#p1-comp').addClass('secondary');
      return $('#p1-type').val('human');
    });
    $('#p1-comp').click(function(event) {
      $('#p1-human').addClass('secondary');
      $('#p1-comp').removeClass('secondary');
      return $('#p1-type').val('computer');
    });
    $('#p2-human').click(function(event) {
      $('#p2-human').removeClass('secondary');
      $('#p2-comp').addClass('secondary');
      return $('#p2-type').val('human');
    });
    $('#p2-comp').click(function(event) {
      $('#p2-human').addClass('secondary');
      $('#p2-comp').removeClass('secondary');
      return $('#p2-type').val('computer');
    });
    $('#restartButton').click(function(event) {
      return $('#continue-game').val('no');
    });
    return this;
  }
});

window.ensureConfigParameters = function() {
  var problems;
  problems = [];
  if (!(window.game != null)) {
    problems.push("You Must Create a window.game object in your game file");
  } else {
    if (!(window.game.title != null)) {
      problems.push("You must define a window.game.title string with the title of the game");
    }
    if (!(window.game.asset != null)) {
      problems.push("You must define a window.game.asset string with the asset name. This should be the same as the name of the js file, and any image assets");
    }
    if (!(window.game.parameters != null)) {
      problems.push("You must define a parameters object. Please refer to ttt.js.coffee for an example of this");
    }
  }
  if (problems.length > 0) {
    alert(problems.join("\n\n"));
    return false;
  }
  return true;
};
