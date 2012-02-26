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

    //GameObject.prototype.setPosition( x, y );
    Enemy.prototype.setPosition.call( this, x, y );

    //
    //  public variables.
    // 
	//that.image = new Image(); 
	//that.image.src = "../media/enemy.png";
	var _image = new Image(); 
	_image.src = "../media/enemy.png";

    Enemy.prototype.image = _image;

    Enemy.prototype.width = 32;
    Enemy.prototype.height = 32;

    Enemy.prototype.setFrames.call( this, 3 );

	that.width =    32;
	that.height =   32;
    that.type = "Enemy";

    //
    //  private variables.
    //

    GameObject.prototype.vx = 15
    GameObject.prototype.vy = 1; 

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




