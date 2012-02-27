/*
*   ..Enemy.js, uly, feb2012..
*
*   The most basic enemy type.
*   extends GameObject.
*/
Enemy.prototype = new GameObject();
Enemy.prototype.constructor = Enemy; 
function Enemy( x, y )
{ 
    GameObject.call( this );
	var that = this; 
    
    that.x = x;
    that.y = y;

    //
    //  public variables.
    // 

    // TODO:use g.images
	that.image = new Image(); 
	that.image.src = "../media/enemy.png";

    that.frames = 3; 
	that.width =    32;
	that.height =   32;
    that.type = "Enemy";
    that.vx = 3;
    that.vy = 3; 

    //
    //  private variables.
    //

    //
    //  public methods.
    // 

    /*
    Enemy.prototype.tick = function()
    { 
        GameObject.prototype.tick.call( this ); //..aka super.tick();..
    }
    */

    //
    //  private methods.
    // 
}




