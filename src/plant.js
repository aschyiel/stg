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

    /* angle of rotation in radians (0 means "right" just like in the html5 canvas). */
    game_object.theta = 0;
  }; 
  var Bot =                function(){}; 
  var Bacteria =           function(){}; 
  var Player =             function(){}; 

  /* The default amount of movement-units to travel in a single tick. */
  GameObject.prototype.SPEED =  5;

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

  /* Indicate that the bug is currently experiencing a "tumble". */
  Bacteria.prototype.IS_TUMBLING = 10;

  /* Indicate that the bug is currently "running". */
  Bacteria.prototype.IS_RUNNING = 20;

  /* Indicate that the bug is currently reproducing and undergoing binary fission. */
  Bacteria.prototype.IS_REPRODUCING = 30; 
  
  Bacteria.prototype.HIT_WIDTH =       8;
  Bacteria.prototype.HIT_HEIGHT =      4;
  Bacteria.prototype.HALF_HIT_WIDTH =  4;
  Bacteria.prototype.HALF_HIT_HEIGHT = 2;

  /*
  * chainable,
  * animated,
  * Tell the bacteria to tumble and change their rotational-direction randomly.
  * To simplify testing, bacteria will never choose the same direction twice in a row.
  * @return Bacteria.
  */
  Bacteria.prototype.tumble = function() {
    var bug = this;
    bug.animation = bug.IS_TUMBLING;
    var theta = bug.theta;
    while ( theta == bug.theta ) {
      bug.theta = Math.random() * 2 * Math.PI;
    }
    return bug;
  };

  /*
  * chainable,
  * animated,
  * Tell the bacteria to start running in the currently selected direction.
  * Based on how "correct" the current direction is, determines how far the bacteria will run.
  *
  * In biology, the distance bacteria will run is determined by the concentration 
  * of chemical signals in the immediate area (chemotaxis). 
  *
  * @return Bacteria
  */
  Bacteria.prototype.run = function( intent ) {
    var bug = this,
        theta = this.theta,
        distance = this.SPEED; 
    bug.animation = bug.IS_RUNNING;

    bug.x += ( distance * Math.sin( theta ) );
    bug.y += ( distance * Math.cos( theta ) );

    return bug;
  };

  /*
  * Draw the bacteria.
  * TODO animate based on the bacteria's states of tumbling, running, or reproducing.
  */
  Bacteria.prototype.draw = function() {
    var bug = this,
      context = yarn.context; 
    context.save();

    context.setTransform( 1, 0, 0, 1, 0, 0 ); 
    context.strokeStyle = '#0000FF';
    context.translate( 
            bug.x - bug.HALF_HIT_WIDTH, 
            bug.y - bug.HALF_HIT_HEIGHT ); 

    var theta_offset = 1.57; // 90 degress offset in radians (due to html5 canvas).
    context.rotate( bug.theta + theta_offset ); 
    context.translate( 
            -bug.HALF_HIT_WIDTH, 
            -bug.HALF_HIT_HEIGHT ); 

    var c = context;
    c.beginPath();
    c.moveTo( 0, 0 ); c.lineTo( 8, 0 );
    c.moveTo( 8, 0 ); c.lineTo( 8, 4 );
    c.moveTo( 8, 4 ); c.lineTo( 0, 4 );
    c.moveTo( 0, 4 ); c.lineTo( 0, 0 );
    c.moveTo( 1, 0 ); c.lineTo( 1, 4 );
    c.moveTo( 7, 0 ); c.lineTo( 7, 4 );
    c.closePath();
    c.stroke(); 

    context.restore(); 
  };


  //--------------------------------------------------

  /*
  * handle player rotation based on our mouse coordinates,
  * to be called before rendering (allows user to explore different angles).
  */ 
  Player.prototype.calculate_rotation = function() {
    var game = yarn,
      player = this;
    var x1 = player.x,
      y1 = player.y,
      x2 = game.mouse_x,
      y2 = game.mouse_y,
      dx, dy; 

    if ( x2 == -1 || y2 == -1 ) {
      return; //..no rotation specified yet..
    }
    dx = x2 - x1;
    dy = y2 - y1; 
    player.theta = -Math.atan2( dx, dy ); 
  };

  Player.prototype.draw = function() {
    var player = this,
      context = yarn.context,
      game_proto = GameObject.prototype; 
    player.calculate_rotation();

    context.save();

    context.setTransform( 1, 0, 0, 1, 0, 0 ); // identity
    context.strokeStyle = '#00FF00';
    context.translate( 
            player.x - game_proto.HALF_HIT_WIDTH, 
            player.y - game_proto.HALF_HIT_HEIGHT ); // start drawing at the player's coordinates.

    var theta_offset = 1.57; // 90 degress offset in radians (due to html5 canvas).
    context.rotate( player.theta + theta_offset ); 

    context.translate( 
            -game_proto.HALF_HIT_WIDTH, 
            -game_proto.HALF_HIT_HEIGHT ); //..draw based off center of rotation..


    context.beginPath();
    context.moveTo( 0, 0 );   context.lineTo( 32, 16 );
    context.moveTo( 0, 32 );  context.lineTo( 32, 16 );
    context.moveTo( 4, 2 ); context.lineTo( 4, 30 );
    context.moveTo( 8, 4 ); context.lineTo( 8, 28 );
    context.closePath();
    context.stroke(); 
   

    context.restore(); 
  }; 

  /*
  * Player overrides game-object's update;
  * allows the user to conduct keyboard control over movement.
  */
  Player.prototype.update = function() {
    var player = this,
      speed = this.SPEED,
      game = yarn; 
    
    var keys = game._keys,
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
  * Generate a Bacteria game object.
  * @return Bacteria
  */ 
  ManufacturingPlant.prototype.make_bacteria = function() {
    var plant = this;
    var bug = $.extend( {}, 
        new GameObject, 
        new Bot,
        new Bacteria ); 

    // TODO set the bot's sprite...

    return bug
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


