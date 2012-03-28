/*
*   ..player.js, uly, dec2011..
*   
*   The player class (singleton) is it's own breast, and does not inherit from gameObject;
*   Instead it implements a bunch of GameObject methods,
*   and uses a has-a-gameObject relationship instead of the usual is-a-thing.
*
*   The player knows it's position and all of it's attributes.
*   It is up to the player to translate this to it's gameObject representation.
*
*   The Player is part of the gameGraph along with all the other gameObjects,
*   and receives the normal tick/draw messages as managed by the director.
*
*   TODO:make player a decoration and not a thing!
*/
function Player()
{ 
	var that = this;

    //
    //  public variables.
    // 
    that.width = 32;
	that.height = 32; 
	that.x = 0;
	that.y = 0;	

    //
    //  private variables.
    //
    
    var _canvasWidth = g.width;
    var _canvasHeight = g.height;

    var _isMovingUp =       false;
    var _isMovingDown =     false;
    var _isMovingLeft =     false;
    var _isMovingRight =    false;
    var _isShooting = false;

    /* 
    *   The GameObject controlled by the player,
    *   the idea is tha you can swap in and out different gameObjects that the player controls.
    */
    var _gameObject = new GameObject();

    //
    //  public methods.
    //

    /*
    *   initialze/setup the player's gameObject;
    *   to be called each time we want to swap in/out the player's character.
    *
    *   assumes the image source uses the dimensions 32x128, and contains 4 frames of 32x32.
    */
    that.initGameObject = function( image )
    {
        _gameObject.image = image;

        // TODO: gameObject.reset()
        _gameObject.currentFrame = 0; 
        _gameObject.interval = 0;
        _gameObject.maxInterval = 4;
        _gameObject.frames = 3;
        _gameObject.x = that.x;
        _gameObject.y = that.y;
        _gameObject.width =  32;
        _gameObject.height = 32; 
    }

    /* to be called what spawning the player. */
    that.setupDefaultGameObject = function()
    {
        var image = new Image(); 
        image.src = "../media/player.png";  //..32x128..

        that.initGameObject( image );
    }

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

    /*
    *   implemention of GameObject.tick
    */
    that.tick = function()
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

        if ( _isShooting )
        {
            that.shoot();
        } 

        _gameObject.setPosition( that.x, that.y );
        //_gameObject.tick();   // This causes an issue where the last "enemy" ticks faster.
                                // Perhaps there is some logical javaScript explanation for this global-variable-ness.
    } 

    /*
    *   implementation of GameObject.draw()
    */
    that.draw = function( ctx )
    {
        _gameObject.draw( ctx );
    }

    /*
    *   add a projectile shot by the player into the game via the director.
    */
    that.shoot = function()
    {
        var x = that.x + ~~( that.width / 2 );
        var projectile = g.gameFactory.newPew( x, that.y );  //..TODO:choose based on weapon selected..
        g.director.addToGraph( projectile );
    }

    /*
    *   from GameObject interface.
    */
    that.isDestructable = function()
    {
        return _gameObject.isDestructable();
    }

    /*
    *   required for GameObject implementation.
    */
    that.isProjectile = function()
    {
        return false;
    }

    /*
    *   required for GameObject implementation.
    */ 
    that.needsRemoved = function()
    {
        // TODO:handle temporarily removing the player some other way?

        return false;
    }

    //
    //  private methods.
    // 
	
}




