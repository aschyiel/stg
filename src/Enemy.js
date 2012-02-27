/*
*   ..Enemy.js, uly, feb2012..
*
*   The most basic enemy type.
*   extends GameObject.
*
*   This enemy type goes back and forth (mostly) horizontally...
*
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

	that.image = g.images.enemy; 
    that.frames = 3; 
	that.width =    32;
	that.height =   32;
    that.type = "Enemy"; 

    /*
    that.vx = 3;
    that.vy = 1; 
    */

    //
    //  private variables.
    //

    var _vx = 3;
    that.vx = _vx; 
    var _vy = 1;
    that.vy = _vy;

    /*
    *   navigational path borders
    */
    var _bottom = g.verticalCenter - 100;
    var _top = 0;
    var _left = 0;
    var _right = g.width;

    //
    //  public methods.
    // 

    /*
    *   override GameObject.tick
    */
    Enemy.prototype.tick = function()
    {
        //
        //  correct directional velocity to keep our sprite within our imaginary box.
        //
        if ( that.x - that.width < _left )
                that.vx = _vx;
        else if ( that.x + that.width > _right )
                that.vx = -( _vx );
               
        //if ( that.y - that.height < _bottom )
        if ( that.y < _top )
                that.vy = _vy;
        //else if ( that.y + that.height > _top )
        if ( that.y > _bottom )
                that.vy = -( _vy );

        that.x += that.vx;
        that.y += that.vy;
    }

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




