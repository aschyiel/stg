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
* plant.js, uly, aug2012
*
* yarn.plant is the manufacturing factory for generating game objects such as bots.
*/
yarn.plant = (function(){ 

  //--------------------------------------------------
  //
  // private/inner classes
  //
  //--------------------------------------------------

  var ManufacturingPlant = function(){}; 
  var GameObject =         function(){}; 
  var Bot =                function(){};

  /*
  * chainable,
  * set the game object's corrdinate position relative to the box2d world.
  * @param x - the x corrdinate in meters.
  * @param y - the y corrdinate in meters.
  * @return GameObject
  */
  GameObject.prototype.set_position = function( x, y ) {
    var game_object = this;
    game_object.x = x;
    game_object.y = y;
    return game_object;
  }

  /*
  * chainable,
  * set the game object's velocity.
  * @param vx - velocity along the x axis in meters/sec.
  * @param vy - velocity along the y axis in meters/sec.
  * @return GameObject
  */ 
  GameObject.prototype.set_velocity = function( vx, vy ) {
    var game_object = this;
    game_object.vx = vx;
    game_object.vy = vy;
    return game_object;
  }

  /*
  * chainable,
  * set the bot's health points (where 0 or below implies it is dead).
  * @param hp - (int) the amount of health points to set.
  * @return Bot
  */
  Bot.prototype.set_health = function( hp ) {
    var bot = this;
    bot.hp = hp;
    return bot;
  }

  /*
  * chainable,
  * Tell a bot to receive some damage and take away from it's health points.
  * @param dmg - (int) the amount of damange.
  * @return Bot
  */
  Bot.prototype.take_damage = function( dmg ) {
    var bot = this;
    bot.hp -= dmg;
    return bot;
  }

  /*
  * chainable,
  * Tell a bot that it is dead and no longer has any more health points available.
  * @return Bot
  */
  Bot.prototype.kill = function() {
    var bot = this;
    bot.hp = 0;
    return bot;
  }

  //
  // TODO it is probably inefficient to add to 
  // the global yarn.plant instance this way in javaScript...
  // 

  //--------------------------------------------------
  //
  // public
  // 
  //--------------------------------------------------

  /**
  * @public
  * Generate a bot game object.
  * @return bot
  */
  ManufacturingPlant.prototype.make_bot = function() {
    var bot = $.extend( {}, 
        new GameObject, 
        new Bot ); 

    // TODO set the bot's sprite...

    return bot
        .set_position( 0, 0 )
        .set_velocity( 0, 0 )
        .set_health( 1 );
  };

  return new ManufacturingPlant();
})();


