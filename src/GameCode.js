/*
*   ..GameCode.js, uly, march2012..
*
*   represent a set of characters (usually just one) to occupy a CodeTrail slot/digit.
*
*/
GameCode.prototype = new GameObject();
GameCode.prototype.constructor = GameCode; 
function GameCode( x, y )
{ 
    GameObject.call( this );
    var that = this; 
    
    that.x = x;
    that.y = y;
    that.type = "GameCode";

    //
    //  public variables.
    // 

    that.frames = 64; 
    that.maxInterval = 64; 
    that.char;

    //
    //  private variables.
    // 

    //
    //  public methods.
    // 

    GameCode.prototype.set_char = function( c )
    {
        this.char = c;
        return this;
    }

    GameCode.prototype.tick = function()
    {
        //..do nothing (don't move!)..
    }

    GameCode.prototype.draw = function()
    { 
        var colour = get_colour(); 
        if ( !colour )
                return; //..nothing to draw..

        var c = get_char();
        g.ctx.fillStyle = colour;
        g.ctx.fillText( c, x, y ); 

        that.manage_frames();
    } 

    //
    //  private methods.
    // 
 
    /* return the current character to display. */
    var get_char = function()
    {
        return that.char;
    }

    /* return a 2d context fillStyle to represent our gameCode colour. */
    var get_colour = function()
    {
        var frames = that.currentFrame; 
        var colour = null;

        if ( frames < 0 )
                return null;

        // TODO:optimize this...
        if ( frames < 8 ) 
        {
            colour = 'white';
        }
        else if ( frames > 7 && frames < 16  )
        { 
            colour = '0x00FF00';    //..bright green..
        } 
        else if ( frames > 15 && frames < 64  )
        { 
            colour = '0x00DD00';
        } 
        else if ( frames > 63 && frames < 128  )
        { 
            colour = '0x008800';
        }
        else
        {
            colour = '0x002200';    //..dim..
        }

        return colour; 
    }

}




