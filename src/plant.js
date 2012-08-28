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
  var GameObject =         function(){
    var game_object = this;
    game_object._is_new = true;
    game_object._is_position_dirty = false; 
  }; 
  var Bot =                function(){}; 
  var Player =             function(){}; 

  GameObject.prototype.HIT_WIDTH =  32;
  GameObject.prototype.HIT_HEIGHT = 32;
  GameObject.prototype.HALF_HIT_WIDTH =  GameObject.prototype.HIT_WIDTH / 2;
  GameObject.prototype.HALF_HIT_HEIGHT = GameObject.prototype.HIT_HEIGHT / 2;

  /*
  * Render the gameobject onto the canvas,
  * by default draws a little box centered around the game-object's coordinates.
  */
  GameObject.prototype.draw = function() {
    var game_object = this,
      context = yarn.context,
      proto = GameObject.prototype;

    context.save();

    context.setTransform( 1, 0, 0, 1, 0, 0 ); // identity
    context.fillStyle = '#000000';
    context.translate( game_object.x, game_object.y );
    context.fillRect( 
        -proto.HALF_HIT_WIDTH,
        -proto.HALF_HIT_HEIGHT,
        proto.HIT_WIDTH,
        proto.HIT_HEIGHT );
   
    context.restore(); 
  }; 

  /*
  * returns true if the game object needs to be removed from the game.
  * ie. If a Bot gets killed, it will need to be marked for removal.
  * ie2. A projectile detonates, it will need to be removed as well.
  */
  GameObject.prototype.needs_removed = function() {
    var game_object = this;
    return 0 == game_object.hp; // TODO out-of-bounds, may be "timers"? 
  };

  /*
  * chainable,
  * request to update the game object's corrdinate position relative to the box2d world.
  * @param x - the x corrdinate in meters.
  * @param y - the y corrdinate in meters.
  * @return GameObject
  */
  GameObject.prototype.set_position = function( x, y ) {
    var game_object = this;
    if ( x === game_object.x || y === game_object.y ) {
      return game_object; // Since there is no position change, be sure to skip the "is-dirty" logic.
    }
    game_object.x = x;
    game_object.y = y;
    game_object._is_position_dirty = true;
    return game_object;
  };

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
  };

  /*
  * returns true if this game object needs to be added/removed from the graph,
  * or it's box2d body representation needs to be updated by the grapher.
  */
  GameObject.prototype.is_dirty = function() {
    var game_object = this;
    return game_object._is_position_dirty || 
        game_object._is_new               ||
        0 == game_object.hp;
  };

  /*
  * Reset this game-object's various isDirty indicators
  * so that the next call to is_dirty() will return false.
  *
  * note: does not bother with the game-object's hp 
  * which is an isDirty indicator for removal/death.
  */
  GameObject.prototype.unflag_is_dirty = function() {
    var game_object = this;
    game_object._is_position_dirty = false;
    game_object._is_new = false;
  };

  /*
  * update the coordinates for the game-object based on it's velocities.
  */
  GameObject.prototype.update_position = function() {
    var game_object = this; 
    var x = game_object.x,
      y =   game_object.y,
      vx =  game_object.vx,
      vy =  game_object.vy;
    game_object.set_position( x + vx, y + vy );
  }

  /*
  * to be called by the game loop during an update,
  * gives the game object a chance to correct itself before being drawn.
  * 
  * Gets overridden by Bot to handle "out-of-bounds" rules.
  */
  GameObject.prototype.update = function() {
    var game_object = this; 
    game_object.update_position(); 
  };

  //--------------------------------------------------

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
  };

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
  };

  /*
  * chainable,
  * Tell a bot that it is dead and no longer has any more health points available.
  * @return Bot
  */
  Bot.prototype.kill = function() {
    var bot = this;
    bot.hp = 0;
    return bot;
  };

  //--------------------------------------------------

  Player.prototype.draw = function() {
    var player = this,
      context = yarn.context,
      game_proto = GameObject.prototype;

    context.save();

    context.setTransform( 1, 0, 0, 1, 0, 0 ); // identity
    context.fillStyle = '#FF0000';
    context.translate( player.x, player.y );
    context.fillRect( 
        -game_proto.HALF_HIT_WIDTH,
        -game_proto.HALF_HIT_HEIGHT,
         game_proto.HIT_WIDTH,
         game_proto.HIT_HEIGHT );
   
    context.restore(); 
  };

  /* static, the amount of units to advance per axis of direction. */
  Player.prototype.SPEED = 5;

  /*
  * Player overrides game-object's update;
  * allows the user to conduct keyboard control over movement.
  */
  Player.prototype.update = function() {
    var player = this,
      speed = Player.prototype.SPEED; 
    
    var keys = yarn._keys,
      dx = 0,
      dy = 0; 

    if ( keys[ 87 ] && !keys[ 83 ] ) {
      dy -= speed;  // pressed "w", move up.
    } else if ( !keys[ 87 ] && keys[ 83 ] ) {
      dy += speed;  // pressed "s", move down.  
    }

    if ( keys[ 65 ] && !keys[ 68 ] ) {
      dx -= speed;  // pressed "a", move left.
    } else if ( !keys[ 65 ] && keys[ 68 ] ) { 
      dx += speed;  // pressed "d", move right.
    }

    player.x += dx;
    player.y += dy;
    GameObject.prototype.update.call( player ); 
  }; 

  //-------------------------------------------------- 

  /**
  * @public
  * Generate a bot game object.
  * @return bot
  */
  ManufacturingPlant.prototype.make_bot = function() {
    var plant = this;
    var bot = $.extend( {}, 
        new GameObject, 
        new Bot ); 

    // TODO set the bot's sprite...

    return bot
        .set_position( 0, 0 )
        .set_velocity( 0, 0 )
        .set_health( 1 );
  }; 

  /**
  * @public
  * Generate a player game object.
  * @return player
  */
  ManufacturingPlant.prototype.make_player = function() {
    var plant = this;
    var player = $.extend( {}, 
        new GameObject, 
        new Bot,
        new Player ); 

    // TODO set the bot's sprite...

    return player
        .set_position( 0, 0 )
        .set_velocity( 0, 0 )
        .set_health( 1 );
  }; 

  return new ManufacturingPlant();
})();


