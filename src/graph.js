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
* The yarn.graph singleton manages the game graph and abstracts the box2d world concept.
* When game objects are appended to the graph, they are populated into the box2d world.
* Likewise when they are removed they are also removed from the world.
*/
yarn.graph = (function(){ 

  //
  // locally import box2d
  //
  var b2Vec2 =         Box2D.Common.Math.b2Vec2;
  var b2BodyDef =      Box2D.Dynamics.b2BodyDef;
  var b2Body =         Box2D.Dynamics.b2Body;
  var b2FixtureDef =   Box2D.Dynamics.b2FixtureDef;
  var b2Fixture =      Box2D.Dynamics.b2Fixture;
  var b2World =        Box2D.Dynamics.b2World;
  var b2DebugDraw =    Box2D.Dynamics.b2DebugDraw; 
  var b2MassData =     Box2D.Collision.Shapes.b2MassData;
  var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
  var b2CircleShape =  Box2D.Collision.Shapes.b2CircleShape; 

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
    * the box2d world.
    */
    graph.world = null;
  }; 

  //--------------------------------------------------
  //
  // public
  // 
  //--------------------------------------------------

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
  GameGraph.prototype.update = function( dt ) {
    var graph = this;
    var i = 0, 
      model = graph._game_objects,
      len = graph._game_objects.length,
      game_object,
      body;

    for ( ; i < len; i++ ) {
      game_object = model[ i ]; 

      // skip items that don't need our attention.
      if ( null === game_object ) {
        continue;
      } 

      game_object.update(); 
      game_object.draw();   // TODO this is wrong if removed/killed.

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
      model = this._game_objects,
      body = item.body;
      
    graph.world.DestroyBody( body ); 
    model[ index ] = item = body = null;
    graph._vacancies << index;
  }

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
  }

  /**
  * @public
  * Flag a game object to be removed from our model;
  *
  * @param item - game object.
  * @return void
  */ 
  GameGraph.prototype.remove = function( item ) {
    item.kill();
  }

  /*
  * @private,
  * for testing purposes, make it really easy to clear our model.
  */
  GameGraph.prototype._clear_game_graph = function() {
    var graph = this;
    graph._game_objects = [];
    graph._push_queue = []; 
    graph._vacancies = []; 
    graph.world = new b2World( 
      new b2Vec2( 0, 0 ),  
      true );              
    graph.world = null; // TODO Do I need to explicitly destroy each body?
    graph.world = graph._make_world();
  };

  /*
  * generate the default graph world.
  * @return b2World
  */
  GameGraph.prototype._make_world = function() {
    return new b2World( 
        new b2Vec2( 0, 0 ),  //..zero gravity..
        true );              //..sleep inactive bodies..  
  };

  /*
  * @pseudo-private
  * Insert a game object into the box2d world and into our object model.
  * @param item - GameObject
  * @param index - optional, the index to insert the game object at.
  * @return void
  */
  GameGraph.prototype._insert_game_object = function( item, index ) {
    var graph = this,
      model = this._game_objects,
      body; 

    body = graph.world.CreateBody( item.body_def );
    body.CreateFixture( item.fixture_def );
    item.body = body;           // important: Create a circular-reference 
    body.SetUserData( item );   // tying together the yarn game object and the box2d body.

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

  var graph = new GameGraph(); 
  graph.world = graph._make_world();
  return graph;
})();

