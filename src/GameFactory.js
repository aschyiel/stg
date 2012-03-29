/*
*   ..GameFactory.js, uly, dec2011..
*
*   The GameFactory is a static singleton class that knows how to draw everything.
*
*/
function GameFactory()
{
    //
    //  public variables.
    //

    //
    //  private variables.
    //
    var _player;
    var _projectiles;
    var _projectiles = new Array();

    //
    //  public methods.
    //

    this.getPlayer = function()
    {
        if ( _player )
        {
            return _player;
        }

        // TODO: consider not passing gameFactory to player...
        _player = new Player( g.width, g.height, this );

        return _player;
    } 

    /**
    *   add a projectile to our game graph.
    */
    this.addProjectile = function( projectile )
    { 
        _projectiles.push( projectile );
    }

    var MAX_PROJECTILES = 64;
    var PROJECTILE_TYPE_PEW = "Pew";

    /*
    *   spawn a new basic enemy.
    */
    this.newEnemy = function( x, y )
    {
        if ( !x )
                x = ~~(g.width / 2)

        if ( !y )
                y = 0;  //..default to the top..

        var enemy = new Enemy();
        enemy.setPosition( x, y );

        return enemy;
    }

    /**
    *   return a moving projectile called "pew".
    *   TODO:Recycle unused pews as necessary.
    *
    *   @return pew object to be (re-)inserted into the gameGraph.
    */
    this.newPew = function( x, y )
    {
        var zx = x;
        var zy = y;

        var pew = new Pew( x, y );

        return pew; 
    } 

    /*
    *   generate a new matrix-code-trail representing a level of accomplishment.
    *
    *   @param lvl  a number representing the level.
    *   @param x    the game coordinates for the x-axis.
    *   @param y    the game coordinates for the y-axis.
    *   @return CodeTrail 
    */
    this.newCodeTrail = function( lvl, x, y )
    {
        return function()
        {
            var codeTrail = new CodeTrail( x, y );
            codeTrail.generate_string( lvl );
            
            return codeTrail;
        }
    }

    //
    //  private methods.
    //

}
