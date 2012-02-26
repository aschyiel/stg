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
    that.type = "Projectile";

    /* velocity in the x direction. */
    that.vx = 0; 

    /* velocity in the y direction. */
    that.vy = -10;

    /* has our projectile collided/touched a destructable item yet? */
    that.hasCollision = false; 

    //
    //  private variables.
    //

    //
    //  public methods.
    // 

    that.tick = function()
    {
        GameObject.prototype.tick.call(this);

        if ( that.y < -(that.height) )
        {
            that.disable();
        }
    }

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

