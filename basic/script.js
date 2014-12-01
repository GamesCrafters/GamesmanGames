/**
this code was written when I was learning javascript at the same time and in a hurry.
So the code is really ugly and not reusable...

You can find static programing, inefficiency, bad naming everywhere...
*/



var bbs;
var player =1;

$(function () {
  refresh();
  $('#game-input').on('input', refresh);
  $('#position').on('input', function () {
    drawBoard(Snap('#main-svg'), $('#position').val());
  });
});

function refresh() {
  getStart($('#game-input').val(), function (start) {
    $('#position').val(start);
    
    //drawBoard(Snap('#main-svg'), start);
    drawBoard(Snap('#main-svg'), bbs);
  });
}

function getStart(game, callback) {
  //$( "button.continue" ).html( "Next Step..." );
  $.get('http://nyc.cs.berkeley.edu:8081/' + game + '/getStart', function (res) {
    var res = JSON.parse(res);
    callback(res.response);
  });
}

function getNextMoveValues(game, board, callback) {
  //$( "button.continue" ).html( "Next Step..." );
  $.get('http://nyc.cs.berkeley.edu:8081/' + game + '/getNextMoveValues?board="' + board + '"', function (res) {
    var res = JSON.parse(res);
    callback(res.response);
  });
}









/**
*@author shrekshao
* achi board drawing
*/
function drawBoard (svg, boardString) {
  tmpArray = boardString.split(";");
  bbs = tmpArray[0];
  //console(bbs);

  svg.clear();

  var start_x = 100;
  var start_y = 100;
  var big_radius = 30;
  var small_radius = 20;
  var gap_dis = 200;

  

  var box_height = 10;

  var outter_color = '#f7c88b';
  var inner_color = '#d19f5d';




function getMoveOptions(svg,boardString,player){


  //console.log('sssssss');
  var neighbour = [  [1,3,4]
                    ,[0,2,4]
                    ,[1,4,5]
                    ,[0,4,6]
                    ,[0,1,2,3,5,6,7,8]
                    ,[2,4,8]
                    ,[3,4,7]
                    ,[4,6,8]
                    ,[4,5,7]
                    ];

  var piece_remain = 3;

  for(var i = 0; i < 9; i++)
  {
    var c = boardString.charAt(i);
    switch(c)
    {
      case 'o':
        if(player == 1)
        {
          piece_remain--;
          var cn = neighbour[i];
          for(var j = 0;j<cn.length;j++)
          {
            if(boardString.charAt(cn[j]) == ' ')
            {
              //valid move
              var c = i % 3;
              var r = Math.floor(i/3);

              var toc = cn[j] % 3;
              var tor = Math.floor(cn[j]/3);

              drawArrow(svg
                        ,start_x + c * gap_dis,start_y + r * gap_dis
                        ,start_x + toc * gap_dis,start_y + tor * gap_dis
                        ,player,1 , i,cn[j]);
            }
          }
        }
        break;
      case 'x':
        if(player == 2)
        {
          piece_remain--;
          var cn = neighbour[i];
          for(var j = 0;j<cn.length;j++)
          {
            if(boardString.charAt(cn[j]) == ' ')
            {
              //valid move
              var c = i % 3;
              var r = Math.floor(i/3);

              var toc = cn[j] % 3;
              var tor = Math.floor(cn[j]/3);

              drawArrow(svg
                        ,start_x + c * gap_dis,start_y + r * gap_dis
                        ,start_x + toc * gap_dis,start_y + tor * gap_dis
                        ,player,1 , i,cn[j]);
            }
          }
        }
        break;
      case ' ':
      //place piece
        break;
      default:
    }
  }


  if(piece_remain>0)
  {
    for(var i = 0; i < 9; i++)
    {
      var c = boardString.charAt(i);
      if(c == ' ')
      {
        var c = i % 3;
        var r = Math.floor(i/3);
        drawDropPiece(svg,start_x + c * gap_dis,start_y + r * gap_dis,player,1 , i);
      }
    }
  }

}










  //horizontal
  for ( var i = 0; i < 2; i++)
  {
    for ( var j = 0; j < 3; j++)
    {
      var box = svg.rect(start_x + i * gap_dis, start_y + j * gap_dis - box_height / 2, gap_dis, box_height);
      box.attr({fill: outter_color});
    }
  }

  //vertical
  for ( var i = 0; i < 3; i++)
  {
    for ( var j = 0; j < 2; j++)
    {
      var box = svg.rect(start_x + i * gap_dis - box_height / 2, start_y + j * gap_dis, box_height , gap_dis);
      box.attr({fill: outter_color});
    }
  }

  //diagonal
  for (var i = 0; i < 2; i++)
  {
    var positive_diagonal_box = svg.polyline([start_x + i * gap_dis + box_height / 2.828, start_y + i * gap_dis - box_height / 2.828
                                               ,start_x + i * gap_dis - box_height / 2.828, start_y + i * gap_dis + box_height / 2.828
                                               ,start_x + (i+1) * gap_dis - box_height / 2.828, start_y + (i+1) * gap_dis + box_height / 2.828
                                               ,start_x + (i+1) * gap_dis + box_height / 2.828, start_y + (i+1) * gap_dis - box_height / 2.828
                                               ]);

    positive_diagonal_box.attr({ fill : outter_color, stroke : 'none'});

    var negative_diagonal_box = svg.polyline([start_x + i * gap_dis + box_height / 2.828, start_y + (2-i) * gap_dis + box_height / 2.828
                                               ,start_x + i * gap_dis - box_height / 2.828, start_y + (2-i) * gap_dis - box_height / 2.828
                                               ,start_x + (i+1) * gap_dis - box_height / 2.828, start_y + (1-i) * gap_dis - box_height / 2.828
                                               ,start_x + (i+1) * gap_dis + box_height / 2.828, start_y + (1-i) * gap_dis + box_height / 2.828
                                               ]);

    negative_diagonal_box.attr({ fill : outter_color, stroke : 'none'});
  }



  //draw dots
  for ( var i = 0; i < 3; i++)
  {
    for ( var j = 0; j < 3; j++)
    {
      var big_c = svg.circle(start_x + i * gap_dis, start_y + j * gap_dis, big_radius );
      big_c.attr({fill: outter_color});


      var small_c = svg.circle(start_x + i * gap_dis, start_y + j * gap_dis, small_radius );
      small_c.attr({fill: inner_color});


      small_c.row = i;
      small_c.column = j;
      //small_c.click(clickDropPiece);
    }
  }




  //draw pieces

  //parse game string
  //var l = boardString.length;
  l = 9;
  for (var i = 0; i < l; i++)
  {
    var x = i % 3;
    var y = Math.floor(i / 3);
    if (boardString.charAt(i) == 'x')
    {
      drawPiece(svg,start_x + x * gap_dis, start_y + y * gap_dis,2,i);
    }
    else if (boardString.charAt(i)== 'o')
    {
      drawPiece(svg,start_x + x * gap_dis, start_y + y * gap_dis,1,i);
    }
  }

  

  if(checkWin(svg,boardString,3-player))
  {
    //win
    winDisplay(svg);
  }
  else
  {
    getMoveOptions(svg,boardString,player);
  }
  





}

function winDisplay(svg)
{
  var piece_color = ((3-player) == 1) ? 'r()#A8383B-#940004': 'r()#323875-#060F67';

  var c = svg.circle(800, 300, 150 );
  c.attr({fill: piece_color});



var text = 'Win';
// inspired from http://codepen.io/GreenSock/pen/AGzci

var textArray = text.split(" ");
var len = textArray.length;
var timing = 750;

for( var index=0; index < len; index++ ) {

    (function() {

        var svgTextElement = svg.text(1100,300, textArray[index]).attr({ fontSize: '120px', opacity: 0, "text-anchor": "middle" });

        setTimeout( function() {

                Snap.animate( 0, 1, function( value ) {                       // Animate by transform
                    svgTextElement.attr({fill:piece_color, 'font-size': value * 100,  opacity: value });      // Animate by font-size ?
                }, timing, mina.bounce/*, function() { svgTextElement.remove() }*/ );
                            }
        ,index * timing)                
    }());
};
}



function checkWin(svg,boardString,player)
{
  var win_position = [[0,1,2],[3,4,5],[6,7,8]
                      ,[0,3,6],[1,4,7],[2,5,8]
                      ,[0,4,8],[2,4,6]];

  

  //var iswin = false;
  var piece;
  if(player == 1)
  {
    piece = 'o';
  }
  else
  {
    piece = 'x';
  }

  var l = win_position.length;
  for (var i = 0; i < l; i++)
  {
    var iswin = true;
    var ll = win_position[i].length;
    for (var j=0;j<ll;j++)
    {
      if(boardString.charAt(win_position[i][j]) != piece)
      {
        iswin = false;
        break;
      }
    }
    if(iswin == true)
    {
      break;
    }

  }



  return iswin;

}



function drawPiece(svg,x,y,player,at)
{
  var piece_radius = 60;
  var piece_color = (player == 1) ? 'r()#A8383B-#940004': 'r()#323875-#060F67';

  var c = svg.circle(x, y, piece_radius );
  c.attr({fill: piece_color});
  var tmp = "p" + player;
  tmp = tmp + at;

  c.at = at;
  //c.attr("class", "hover_group");
  c.attr({id: tmp});

  
  //c.click(clickCallbackTest);

  //test
  //drawArrow(svg,0,0,0,0,0,0);
}

function drawArrow(svg,sx,sy,ex,ey,player,winvalue , from,to)
{
  var half_width = 8;
  var arrow_length = 80;
  var half_width_pointer = 14;
  var pointer_length =20;
  var arrow_color = 'green';     //TODO

  var box = svg.rect(-half_width,20,2*half_width,arrow_length-20);
  box.attr({fill: arrow_color});

  var pointer = svg.polyline([-half_width_pointer,0
                              ,half_width_pointer,0
                              ,0,pointer_length]);
  pointer.transform('t0,'+(arrow_length-1));
  pointer.attr({fill:arrow_color,stroke:'none'});

  
  var g = svg.group(box,pointer);

  
  //TODO:transform the arrow
  var rotation_angle = Math.atan2(ey-sy,ex-sx)/Math.PI*180 - 90;
  //console.log(rotation_angle,sx,sy,ex,ey);
  //g.transform('t100,100r90,0,0');
  g.transform('t'+sx+','+sy+'r'+rotation_angle+',0,0');
  // pointer.transform('r'+rotation_angle+',0,0');

  // box.transform('t'+sx+','+sy);
  // pointer.transform('t'+sx+','+sy);



  //give the position for the board
  //g.row = r;
  //g.column = c;
  //g.torow = tor;
  //g.tocolumn = toc;
  g.from = from;
  g.to = to;
  g.sx = sx;
  g.sy = sy;
  g.ex = ex;
  g.ey = ey;

  g.attr("class", "hover_group");
  g.attr({id: "arrow"});
  //test
  //console.log('fuck');
  g.click(clickArrow);
}

var clickArrow = function (event){
 
  var piece = bbs.charAt(this.from);
  bbs = bbs.replaceAt(this.from,' ');
  bbs = bbs.replaceAt(this.to,piece);
  //console.log(bbs);

  var sx = this.sx;
  var sy = this.sy;
  var ex = this.ex;
  var ey = this.ey;



  var timing = 750;
  $("[id=arrow]").remove();


  //var tmp_str = "#p"+player + this.from;
  var tmp_str2 = "[id=p"+player + this.from+"]";
  //$(tmp_str).attr({fill:'white'});

  var svg = Snap('#main-svg');
  var pp = svg.selectAll(tmp_str2);

  player = 3-player;
Snap.animate( 0, 1, function( value ) {                       // Animate by transform
                    //console.log(value);
                    pp.attr({cx:sx*(1-value)+ex*value,cy:sy*(1-value)+ey*value });      // Animate by font-size ?
                }, timing, mina.easeinout
                ,function(){drawBoard(Snap('#main-svg'), bbs);} );


  //drawBoard(Snap('#main-svg'), bbs);
 
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}



function drawDropPiece(svg,x,y,player,winvalue , at)
{
  var piece_radius = 60;
  var piece_color = (player == 1) ?  'r()#A8383B-#940004': 'r()#323875-#060F67';

  var c = svg.circle(x, y, piece_radius );
  c.at = at;
  c.attr({fill: piece_color, opacity: 0.3});
  c.click(clickDropPiece);
}



var clickDropPiece = function(event){
  //this.attr({ fill: 'white', opacity:1, r:500});
  //console.log(this.getBBox().cx);
  


  if(player == 1)
  {
    bbs = bbs.replaceAt(this.at,'o');
  }
  else if(player == 2)
  {
    bbs = bbs.replaceAt(this.at,'x');
  }

  player = 3-player;


  var radius = this.getBBox().h/2;

  var timing = 500;


  var pp = this;
  pp.attr({opacity:1});



          
                Snap.animate( 0, 1, function( value ) {                       // Animate by transform
                    //console.log(value);
                    pp.attr({ r: value * radius });      // Animate by font-size ?
                }, timing, mina.bounce
                ,function(){drawBoard(Snap('#main-svg'), bbs);} );
  
                

  //drawBoard(Snap('#main-svg'), bbs);
};

















