/*
*   ..Pew.js, uly, dec2011..
*
*   The Pew represents the most simplest weapon type.   
*   it inherits from GameObject, but mixes in Projectile class methods...
*
*/
Pew.prototype = new GameObject();
Pew.prototype.constructor = Pew; 
Pew.prototype.needsRemoved = Projectile.prototype.needsRemoved;
function Pew( x, y )
{ 
    GameObject.call( this );
	var that = this; 

    //
    //  public variables.
    // 

    that.type = "Pew"; 
    that.image = g.images.pew;
    that.height = 72;
    that.width = 24;
    that.vx = 0;
    that.vy = 15;
    //that.setPosition( x, y );
    that.x = x;
    that.y = y;
    that.frames = 0;

    //
    //  private variables.
    // 

    /*
    var _gameObject = new GameObject();
    _gameObject.setPosition( x, y );
    _gameObject.width =  24;
    _gameObject.height = 72;
    _gameObject.vx = 0;
    _gameObject.vy = 15;
    _gameObject.frames = 0; 
    _gameObject.image = g.images.pew; 
    */

    //
    //  public interface implementations.
    // 

    /* implementation draw method. */
    /*
    that.draw = function( ctx )
    {
        that.gameObject.draw( ctx );
    }
    */

    /* implementation of tick. */
    /*
    that.tick = function()
    {
        that.gameObject.tick();

        if ( Pew.prototype.needsRemoved )
                return; 
    } 
    */

    that.tick = function()
    {
        GameObject.prototype.tick.call( this );

        //if ( Pew.prototype.needsRemoved )
        //        return; 
    }

    //
    //  public methods.
    // 

    //
    //  private methods.
    // 
}




