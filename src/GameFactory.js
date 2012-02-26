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
    *   Recycle unused pews as necessary.
    *
    *   @return pew object to be (re-)inserted into the gameGraph.
    */
    this.newPew = function( x, y )
    {
        var pew;
        if ( _projectiles.length < MAX_PROJECTILES )
        { 
            pew = new Pew( x, y );
            this.addProjectile( pew );

            return pew;
        }

        _projectiles.forEach( function( projectile ) 
        {  
            if ( projectile.type == PROJECTILE_TYPE_PEW
                && projectile.isDisabled() )
            {
                pew = projectile;
            }
        });

        if ( !pew 
            && _projectiles.length > 0 )
        {
            var elem = _projectiles.shift();
            elem = null;

            pew = new Pew( x, y );
            this.addProjectile( pew );

            return pew;
        }

        if ( pew )
        {
            pew.respawn( x, y );
        }
        else
        {
            console.warn( "failed to respawn pew." );
        }

        return pew;
    }

    //
    //  private methods.
    //

}
