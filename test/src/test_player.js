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
* test player.js, uly, aug2012
*
* Yarn is a single player game, and the player is represented as a 
* single ship controlled by keyboard and mouse events.
*/ 

var main = function()
{ 
  console.debug( "test_player start." );
//yarn.pause();

  test( "Players for the most part behave like every other game object and they", function(){

    var player = yarn.plant.make_player(); 
    equal( !!player, true, "should be created from the manufacturing plant." ); 

    var x = 10,
      y = 12,
      vx = 14,
      vy = 16; 
    player.set_position( x, y );
    equal( player. x,  x, "should be able to set their x coordinate" ); 
    equal( player. y,  y, "should be able to set their y coordinate" ); 

    yarn.graph.push( player );
    yarn.tick(); yarn.tick();
    equal( yarn.graph.contains( player ), true,  "should be pushable to the graph" ); 

    yarn.graph.remove( player );
    yarn.tick(); yarn.tick();
    equal( yarn.graph.contains( player ),  false, "should be removable from the graph" ); 
  });

  test( "Players respond to keyboard input for directional control, so when you...", function(){ 

    var player = yarn.plant.make_player();
    var x0 = 100, 
      y0 = 100; 
    player.set_position( x0, y0 );

    yarn.graph.push( player );

    yarn.handle_key( 87, true );
    yarn.tick(); yarn.tick();
    equal( player.y < y0, true, "press down on the \"w\" key it should move up." );
    yarn.handle_key( 87, false );

    yarn.handle_key( 83, true );
    yarn.tick(); yarn.tick(); yarn.tick(); yarn.tick();
    equal( player.y > y0, true, "press down on the \"s\" key it should move down." );
    yarn.handle_key( 83, false );

    yarn.handle_key( 65, true );
    yarn.tick(); yarn.tick(); 
    equal( player.x < x0, true, "press down on the \"a\" key it should move left." );
    yarn.handle_key( 65, false );

    yarn.handle_key( 68, true );
    yarn.tick(); yarn.tick(); yarn.tick(); yarn.tick(); 
    equal( player.x > x0, true, "press down on the \"d\" key it should move left." );
    yarn.handle_key( 68, false );

    yarn.graph.remove( player );
  });

//yarn.resume();
//yarn.resume();

  setup_sandbox_player();
} 

var setup_sandbox_player = function() {
  var player = yarn.plant.make_player();
  yarn.graph.push( player ); 
  window.player = player;

  yarn.graph.update_world();
  yarn.graph.draw(); 
}

$(document).on( yarn.EVENT_GAME_READY, main ); 
