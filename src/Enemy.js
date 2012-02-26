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

    //
    //  public variables.
    // 
	that.image = new Image(); 
	that.image.src = "../media/enemy.png";
	that.width =    32;
	that.height =   32;
	that.frames = 3;
    that.type = "Enemy";

    //
    //  private variables.
    //

    that.vx = 15
    that.vy = 1;

    //
    //  public methods.
    // 

    Enemy.prototype.tick = function()
    { 
        GameObject.prototype.tick.call( this ); //..aka super.tick();..
    }

    //
    //  private methods.
    // 
}




