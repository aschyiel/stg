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
  yarn.pause();

  test( "Players for the most part behave like every other game object and they", function(){

    var player = yarn.plant.make_player(); 
    equal( !!player, true, "should be created from the manufacturing plant." ); 

    var x = 10,
      y = 12,
      vx = 14,
      vy = 16; 
    player.set_position( x, y ).set_velocity( vx, vy ); 
    equal( player. x,  x, "should be able to set their x coordinate" ); 
    equal( player. y,  y, "should be able to set their y coordinate" ); 
    equal( player.vx, vx, "should be able to set their x velocity" ); 
    equal( player.vy, vy, "should be able to set their y velocity" ); 

    yarn.graph.push( player ); 

    window.player = player;
  });


  yarn.graph.update_world();
  yarn.graph.draw();
  yarn.resume();
  yarn.resume();
} 

$(document).on( yarn.EVENT_GAME_READY, main ); 
