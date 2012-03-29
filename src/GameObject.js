/*
*   ..GameObject.js, uly, feb2012..
*
*   The GameObject serves as the base class for everything that can be inside of the GameGraph.
*
*/
function GameObject( x, y )
{ 
	var that = this;

    //
    //  public variables.
    // 

    that.image = null;

    /*
    *   dimensions of the thing to draw (post cropped).
    */
    that.width =    0;
	that.height =   0;

    that.type = "GameObject"; 

    /* has our projectile collided/touched a destructable item yet? */ 
    that.hasCollision = false;

    that.x = x;
	that.y = y;	

	/* velocity in the x direction. */
    that.vx = 0; 

	/* velocity in the y direction. */
    that.vy = 0; 

    /* @private, the tick interval inbetween animation frames. */
    that.interval = 0;

    /* the maximum tick intervals to wait inbetween switching animation frames. */
    that.maxInterval = 8;

    /* total number of animation frames (zero based). */
    that.frames = 3 
   
    //
    //  private variables.
    //

    /* the current animation frame. */
    var _currentFrame = 0;

    /* is this gameObject disabled.  Is it to be sequestored inbetween respawn. */
    var _disabled = false;

    //
    //  public prototype (extendable) methods
    //

    /*
    *   tick one for a turn.
    *
    */
    GameObject.prototype.tick = function()
    { 
        //
        //  TODO:this probably doesn't belong here!
        //
        if ( that.x + that.width < 0 
            || that.x + that.width > g.width )
                that.vx = -( that.vx ); //..flip velocity..  

        that.x += that.vx;
        that.y += that.vy; 
    } 

    //
    //  public methods.
    //

    //..TODO remove..
    that.setFrames = function( frames )
    {
        that.frames = frames;
    }

    GameObject.prototype.set_position = function( x, y )
    {
        if ( isNaN(x) || isNaN(y) )
                throw "invalid x,y coords!";

		this.x = x;
		this.y = y;

		return this; 
    }

    that.setPosition = function( x, y )
    {
        if ( isNaN(x) || isNaN(y) )
                throw "invalid x,y coords!";

		that.x = x;
		that.y = y;

		return that;
	}

    /*
    *   draw this gameObject (crops source image if 2+ frames to animate).
    */ 
    that.draw = function( ctx )
    {
        if ( that.frames == 0 )
        {
            try
            {
                ctx.drawImage( that.image, that.x, that.y );
            }
            catch ( e )
            {
                //..
            };

            return;     
        }

		try 
        { 
            ctx.drawImage( that.image, 0, that.height * _currentFrame, 
                    that.width, that.height, that.x, 
                    that.y, that.width, that.height );
		} 
		catch ( e ) 
        {
            //..
		};
	
        manage_frames(); 
	} 

    /*
    *   based on our update interval/frequency,
    *   update the current frame number.
    *
    */
    that.manage_frames = function()
    {
		if (that.interval == that.maxInterval ) 
        {
			if (_currentFrame == that.frames) 
            {
				_currentFrame = 0; 
			}
			else 
            {
				_currentFrame++;
			}
			that.interval = 0;
		}

		that.interval++;		
    }

    /*
    *   indicate if this gameObject needs to be removed from the gameGraph.
    *   usually this will be "true" if the gameObject is "dead" or whatever.
    *
    *   @return boolean
    */
    that.needsRemoved = function()
    {
        return false;
    }

    /*
    *   Indicate if this particular gameObject can receive damage from weapons and stuff.
    *
    *   @return boolean
    */
    that.isDestructable = function()
    {
        return false;
    }

    /*
    *   does this thing deal damage on impact?
    *
    *   @return boolean
    */
    that.isProjectile = function()
    {
        return false;
    }

    /* sequestor this object and move off screen. */
    that.disable = function()
    {
        _disabled = true;
        that.x = -that.width;
        that.y = -that.height;
    } 

    that.isDisabled = function()
    {
        return true == _disabled;
    }

    that.respawn = function( pX, pY )
    {
        _disabled = false;
        that.setPosition( pX, pY );
    }


    //
    //  private methods.
    // 

}




