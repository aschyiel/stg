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

var b2Body =         Box2D.Dynamics.b2Body;

var main = function()
{ 
  console.debug( "test_bot start." );
  configure_yarn_for_testing(); 

  test( "Bots are constructable and", function(){
    var bot = yarn.plant.make_bot();
    equal( bot._is_new, true, "should be marked as \"new\" for the grapher." );
    equal( bot.is_dirty(), true, "should be flagged as \"dirty\" for the grapher so it knows to do something with it when it is added." );
    equal( !!bot, true, "should be generated via yarn.plant.make_bot()." );
    equal( !!bot.body_def, true, "should have a body definition ready to go for the grapher." );
    equal( 
        bot.body_def.type, 
        Box2D.Dynamics.b2Body.b2_dynamicBody, 
        "should have a dynamic body definition." );

    yarn.graph.push( bot );
    var i = 3;
    while ( i-- ) yarn.tick();
    equal( yarn.graph.contains( bot ), true, "should be added to the game world via yarn.graph.push()." ); 
    i = 3;
    while ( i-- ) yarn.tick();
    yarn.graph.remove( bot );
    i = 3;
    while ( i-- ) yarn.tick();
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

  test( "Bots can set their box2d properties such as", function() {

    var bot = yarn.plant.make_bot(),
        x0 = 40, 
        y0 = 10;

    bot.set_position( x0, y0 );
    yarn.graph.push( bot ); 
    yarn.tick();
    yarn.tick();  // note: as implemented, additions take 2 iterations,
                  // becuase adds are dealt with at the end of the first iteration.

    equal( yarn.round( bot.body.GetPosition().x ), x0, "the box2d x coordinate." );
    equal( yarn.round( bot.body.GetPosition().y ), y0, "the box2d y coordinate." );

    var vx = 10,
      vy = 5;
    bot.set_velocity( vx, vy );
    yarn.tick();
    equal( bot.body.GetLinearVelocity().x, vx, "the box2d velocity in the x direction." );
    equal( bot.body.GetLinearVelocity().y, vy, "the box2d velocity in the y direction." );

    yarn.graph._clear_game_graph();
  });

  test( "While in play, bots should be able to", function() {
    var bot = yarn.plant.make_bot();
    var i, 
        x0 = 40, 
        y0 = 10; // initial positions...
    bot.set_position( x0, y0 )
        .set_velocity( 2, 2 );
    yarn.graph.push( bot );

    // TODO should game-objects have a convenience get_body_x method?

    var get_x = function() {
      return bot.body.GetPosition().x; 
    };
    var get_y = function() {
      return bot.body.GetPosition().y; 
    }; 

    i = 3; while (i--) yarn.tick();
    equal( (get_x() != x0 && get_y() != y0), true, "move around." );

    bot.set_position( 0, 0 );   //..top left corner of map..
    bot.set_velocity( 0, -3 );
    i = 3; while (i--) yarn.tick();
    equal( get_y() > 0, true, "wrap their movement around the map vertically." );

    bot.set_position( 0, 0 ); 
    bot.set_velocity( -3, 0 );
    i = 3; while (i--) yarn.tick();
    equal( get_x() > 0, true, "wrap their movement around the map horizontally as well." );

    var bot1_x = 50,
      bot2_x = 55,
      vx = 10;
    var bot2 = yarn.plant.make_bot();
    yarn.graph.push( bot2 );
    bot.set_position( bot1_x, 0 ); bot2.set_position( bot2_x, 0 );  //..on same x axis, bot on left, bot2 on right..
    bot.set_velocity( vx, 0 ); bot2.set_velocity( -vx, 0 ); 

    i = 3; while (i--) yarn.tick();
    var bot_is_still_on_left_side = bot.x < bot2_x,
      bot2_is_still_on_the_right = bot2.x > bot1_x;
    equal( bot_is_still_on_left_side && bot2_is_still_on_the_right, true, "collide with each other" );

    window.bot1 = bot;
    window.bot2 = bot2;
    yarn.graph.remove( bot );
    yarn.graph.remove( bot2 );
    i = 3;
    while ( i-- ) yarn.tick();

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

$(document).on( yarn.EVENT_GAME_READY, main ); 
