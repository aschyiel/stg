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
	that.image.src = "../media/pew.png";
	that.width =    24;
	that.height =   72;
    that.type = "Enemy";

    //
    //  private variables.
    //

    that.vx = 15
    that.vy = 1;

    //
    //  public methods.
    // 

    that.tick = function()
    { 
        Enemy.prototype.tick.call( this ); //..aka super.tick();..
    }

    //
    //  private methods.
    // 
}




