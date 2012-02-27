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
    *   @return boolean.
    */
    that.needsRemoved = function()
    { 
        if ( true == this.hasCollision )
                return true; 

        //
        //  if off map, then we don't need the projectile anymore.
        //
        if ( that.x + that.width < 0
            || that.x + that.width > g.canvas.width
            || that.y < 0
            || that.y + that.height > g.canvas.height )
        {
            that.prototype.disable();

            return true;
        } 

        return false;
    }

    //
    //  private methods.
    // 

} 

