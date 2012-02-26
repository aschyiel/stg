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
    that.vy = 15;

    //
    //  private variables.
    // 

    //
    //  public methods.
    // 

    /*
    that.tick = function()
    {
        Projectile.prototype.tick.call( that ); 
    } 
    */

    //
    //  private methods.
    // 
}




