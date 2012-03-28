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

    //
    //  private variables.
    //

    var _vx = 1;
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
        if ( this.x - this.width < _left )
                this.vx = _vx;
        else if ( this.x + this.width > _right )
                this.vx = -( _vx );
               
        if ( this.y < _top )
                this.vy = _vy;

        if ( this.y > _bottom )
                this.vy = -( _vy );

        this.x += this.vx;
        this.y += this.vy;
    } 

    //
    //  private methods.
    // 
}




