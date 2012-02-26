/*
*   ..Pew.js, uly, dec2011..
*
*   The Pew represents the most simplest weapon type.   
*   it inherits from Projectile.
*
*/
Pew.prototype = new Projectile();
Pew.prototype.constructor = Pew; 
function Pew( x, y )
{ 
    Projectile.call( this );
	var that = this;

    //
    //  public variables.
    // 
	that.image = new Image(); 
	that.image.src = "../media/pew.png";

    that.frames = 0;    // only a single frame to draw!

	that.width =    24;
	that.height =   72;
	that.x = x;
	that.y = y;	
    that.type = "Pew";

    //
    //  private variables.
    //

    var _velocity = 15;

    //
    //  public methods.
    //

    that.isDisabled = function()
    {
        return true == _disabled;
    }

    that.moveUp = function()
    {
		if (that.y > 0 ) 
        {
			that.setPosition( that.x, that.y - _velocity );
		}
        else
        {
            that.disable();
        }
	} 

    that.draw = function( ctx )
    {
        if ( _disabled )
        {
            return;
        }

        that.moveUp();

		try 
        {
			ctx.drawImage( that.image, that.x, that.y );
		} 
		catch ( e ) 
        {
            console.warn( e );
		}; 
	}

    that.respawn = function( pX, pY )
    {
        _disabled = false;
        that.setPosition( pX, pY );
    }

    //
    //  private methods.
    // 

    var _disabled = false;

    /* sequestor this object and move off screen. */
    that.disable = function()
    {
        _disabled = true;
        that.x = -that.width;
        that.y = -that.height;
    }
}




