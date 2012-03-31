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

    that.frames = 128; 
    that.maxInterval = 2;   //..gets overridden by set_random_interval..
    that.char;

    //
    //  private variables.
    // 

    //
    //  public methods.
    // 

    GameCode.prototype.set_interval = function( interval )
    {
        this.maxInterval = interval;
        return this;
    }

    GameCode.prototype.set_char = function( c )
    {
        this.char = c;
        return this;
    }

//  GameCode.prototype.tick = function()
    that.tick = function()
    {
        //..do nothing (don't move!)..
    }

//  GameCode.prototype.draw = function()
    that.draw = function()
    { 
        var colour = get_colour(); 
        var c = get_char();
        if ( colour 
            && c )
        { 
            g.ctx.fillStyle = colour;
            g.ctx.fillText( c, that.x, that.y ); 
        }

        that.manage_frames();
    } 

    GameCode.prototype.set_delay = function( delay )
    {
        this.currentFrame = -delay;
        return this;
    }

    //
    //  private methods.
    // 
 
    /* return the current character to display. */
    var get_char = function()
    {
        return (that.char)?that.char : "X";
    }

    /* return a 2d context fillStyle to represent our gameCode colour. */
    var get_colour = function()
    {
        var zFrames = that.currentFrame; 
        var colour = null;

        if ( zFrames < 0 )
                return null;    //..allow a delay..

        // TODO:optimize this...
        if ( zFrames < 2 ) 
        {
            return "#FFFFFF";
        }
        else if ( zFrames < 32  )
        { 
            return "#00FF00"; 
        } 
        else if ( zFrames < 56  )
        { 
            return "#00DD00"; 
        }
        else if ( zFrames < 64  )
        { 
            return "#00BB00"; 
        } 
        else if ( zFrames < 92  )
        { 
            return "#007700"; 
        } 
        else if ( zFrames < 96  )
        { 
            return "#001100";
        } 

        return null; 
    }

}




