/*
*   ..Projectile.js, uly, feb2012
*
*   Projectile is the base class representing weapon projectiles that can deal damage to stuff.
*   Projectile directly inherits from GameObject.
*
*/
Projectile.prototype = new GameObject();
Projectile.prototype.constructor = Projectile; 
function Projectile( x, y )
{ 
    GameObject.call( this );

	var that = this;

    //
    //  public variables.
    // 

    that.width =    24;
	that.height =   72;
	that.x = x;
	that.y = y;	
    that.type = "Projectile";

    /* velocity in the x direction. */
    that.vx = 0; 

    /* velocity in the y direction. */
    that.vy = -10;

    //
    //  private variables.
    //

    /* has our projectile collided/touched a destructable item yet? */
    that._hasCollision = false; 

    //
    //  public methods.
    // 

    /*
    *   tick one for a turn.
    *
    */
    that.tick = function()
    {
        this.x += vx;
        this.y += vy;
    }

    /*
    *   overriden from GameObject
    */
    /*
    that.draw = function( ctx )
    {
        GameObject.prototype.draw.call( this );
        //..
	}
	*/

    /*
    *   overrides GameObject.needsRemoved
    */
    that.needsRemoved = function()
    { 
        //
        //  if off map, then we don't need the projectile anymore.
        //
        if ( this.x + this.width < 0
            || this.x + this.width > g.canvas.width
            || this.y < 0
            || this.y + this.height > g.canvas.height )
                return true;

        return this._hasCollision;
    }

    //
    //  private methods.
    // 

} 

