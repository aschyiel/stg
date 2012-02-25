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

	that.x = x;
	that.y = y;	

	/* velocity in the x direction. */
    that.vx = 0; 

	/* velocity in the y direction. */
    that.vy = 0;

    that.type = "GameObject";

    /* the tick interval inbetween animation frames. */
    that.interval = 0;

    /* the maximum tick intervals to wait inbetween switching animation frames. */
    that.maxInterval = 4;

    /* total number of animation frames (zero based). */
    that.frames = 3
    
    /* the current animation frame. */
    that.currentFrame = 0;

    //
    //  private variables.
    //

    //
    //  public methods.
    //

    that.setPosition = function( x, y )
    {
		that.x = x;
		that.y = y;
	}

    /*
    *   tick one for a turn.
    *
    */
    that.tick = function()
    {
        that.x += that.vx;
        that.y += that.vy;

        that.setPosition( x, y );
    }

    /*
    that.draw = function( ctx )
    {
        try 
        {
			ctx.drawImage( that.image, that.x, that.y );
		} 
		catch ( e ) 
        {
            console.warn( e );
		}; 
	}
	*/

    /*
    *   draw this gameObject (crops source image).
    */ 
    that.draw = function( ctx )
    {
		try 
        { 
			ctx.drawImage( that.image, 0, that.height * that.currentFrame, 
                    that.width, that.height, that.x, 
                    that.y, that.width, that.height );
		} 
		catch ( e ) 
        {
            //..
		};
		
		if (that.interval == that.maxInterval ) 
        {
			if (that.currentFrame == that.frames) 
            {
				that.currentFrame = 0; 
			}
			else 
            {
				that.currentFrame++;
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

    //
    //  private methods.
    // 

}




