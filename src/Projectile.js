/*
*   ..Projectile.js, uly, feb2012
*
*   This add-on-class is responsible for all the basic collision stuff regarding damage dealing things;
*   and is designed to decorate a gameObject-duck-typed class such as "Pew".
*
*   note:drawing is NOT handled here!
*
*/
function Projectile( x, y )
{ 
	var that = this;

    //
    //  "public" variables.
    // 

    //
    //  private variables.
    //

    //
    //  public methods.
    // 

    /*
    *   Projectile implementation of needsRemoved.
    *   TODO:check disablement elsewhere...
    *   TODO:check collision...
    *
    *   "this" is assumed to be a gameObject implementation.
    *
    *   @return boolean.
    */
    Projectile.prototype.needsRemoved = function()
    { 
        if ( true == this.hasCollision )
                return true; 

        //
        //  if off map, then we don't need the projectile anymore.
        //
        if ( this.x + this.width < 0
            || this.x + this.width > g.canvas.width
            || this.y < 0
            || this.y + this.height > g.canvas.height )
        {
            this.disable();

            return true;
        } 

        return false;
    }

    //
    //  private methods.
    // 

} 

