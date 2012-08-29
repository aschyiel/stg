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
  }; 

  //--------------------------------------------------
  //
  // public
  // 
  //--------------------------------------------------

  /**
  * @public
  * Draw the graph's displayList, animating all of the game objects.
  * This does NOT change any of the game-objects positions/velocities/etc.
  */
  GameGraph.prototype.draw = function() {
    var graph = this;
    var i = 0,
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

  /**
  * @public
  * update the game object graph;
  * animate stuff,
  * apply position/velocity changes,
  * deal damage,
  * and add/remove bodies from the box2d world, etc.
  *
  * Tries to run in linear O(n) time.
  *
  * @param dt - the time-step in msec representing the animation-frame elapsed time.
  * @return void
  */
  GameGraph.prototype.update_world = function( dt ) {
    var graph = this;
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

