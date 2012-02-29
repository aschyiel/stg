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
    that.vy = -5;  //..shoots up thus negative..
    that.x = x;
    that.y = y;
    that.frames = 0;

    //
    //  private variables.
    // 

    //
    //  public interface implementations.
    // 

    Pew.prototype.tick = function()
    {
        GameObject.prototype.tick.call( this ); 

        //if ( Projectile.prototype.needsRemoved.call( this ) )
        //        return; 
    }

    //
    //  public methods.
    // 

    //
    //  private methods.
    // 
}




