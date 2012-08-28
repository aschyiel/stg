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

var main = function()
{ 
  console.debug( "test_bot start." );
  configure_yarn_for_testing(); 

  test( "Bots are constructable and", function(){
    var bot = yarn.plant.make_bot().set_position( 30, 30 );
    bot.draw();
    equal( bot._is_new, true, "should be marked as \"new\" for the grapher." );
    equal( bot.is_dirty(), true, "should be flagged as \"dirty\" for the grapher so it knows to do something with it when it is added." );
    equal( !!bot, true, "should be generated via yarn.plant.make_bot()." );

    yarn.graph.push( bot );
    var i = 3;
    while ( i-- ) yarn.tick();
    equal( yarn.graph.contains( bot ), true, "should be added to the game world via yarn.graph.push()." ); 
    i = 3;
    while ( i-- ) yarn.tick();
//  yarn.graph.remove( bot );
//  i = 3;
//  while ( i-- ) yarn.tick();
    window.bot = bot;
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


} 

//
// for testing purposes,
// kill the usual game-loop,
// and force us to simulate a loop by hand by manually calling yarn.tick();
//
var configure_yarn_for_testing = function() {
  yarn.pause();
}

$(document).on( yarn.EVENT_GAME_READY, main ); 
