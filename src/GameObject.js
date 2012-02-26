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

    //
    //  private variables.
    //

    /* the current animation frame. */
    var _currentFrame = 0;

	var _x = x;
	var _y = y;	

	/* velocity in the x direction. */
    var _vx = 0; 

	/* velocity in the y direction. */
    var _vy = 0; 

    /* the tick interval inbetween animation frames. */
    var _interval = 0;

    /* the maximum tick intervals to wait inbetween switching animation frames. */
    var _maxInterval = 8;

    /* total number of animation frames (zero based). */
    var _frames = 3

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
        if ( _x + that.width < 0 
            || _x + that.width > g.width )
                _vx = -( _vx ); //..flip velocity..  

        _x += _vx;
        _y += _vy;

        that.setPosition( x, y ); 
    } 

    //
    //  public methods.
    //

    that.setFrames = function( frames )
    {
        _frames = frames;
    }

    that.setPosition = function( x, y )
    {
		_x = x;
		_y = y;
	}

    /*
    *   draw this gameObject (crops source image).
    */ 
    that.draw = function( ctx )
    {
		try 
        { 
			//ctx.drawImage( that.image, _x, _y );

			ctx.drawImage( that.image, 0, that.height * _currentFrame, 
                    that.width, that.height, _x, 
                    _y, that.width, that.height );
		} 
		catch ( e ) 
        {
            //..
		};
		
		if (_interval == _maxInterval ) 
        {
			if (_currentFrame == _frames) 
            {
				_currentFrame = 0; 
			}
			else 
            {
				_currentFrame++;
			}
			_interval = 0;
		}

		_interval++;		
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
        _x = -that.width;
        _y = -that.height;
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




