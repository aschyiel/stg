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

    /**
    *   add a moving projectile called "pew" to the game graph.
    *   Recycle unused pews as necessary.
    */
    this.newPew = function( x, y )
    {
        var pew;
        if ( _projectiles.length < MAX_PROJECTILES )
        { 
            pew = new Pew( x, y );
            this.addProjectile( pew );

            return;
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

            return;
        }

        if ( pew )
        {
            pew.respawn( x, y );
        }
        else
        {
            console.warn( "failed to respawn pew." );
        }
    }

    //
    //  private methods.
    //

}
