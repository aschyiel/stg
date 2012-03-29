/*
*   ..CodeTrail.js, uly, march2012..
*
*   A CodeTrail animates a trail of matrix-rip-off 
*   characters on the screen in a rain-drop fashion.
*   The current level the player is playing is 
*   to be represented by the number of CodeTrails displayed.
*
*   A CodeTrail is made up of many GameCode objects.
*
*/
CodeTrail.prototype = new GameObject();
CodeTrail.prototype.constructor = CodeTrail;
function CodeTrail( x, y )
{ 
    GameObject.call( this );
    var that = this;

    that.x = x;
    that.y = y;
    that.type = "CodeTrail";

    that._gameGraph = new Array();
    that.string;

    /*
    *   generate a code string based off the current level.
    *
    *   80% ascii
    *   20% unicode
    *
    */
    that.generate_string = function( level )
    {
        var prime = 123456789123456789;    // TODO
        that.string = "TestCodeString123";

//      var gameFactory = g.gameFactory; 
//      that.string.forEach( function( c ) 
//      {
//          that._gameGraph.push( 
//                  gameFactory.newGameCode(  ) ); 
//      });

        var c = "c";

        var gameCode = new GameCode( x, y );
        that._gameGraph.push( new GameCode()
                .set_position( x, get_y() )
                .set_char( c ) 
                );
    }

    that.tick = function()
    {
        //..
    }

    that.draw = function()
    {
        that._gameGraph.forEach( function( gameCode )
        { 
            gameCode.draw();
        });
    } 
}


