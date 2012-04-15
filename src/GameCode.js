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
    that.char_images;  /* a single item from CodeTrail's charImageSet. */ 

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

    GameCode.prototype.set_char_images = function( char_images )
    {
        this.char_images = char_images;
        return this;
    }

    GameCode.prototype.tick = function()
    {
        //..do nothing (don't move!)..
    }
    that.tick = GameCode.prototype.draw;    // TODO:bug?

    GameCode.prototype.draw = function()
    { 
        var colour = this.get_colour(), 
                char_images = this.get_char_images(),
                image;

        image = char_images[ colour ];  // TODO:this assumes 1 char only.  
        if ( image )
                g.ctx.drawImage( image, that.x, that.y ); 

        this.manage_frames();
    } 
    that.draw = GameCode.prototype.draw;

    GameCode.prototype.set_delay = function( delay )
    {
        this.currentFrame = -delay;
        return this;
    }

    //
    //  private methods.
    // 
 
    /* return the current character to display. */
    GameCode.prototype.get_char_images = function()
    {
        return this.char_images;
    }

    /* return a 2d context fillStyle to represent our gameCode colour. */
    GameCode.prototype.get_colour = function()
    {
        var zFrames = this.currentFrame,
                colours = CodeTrail.prototype.colours; 

        if ( zFrames < 0 )
                return null;    //..allow a delay..

        // TODO:optimize this...
        if ( zFrames < 2 ) 
        {
            return colours[0];
        }
        else if ( zFrames < 32  )
        { 
            return colours[1]; 
        } 
        else if ( zFrames < 56  )
        { 
            return colours[2]; 
        }
        else if ( zFrames < 64  )
        { 
            return colours[3]; 
        } 
        else if ( zFrames < 92  )
        { 
            return colours[4]; 
        } 
        else if ( zFrames < 96  )
        { 
            return colours[5];
        } 

        return null; 
    }

}




