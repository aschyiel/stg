/*
*   ..player.js, uly, dec2011..
*   
*   The player class (singleton), does not inherit from gameObject;
*   It is it's own beast.
*/
function Player()
{ 
	var that = this;

    //
    //  public variables.
    // 
	that.image = new Image(); 
	that.image.src = "../media/player.png"
	that.width = 32;
	that.height = 32;
	that.frames = 3;
	that.actualFrame = 0;
	that.x = 0;
	that.y = 0;	
	that.interval = 0;

    //
    //  private variables.
    //
    
    var _director = g.director;
    var _canvasWidth = g.width;
    var _canvasHeight = g.height;

    var _isMovingUp =       false;
    var _isMovingDown =     false;
    var _isMovingLeft =     false;
    var _isMovingRight =    false;
    var _isShooting = false;

    //
    //  public methods.
    //

    that.setIsShooting = function( b )
    {
        _isShooting = b;
    }

    that.setIsMovingUp = function( b )
    {
        _isMovingUp = b;
    }

    that.setIsMovingDown = function( b )
    {
        _isMovingDown = b;
    }

    that.setIsMovingRight = function( b )
    {
        _isMovingRight = b;
    }

    that.setIsMovingLeft = function( b )
    {
        _isMovingLeft = b;
    } 

    that.moveLeft = function()
    {
		if (that.x > 0) 
        {
			that.setPosition( that.x - 5, that.y );
		}
	}
	
	that.moveRight = function()
    {
		if (that.x + that.width < _canvasWidth) 
        {
			that.setPosition( that.x + 5, that.y );
		}
	}

    that.moveUp = function()
    {
		if (that.y > 0 ) 
        {
			that.setPosition( that.x, that.y - 5 );
		}
	}

    that.moveDown = function()
    {
		if (that.y + that.height < _canvasHeight ) 
        {
			that.setPosition( that.x, that.y + 5 );
		}
	}

    that.setPosition = function( x, y )
    {
		that.x = x;
		that.y = y;
	}

    that.draw = function( ctx )
    {
        if ( _isMovingUp )
        {
            that.moveUp();
        }

        if ( _isMovingDown )
        {
            that.moveDown();
        }

        if ( _isMovingLeft )
        {
            that.moveLeft();
        }

        if ( _isMovingRight )
        {
            that.moveRight(); 
        }

		try 
        {
			ctx.drawImage( that.image, 0, that.height * that.actualFrame, 
                    that.width, that.height, that.x, 
                    that.y, that.width, that.height );
		} 
		catch ( e ) 
        {
            //..
		};
		
		if (that.interval == 4 ) 
        {
			if (that.actualFrame == that.frames) 
            {
				that.actualFrame = 0;

                if ( _isShooting )
                {
                    that.shoot();
                }
			}
			else 
            {
				that.actualFrame++;
			}
			that.interval = 0;
		}

		that.interval++;		
	}

    /*
    *   add a projectile shot by the player into the game via the director.
    */
    that.shoot = function()
    {
        var x = that.x + ~~( that.width / 2 );
        _director.addPlayerProjectile( x, that.y );
    }

    //
    //  private methods.
    //


	
	
	

	
}




