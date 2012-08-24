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
* test bot.js, uly, aug2012
*
* bots represent destructable enemies in yarn.
* players are supposed to shoot bots.
*
* This test demonstrates the bot life-cycle,
* and it's interaction with bot the game graph (yarn.graph),
* and it's factory (yarn.plant).
*/ 
$(document).ready(function(){ main(); });

var main = function()
{ 
  configure_yarn_for_testing(); 

  test( "Bots are constructable and", function(){
    var bot = yarn.plant.make_bot();
    equal( !!bot, true, "should be generated via yarn.plant.make_bot()." );

    yarn.graph.push( bot );
    equal( yarn.graph.contains( bot ), true, "should be added to the game world via yarn.graph.push()." ); 
    yarn.graph.remove( bot );
  });

  test( "Bots are destructable and", function(){
    var bot = yarn.plant.make_bot();
    equal( bot.hp > 0, true, "should have some hit points available before receiving any kind of damage." );

    var hp0 = bot.hp;
    bot.take_damage( 1 );
    equal( bot.hp < hp0, true, "should lose hit points when they take damage." );

    bot.kill();
    equal( bot.hp, 0, "should have 0 hit points if they are killed." );
  }); 

  test( "While in play, bots should be able to", function() {
    var bot = yarn.plant.make_bot();
    var i, 
        x0 = 10, 
        y0 = 10; // initial positions...
    bot.set_position( x0, y0 );
    yarn.graph.push( bot );

    i = 3; while (i--) yarn.tick();
    equal( (bot.x != x0 && bot.y != y0), true, "move around." );

    bot.set_position( 0, 0 );   //..top left corner of map..
    bot.set_velocity( 0, -3 );
    i = 3; while (i--) yarn.tick();
    equal( bot.y > 0, true, "wrap their movement around the map vertically." );

    bot.set_position( 0, 0 ); 
    bot.set_velocity( -3, 0 );
    i = 3; while (i--) yarn.tick();
    equal( bot.x > 0, true, "wrap their movement around the map horizontally as well." );

    var bot2 = yarn.plant.make_bot();
    yarn.graph.push( bot2 );
    bot.set_position( 50, 10 ); bot2.set_position( 55, 10 );  //..on same x axis, bot on left, bot2 on right..
    bot.set_velocity( 2, 0 ); bot2.set_velocity( -2, 0 ); 

    i = 3; while (i--) yarn.tick();
    var bot_is_still_on_left_side = bot.x < 55,
      bot2_is_still_on_the_right = bot2.x > 50;
    equal( bot_is_still_on_left_side && bot2_is_still_on_the_right, true, "collide with each other" );

    yarn.graph.remove( bot );
    yarn.graph.remove( bot2 );
  } );

} 

//
// for testing purposes,
// kill the usual game-loop,
// and force us to simulate a loop by hand by manually calling yarn.tick();
//
var configure_yarn_for_testing = function() {
  yarn.pause();
}
