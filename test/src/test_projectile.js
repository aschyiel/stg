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
* test_projectile.js, uly, oct2012
*
* Projectiles are shot by the player and inflict damage to enemies such as Bacteria.
*
*/ 
var main = function()
{ 
  yarn.pause(); 

  test( 
      "Projectiles ammunition is point based,",
      function() { 
 
    expect( 3 );
   
    equal( false, true, "and their damage level is based on the number of points spent." );
    equal( false, true, "and cannot be fired if player points are currently insufficient." );
    equal( false, true, "and should decrease the player's scored points upon firing." );

  } ); 

  test( 
      "Projectiles are fired by the player,",
      function() { 
 
    expect( 3 );
   
    equal( false, true, "and they should spawn in-front of the player when fired." );
    equal( false, true, "and they are shot using the space-bar key." );
    equal( false, true, "and their initial trajectory angle should be the same as the player." );

  } );

  test( 
      "Projectiles can collide with stuff,",
      function() { 
 
    expect( 3 );
   
    equal( false, true, "like Bacteria." );
    equal( false, true, "like other Projectiles." );
    equal( false, true, "like Players." );

  } );

  test( 
      "When Projectiles bounce off walls,",
      function() { 
 
    expect( 6 );
   
    equal( false, true, "their trajectory angle gets corrected." );
    equal( false, true, "they increase in movement speed." );
    equal( false, true, "they deal more damage." );
    equal( false, true, "they deal damage to players on odd bounces." );
    equal( false, true, "they deal damage to enemies on even bounces." );
    equal( false, true, "their area of effect increases." );

  } );

  test( 
      "Projectiles move within the game,",
      function() { 
 
    expect( 3 );
   
    equal( false, true, "and advance in the direction of their trajectory angle." );
    equal( false, true, "and their coordinate position should advance based on their movement speed." );
    equal( false, true, "and should stop moving apon collision." );

  } );

  test( 
      "Projectiles deal damage to game objects on collision,",
      function() { 
 
    expect( 5 );
   
    equal( false, true, "based on the number of times the projectile has bounced." );
    equal( false, true, "and can kill an enemy bacterium." );
    equal( false, true, "and can kill multiple bacteria within the area of effect." );
    equal( false, true, "and can blow up other projectiles." );
    equal( false, true, "and can kill players." );

  } );

  setTimeout( run_demo, 1000 ); 
} 

/* Reset our lot-grid spatial-signal information along with the game-graph. */
var reset = function() {
  _.each( yarn.graph._lots, function( lot ) {
      lot.clear_signals();
  } ); 
  yarn.graph._clear_game_graph();
};

/*
* Spawn the player, and allow the player to shoot projectiles.
*/
var run_demo = function() {
  reset();
  yarn.tick();
 
  var x = yarn.HALF_CANVAS_WIDTH,
      y = yarn.HALF_CANVAS_HEIGHT;

  yarn.graph.push( yarn.plant.make_player().set_position( x, y ) ); 

  yarn.tick();
  yarn.resume();
};

$(document).on( yarn.EVENT_GAME_READY, main ); 
