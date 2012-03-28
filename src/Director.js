/*
*   ..Director, uly, feb2012..
*
*   The Director directs all the game objects, think of it as a game manager.
*
*/
function Director()
{
    //
    //  public variables.
    //

    //
    //  private variables.
    //

    var _gameGraph = new Array(); 

    /* the current level-stage the director is directing. */ 
    var _stage = 0;

    /* the current level the director is directing. */
    var _level = 0;

    /* the current level progress.  To be used to figure out what level elements to "introduce" into the set. */
    var _levelProgress = 0; 

    //
    //  public methods.
    //

    /*
    *   "direct" is the director's "main" method;
    *   it ticks everything forward 1 turn.
    *
    *   it is supposed to handle the whole game graph in the following order: 
    *       graph adds              (introduce new ships) 
    *       movement
    *       collisions and damage
    *       graph removes           (a ship died) 
    *       draw...
    *
    */
    this.direct = function()
    {
        _levelProgress += 1;

//      //
//      //  introduce level elements based on our level progress.
//      //
//      var newActors = _levelGuide[ _levelProgress ];
//      if ( newActors )
//      {
//          newActors.forEach( function( actorType ) 
//          {  
//              if ( ENEMY == actorType )
//              {
//                  _gameGraph.push( g.gameFactory.newEnemy() ); // TODO:change position
//              }
//          }); 
//      }

        //
        //  movement.
        //  make all of the game graph "tick" their movements.
        //
        _gameGraph.forEach( function( gameObject )
        {
            gameObject.tick();
        });

        //
        //  collisions/damage
        //  loop through all projectiles, and see if they hit anything.
        //

        var destructables = this.filterAsDestructables( _gameGraph ); 
        var projectiles = this.filterAsProjectiles( _gameGraph );
        for ( var i = 0, length = projectiles.length; i < length; i++ )
        {
            var projectile = projectiles[ i ]; 
            destructables.forEach( function( destructable )
            {
                if ( projectile.isTouching( destructable ) )
                        projectile.dealDamage( destructable );

            });
        }


        //
        //  gameObject removes
        //  TODO: defrag the game graph
        //

        for ( var i = 0, len = _gameGraph.length; i < len; i++ )
        {
            var gameObject = _gameGraph[ i ];
            if ( gameObject.needsRemoved() )
                    _gameGraph.slice( i, i );   //..remove the element from the gameGraph!..
        }

    } 

    /*
    *   draw everything, to be called from Game.js.
    */
    this.draw = function()
    {
        //
        //  additional debug text to show before calling drawImage.
        //
        if ( g.showStats )
        { 
            var s = "levelProgress:"+_levelProgress
            g.ctx.fillStyle = 'yellow';
            g.ctx.fillText( s, 50, 50 );
        } 

        _gameGraph.forEach( function( gameObject )
        {
            gameObject.draw( g.ctx );
        }); 
        g.player.draw( g.ctx ); // re-draw player last! (BUG:player draws twice).
    }

    /*
    *   return a sub list of projectile (damage dealing) gameObjects.
    *
    *   @param gameObjects  an arrya of GameObject.
    *   @return array<Projectile>
    */
    this.filterAsProjectiles = function ( gameObjects ) 
    {
        if ( !gameObjects )
                return [];

        var ki = [];
        gameObjects.forEach( function( gameObject )
        {
            if ( gameObject.isProjectile() )   
                    ki.push( gameObject );
        });

        return ki;

    }

    /*
    *   return a list of destructable gameObjects.
    *
    *   @return array<GameObject>
    */
    this.filterAsDestructables = function( gameObjects )
    {
        if ( !gameObjects )
                return [];

        var li = [];
        gameObjects.forEach( function( gameObject )
        {
            if ( gameObject.isDestructable() )   
                    li.push( gameObject );
        });

        return li;
    }

    /* setup our level, initialize our cache of actors, etc... */
    this.setupLevelStage = function()
    {
        //TODO level factory
        this.setup_level_one(); 
    }

    /*
    *   generate our first level,
    *   by spreading a two dozen enemies in a checkered formation,
    *   and initializing our player.
    *
    */
    this.setup_level_one = function()
    { 
        _gameGraph = new Array();
        _gameGraph.push( g.player );

        var last_x = 0;
        var last_y = 0;

        var next_x = function()
        {
            last_x += 32;
            return last_x;
        }

        var next_y = function()
        {
            last_y = ( last_y === 0 )? 32 : 0;
            return last_y;
        }

        for ( var i = 12; i > 0; i-- )
        { 
            _gameGraph.push( 
                    g.gameFactory.newEnemy()
                    .setPosition( next_x(), next_y() ) );
        }

        last_x = 0;
        last_y = 64;

        next_y = function()
        {
            last_y = ( last_y === 64 )? 96 : 64;
            return last_y;
        }

        for ( var i = 12; i > 0; i-- )
        { 
            _gameGraph.push( 
                    g.gameFactory.newEnemy()
                    .setPosition( next_x(), next_y() ) ); 
        }
               
    }

    /* "enum" representing an enemy actor type. */
    var ENEMY = 1;

    /* 
    *   set the level stage.  
    *   ie. check points.
    *
    *   @param stage    (int)
    */
    this.setStage = function( stage )
    {
        _stage = stage;
        // TODO:set level progress as appropriately.
    }

    /* 
    *   set the level to direct the game for. 
    *
    *   @param level    (int)
    */
    this.setLevel = function( level )
    {
        _level = level;
    }

    /*
    *   add a gameObject to the gameGraph.
    *
    *   ie. adding ap layer to the game graph.
    */
    this.addToGraph = function( gameObject )
    { 
        _gameGraph.push( gameObject ); 
    }

    //
    //  private methods.
    //

}
