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

    var _gameFactory = new GameFactory();
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

        //
        //  introduce level elements based on our level progress.
        //
        var newActors = _levelGuide.( _levelProgress );
        if ( newActors )
        {
            newActors.forEach( function( actorType ) 
            {  
                if ( ENEMY == actorType )
                {
                    _gameGraph.push( _gameFactory.newEnemy() ); // TODO:change position
                }
            }); 
        }

        //
        //  movement.
        //  make all of the game graph "tick" their movements.
        //
        _gameGraph.forEach( function( gameObject )
        {
            gameObject.tick();
        }):

        //
        //  TODO:collisions/damage
        //

        //
        //  gameObject removes
        //  TODO: defrag
        //

        for ( var i = 0, len = _gameGraph.length; i < len; i++ )
        {
            var gameObject = _gameGraph[ i ];
            if ( gameObject.needsRemoved() )
                    _gameGraph[ i ] = null;
        }

    } 

    /* setup our level, initialize our cache of actors, etc... */
    this.setupLevelStage = function()
    {
        _levelGuide = new Object();

        // TODO:make this more configurable...

        _levelGuide[ 10 ] = [ 1 ];   // at level progress of "10", introduce a single "enemy" of type 1.
        _levelGuide[ 30 ] = [ 1 ];
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

    //
    //  private methods.
    //

}
