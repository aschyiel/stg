/*
* Copyright 2012 Ulysses Levy
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/
//-------------------------------------------------- 
/*
* graph.js, uly, aug2012
*
* The yarn.graph singleton manages the game graph and "world" concept away from game objects.
*/
yarn.graph = (function(){ 

  //--------------------------------------------------
  //
  // private/inner classes
  //
  //--------------------------------------------------

  var GameGraph = function(){
    var graph = this; 

    /*
    * The interal game object list.
    */
    graph._game_objects = [];

    /*
    * The list of objects to be inserted into 
    * the model at the end of every update cycle.
    */
    graph._push_queue = [];

    /*
    * A list of vacancy indices,
    * used to fill gaps in our model.
    */
    graph._vacancies = []; 

    /*
    * One-time callbacks to be triggered during update_world time 
    * against each game_object currently in play.
    */
    graph._callbacks = [];

    /*
    * The GameGraph is considered to by "busy" while it is 
    * performing it's update_world loop.
    */
    graph._is_busy = false;

    /*
    * The current GameObject count in the yarn game.
    *
    * This is a necessary evil because I'm using arrays incorrectly 
    * (for now until I find an alternative data structure);
    * due to javaScript array.length returning largested index + 1 
    * which unfortunately includes null values.
    */
    graph._length = 0; 

    /*
    * The game-board's 8x8 lot matrix represented as a flat array of 64 items.
    * The top-left-corner lot-cell is represented by the first indice,
    * and the bottom-right-corner being the last index of 63.
    */
    graph._lots = [];
  }; 

  //--------------------------------------------------
  //
  // public
  // 
  //--------------------------------------------------

  /**
  * @public
  * Setup the game grid comprised of "Lots" representing spatial information our playing field.
  * To be called inbetween levels.
  * @return void
  */
  GameGraph.prototype.setup_grid = function() {
    var graph = this,
        plant = yarn.plant;
    var lots = graph._lots,
        iterations = graph.NUMBER_OF_LOTS_HORIZONTALLY * graph.NUMBER_OF_LOTS_VERTICALLY;

    while ( iterations-- ) {
      lots.push( plant.make_lot() );
    } 

    //
    // Assign neighbors based on adjacent lots.
    // ie. left, right, top-left, top, top-right, etc.
    //

    var n = graph.NUMBER_OF_LOTS_HORIZONTALLY,
        m = graph.NUMBER_OF_LOTS_VERTICALLY;

    var is_along_top_edge = function( i ) { 
      return i > -1 && i < n; 
    };

    var is_along_bottom_edge = function( i ) { 
      return ( i > ( ( n * m ) - n - 1 ) && ( i < ( n * m ) ) );
    };

    var is_along_left_edge = function( i ) {
      return 0 === i % n; 
    };

    var is_along_right_edge = function( i ) { 
      return ( n - 1 ) === i % n;
    }; 

    /*
    * Returns the appropriate list of grid indices 
    * representing neighboring lots for a given index.
    */
    var get_adjacent_neighbor_indices = function( i ) {
      var is_along_top =    is_along_top_edge(    i ),
          is_along_bottom = is_along_bottom_edge( i ), 
          is_along_right =  is_along_right_edge(  i ),
          is_along_left =   is_along_left_edge(   i ) ;
    
      //
      // Handle "corner" cases with 3 neighbors (hee).
      //

      if ( is_along_top && is_along_left ) {
        return [  
          i + 1,    // right
          i + n,    // down
          i + n + 1 // down and right
        ]; 
      }

      if ( is_along_top && is_along_right ) {
        return [  
          i - 1,    // left
          i + n,    // down
          i + n - 1 // down and left
        ]; 
      }

      if ( is_along_bottom && is_along_left ) {
        return [  
          i + 1,    // right
          i - n,    // up
          i - n + 1 // up and right
        ]; 
      }

      if ( is_along_bottom && is_along_right ) {
        return [  
          i - 1,    // left
          i - n,    // up
          i - n - 1 // up and left
        ]; 
      }

      //
      // Handle "edge" cases with 5 neighbors (ha).
      //

      if ( is_along_top ) {
        return [
          i - 1,     // left
          i + n - 1, // down and left
          i + n,     // down
          i + n + 1, // down and right
          i + 1      // right
        ];
      }

      if ( is_along_bottom ) {
        return [
          i - 1,     // left
          i - n - 1, // up and left
          i - n,     // up
          i - n + 1, // up and right
          i + 1      // right
        ];
      }

      if ( is_along_left ) {
        return [
          i - n,      // up
          i - n + 1,  // up and right
          i + 1,      // right
          i + n + 1,  // down and right
          i + n       // down
        ];
      }

      if ( is_along_right ) {
        return [
          i - n,      // up
          i - n - 1,  // up and left
          i - 1,      // left
          i + n - 1,  // down and left
          i + n       // down
        ];
      } 

      //
      // Everyone else will have 8 neighbors all around.
      //

      return [  
        i - 1,     // left
        i + 1,     // right
        i - n,     // up
        i + n,     // down
        i - n - 1, // up and left
        i - n + 1, // up and right
        i + n - 1, // down and left
        i + n + 1  // down and right
      ]; 

    };

    //
    // Massive TODO this doesn't properly reduce the number of neighbors along edges...
    //

    var idx =       lots.length,
        max_index = lots.length - 1;

    while ( idx-- > 0 ) {
      $.each( get_adjacent_neighbor_indices( idx ), 
        function( count, elem_index ) {  
          var lot = lots[ idx ];
          if ( lot ) {
            lot.grid_index = idx;
            elem_index > -1 
              && elem_index <= max_index
              && lots[ elem_index ] 
              && lot._neighbors.push( lots[ elem_index ] ); 
          }
        } 
      );
    }

  };

  /**
  * @public
  * Find a lot in the grid that contains the given coordinates.
  * @return (Lot)
  */
  GameGraph.prototype.find_lot = function( x, y ) {
    var graph = this;
    var w = graph.LOT_WIDTH,
        h = graph.LOT_HEIGHT,
        max_row = graph.NUMBER_OF_LOTS_HORIZONTALLY;

    var rows_from_the_left = ~~( ~~( x - 0.5 ) / w ),  //..round down..
        columns_down = ~~( ~~( y - 0.5 ) / h ); 

    return graph._lots[ rows_from_the_left + ( columns_down * max_row ) ];
  };

  GameGraph.prototype.NUMBER_OF_LOTS_HORIZONTALLY = 8;
  GameGraph.prototype.NUMBER_OF_LOTS_VERTICALLY =   8;
  GameGraph.prototype.LOT_WIDTH =  yarn.CANVAS_WIDTH  / GameGraph.prototype.NUMBER_OF_LOTS_HORIZONTALLY;
  GameGraph.prototype.LOT_HEIGHT = yarn.CANVAS_HEIGHT / GameGraph.prototype.NUMBER_OF_LOTS_VERTICALLY;

  /**
  * @public
  * Draw the graph's displayList, animating all of the game objects.
  * This does NOT change any of the game-objects positions/velocities/etc.
  */
  GameGraph.prototype.draw = function() {
    var graph = this; var i = 0,
      model = graph._game_objects,
      len = graph._game_objects.length,
      game_object; 
    graph.clear_canvas();

    for ( ; i < len; i++ ) {
      game_object = model[ i ]; 

      // skip items that don't need our attention.
      if ( null === game_object ) {
        continue;
      } 

      game_object.draw();   // TODO this is wrong if removed/killed.
    } 
  }; 

  GameGraph.prototype.clear_canvas = function() {
    var context = yarn.context;
    context.fillStyle = '#ffffff';
    context.fillRect( 0, 0, yarn.CANVAS_WIDTH, yarn.CANVAS_HEIGHT );
  };

  /*
  * queue up an update_world callback to be called during the next available "turn".
  * The callback will be called once against every GameObject currently in play, 
  * and then will be discarded.
  *
  * ie. Anti-biotics use this callback mechanism to weed out "Bacteria" GameObjects.
  */
  GameGraph.prototype.onetime_update_callback = function( callback ) {
    var graph = this; 
    if ( graph.is_busy() ) {
      setTimeout( function(){ 
          graph.onetime_update_callback( callback ); 
        }, 
        0 );  // TODO is 0 msec too aggressive here?
              // or should I just straight up add callbacks upon callbacks all the way down?
    } else {
      graph._callbacks.push( callback );
    }
  };

  /*
  * returns true if the GameGraph is currently 
  * in the middle of working through the "update_world" turn.
  */
  GameGraph.prototype.is_busy = function() {
    var graph = this;
    return graph._is_busy;
  };

  /**
  * @public
  * Simulate a single game-turn ("tick") and update the entire game object graph;
  * apply position/velocity changes,
  * deal damage,
  * and add/remove bodies from the box2d world, etc.
  *
  * Tries to run in linear O(n) time.
  *
  * Note: drawing/animation isn't handled here as that 
  * should run (ideally) in a separate "thread".
  *
  * @param dt - the time-step in msec representing the animation-frame elapsed time.
  * @return void
  */
  GameGraph.prototype.update_world = function( dt ) {
    var graph = this;
    if ( graph._is_busy ) {
      console.error( "Show Stopper, looks like update_world is either getting called too often or failed to complete it's last loop, or perhaps both..." );
      return;
    }
    graph._is_busy = true; 

    //
    // Collect the callbacks locally,
    // while simultaneously clearing them out for the "next" turn.
    //
    var callbacks = [];
    while ( graph._callbacks.length ) {
      callbacks.push( graph._callbacks.pop() ); 
    } 

    var i = 0, 
      model = graph._game_objects,
      len = graph._game_objects.length,
      game_object; 
    for ( ; i < len; i++ ) {
      game_object = model[ i ]; 

      // skip items that don't need our attention.
      if ( null === game_object ) {
        continue;
      } 

      //
      // allow one-time callbacks to get a peice of the game-object action.
      // ie. antibiotics.
      //
      $.each( callbacks, function( idx, callback ) { 
        callback( game_object ); 
      } );

      game_object.update(); 

      // skip items that don't need our attention. (x2)
      if ( !game_object.is_dirty() ) {
        continue;
      } 

      // TODO deal damage 

      // 
      // remove items toward the end of the update loop,
      // so that we can still draw things dying/exploding.
      //
      if ( game_object.needs_removed() ) {
        graph._remove_game_object( game_object, i ); 
        continue; // defensive coding, just in case I forget later...
      } 
    } 

    //
    // Do our Game Object adds.
    //

    var k = 0,
      vacancies_available = graph._vacancies.length,
      vacancies = graph._vacancies;
    len = graph._push_queue.length;
    for ( i = 0; i < len; i++ ) {
      game_object = graph._push_queue.pop();
      if ( k < vacancies_available ) {
        graph._insert_game_object( game_object, vacancies.pop() ); 
        k++;
      } else {
        graph._insert_game_object( game_object, null ); 
      }
    } 

    graph._is_busy = false; 
  }

  /*
  * @pseudo-private
  * Remove a game object from the world, and delete it.
  * Mark it's sport as vacant for future adds.
  *
  * @param item - GameObject to be removed from game.
  * @param index - the index in our model that will be cleared and labeled as "vacant".
  *
  * see http://stackoverflow.com/questions/742623/deleting-objects-in-javascript
  */
  GameGraph.prototype._remove_game_object = function( item, index ) {
    var graph = this,
      model = this._game_objects;
      
    model[ index ] = null;
    graph._vacancies << index;
    graph._length--;
  };

  /**
  * @public
  * Queue a game object to be inserted into our model;
  * Game objects gets inserted at the end of each update cycle.
  *
  * @param item - game object.
  * @return void
  */
  GameGraph.prototype.push = function( item ) {
    var graph = this;
    graph._push_queue.push( item );
  };

  /**
  * @public
  * Flag a game object to be removed from our model;
  *
  * @param item - game object.
  * @return void
  */ 
  GameGraph.prototype.remove = function( item ) {
    var graph = this;
    item.kill();
  };

  /*
  * @private,
  * for testing purposes, make it really easy to clear our model.
  */
  GameGraph.prototype._clear_game_graph = function() {
    var graph = this;
    graph._game_objects = [];
    graph._push_queue = []; 
    graph._vacancies = []; 
    graph._length = 0;
  }; 

  /*
  * returns the number of game objects currently occupying the graph.
  * null/dead gameObjects are not included in the returned count.
  */
  GameGraph.prototype.size = function() {
    var graph = this;
    return graph._length;
  };

  /*
  * @pseudo-private
  * Insert a game object into the world.
  * @param item - GameObject
  * @param index - optional, the vacancy index to insert the game object at.
  * @return void
  */
  GameGraph.prototype._insert_game_object = function( item, index ) {
    var graph = this,
      model = this._game_objects; 
    graph._length++;
    if ( null !== index ) {
      model[ index ] = item; 
    } else {
      model.push( item ); 
    }
  };

  /**
  * for testing purposes,
  * returns true if the graph currently contains a given game object.
  * @return boolean
  */
  GameGraph.prototype.contains = function( item ) {
    var graph = this;
    return -1 < $.inArray( item, graph._game_objects );
  }; 

  //--------------------------------------------------

  return new GameGraph(); 
})();

