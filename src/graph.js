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
  }; 

  //--------------------------------------------------
  //
  // public
  // 
  //--------------------------------------------------

  /**
  * @public
  * Push a game object into the game object graph, and add it to the world.
  * @param item - GameObject
  * @return void
  */
  GameGraph.prototype.push = function( item ) {
    var graph = this;
    graph._game_objects.push( item );

    // TODO add item to world.
    
  };

  /**
  * returns true if the graph currently contains a given game object.
  * @return boolean
  */
  GameGraph.prototype.contains = function( item ) {
    var graph = this;
    return -1 < $.inArray( item, graph._game_objects );
  };

  GameGraph.prototype.remove = function( item ) {
    var graph = this,
        idx;
    idx = $.inArray( item, graph._game_objects );
    if ( idx > -1 ) {
      graph._game_objects = graph._game_objects.splice( idx, idx );  // TODO this copies the array 
                                                                     // which might be too slow...
    }
  }

  return new GameGraph();
})();


