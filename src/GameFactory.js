/*
*   ..GameFactory.js, uly, dec2011..
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
        _player = new Player( width, height, this );

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
    this.newPew = function( canvasHeight, x, y )
    {
        var pew;
        if ( _projectiles.length < MAX_PROJECTILES )
        { 
            pew = new Pew( canvasHeight, x, y );
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

            pew = new Pew( canvasHeight, x, y );
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

    /**
    *   draw the game graph.
    */
    this.draw = function( ctx )
    {
        _projectiles.forEach( function( projectile ) 
        {  
            projectile.draw( ctx );
        });
    }

    //
    //  private methods.
    //

}
