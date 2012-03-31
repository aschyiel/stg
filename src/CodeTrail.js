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

    /* 
    *   the string represented as an array of characters.
    *   needed for reference by wild-card-gameCodes...
    */

    that.chars = new Array();

    /*
    *   generate a code string based off the current level.
    *
    *   80% ascii
    *   20% unicode
    *
    *   @param n a number representing a level of completion...
    */
    that.generate_string = function( n )
    {
        var chars = new Array();
        var charSet = that.charSet;

        var idx = 0; 
        var char_set_max_index = charSet.length - 1;
        for ( var i = 1; i < 32; i++ )  
        {
            idx = i * n;            
            if ( idx > char_set_max_index )
                    idx = idx - char_set_max_index; //..wraps, this implies a max level..
                                                    //..of about 150 or so...

            chars.push( charSet[ idx ] );
        } 

        var prev_y = 0;
        var next_y = function()
        {
            return prev_y += 8;
        }

        chars.forEach( function(c)
        {
            var gameCode = new GameCode( 0, 0 );
            that._gameGraph.push( new GameCode()
                    .set_position( x, next_y() )
                    .set_char( c ) 
                    ); 
        }); 
        that.chars = chars;
    } 

    /*
    *   the keyboard character set,
    *   generated in ruby.
    *   irb(main):009:0> ('0'..'z').collect{ |it| it }
    *
    *   groovy:000> (0xa0..0xff).collect{ "\"\\u30${it.toHexString(it)}\"" }
    *   The unicode katakana set (30a0..30ff).
    *
    *   length 75 + 96 = 171 .
    *
    *   TODO:shuffle these.
    */
    that.charSet = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
            ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", 
            "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", 
            "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", 
            "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", 
            "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", 
            "v", "w", "x", "y", "z",
            "\u30a0", "\u30a1", "\u30a2", "\u30a3", "\u30a4", 
            "\u30a5", "\u30a6", "\u30a7", "\u30a8", "\u30a9", "\u30aa", 
            "\u30ab", "\u30ac", "\u30ad", "\u30ae", "\u30af", "\u30b0", 
            "\u30b1", "\u30b2", "\u30b3", "\u30b4", "\u30b5", "\u30b6", 
            "\u30b7", "\u30b8", "\u30b9", "\u30ba", "\u30bb", "\u30bc", 
            "\u30bd", "\u30be", "\u30bf", "\u30c0", "\u30c1", "\u30c2", 
            "\u30c3", "\u30c4", "\u30c5", "\u30c6", "\u30c7", "\u30c8", 
            "\u30c9", "\u30ca", "\u30cb", "\u30cc", "\u30cd", "\u30ce", 
            "\u30cf", "\u30d0", "\u30d1", "\u30d2", "\u30d3", "\u30d4", 
            "\u30d5", "\u30d6", "\u30d7", "\u30d8", "\u30d9", "\u30da", 
            "\u30db", "\u30dc", "\u30dd", "\u30de", "\u30df", "\u30e0", 
            "\u30e1", "\u30e2", "\u30e3", "\u30e4", "\u30e5", "\u30e6", 
            "\u30e7", "\u30e8", "\u30e9", "\u30ea", "\u30eb", "\u30ec", 
            "\u30ed", "\u30ee", "\u30ef", "\u30f0", "\u30f1", "\u30f2", 
            "\u30f3", "\u30f4", "\u30f5", "\u30f6", "\u30f7", "\u30f8", 
            "\u30f9", "\u30fa", "\u30fb", "\u30fc", "\u30fd", "\u30fe", 
            "\u30ff" ]; 

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


