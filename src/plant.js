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

  // Local access to globals.
  var yarn = yarn,
      document = document,
      console = console,
      $ = $;  

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
    game_object._frame = 0;
  }; 
  var Bot =                function(){}; 
  var Bacteria =           function(){
    var bug = this; 
    bug.is_bacteria = true;
    bug.resistance = 0; /* antibiotic resistance flags. */
  }; 
  var Lot =                function() {
    var lot = this; 
    lot._neighbors = [];
  }; 
  var Player =             function(){}; 
  var Projectile =         function(){}; 

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
  * chainable,
  * for testing purposes it is convenient to quickly randomize 
  * the position/rotation/etc. of a given gameObject.
  *
  * To be called before adding to the game graph (simplifies lot assignment).
  *
  * @return GameObject.
  */
  GameObject.prototype.randomize = function() {
    var game_object = this;
    game_object.theta = ( 360 * Math.random() ) * ( Math.PI / 180 );
    game_object.set_position( 
        yarn.CANVAS_WIDTH * Math.random(), 
        yarn.CANVAS_HEIGHT * Math.random() );
    return game_object;
  };

  /*
  * returns true if the game object needs to be removed from the game.
  * ie. If a Bot gets killed, it will need to be marked for removal.
  * ie2. A projectile detonates, it will need to be removed as well.
  */
  GameObject.prototype.needs_removed = function() {
    var game_object = this;
    return 0 === game_object.hp; // TODO out-of-bounds, may be "timers"? 
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
        0 === game_object.hp;
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
  };

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

  /*
  * Levels of directional intent (to emulate chemotaxis).
  * Affects basterial run distance.
  */
  Bacteria.prototype.CORRECT_DIRECTION = 41; 
  Bacteria.prototype.WRONG_DIRECTION =   42; 
  Bacteria.prototype.NEUTRAL_DIRECTION = 43; 
  
  Bacteria.prototype.HIT_WIDTH =       8;
  Bacteria.prototype.HIT_HEIGHT =      4;
  Bacteria.prototype.HALF_HIT_WIDTH =  4;
  Bacteria.prototype.HALF_HIT_HEIGHT = 2;

  /*
  * Elucidate a bacterium's intentions to run farther or shorter 
  * with a given lot of space/chemical-signatures.
  *
  * In yarn, I've decided that bugs want outweigh eating over danger, 
  * followed by the threat of over-population.
  * Do certain flavours of bacterium vary in their choices?
  *
  * @param lot - (Lot) an area of space.
  * @return int - Bacterial sense of directionality (ie. CORRECT_DIRECTION ).
  */
  Bacteria.prototype.determine_intent = function( lot ) {
    var bug = this; 
    if ( lot.is_bountiful() ) {
      return bug.CORRECT_DIRECTION;
    } 
    if ( lot.is_dangerous() ) {
      return bug.WRONG_DIRECTION;
    }
    if ( lot.is_overcrowded() ) {
      return bug.WRONG_DIRECTION;
    } 
    return bug.NEUTRAL_DIRECTION;
  };

  /*
  * chainable,
  * Tell the bacteria to tumble and change their rotational-direction randomly.
  * To simplify testing, bacteria will never choose the same direction twice in a row.
  * @return Bacteria.
  */
  Bacteria.prototype.tumble = function() {
    var bug = this;
    bug._state = bug.IS_TUMBLING;
    var theta = bug.theta;
    while ( theta == bug.theta ) {
      bug.theta = Math.random() * 2 * Math.PI;
    }
    return bug;
  };

  /*
  * chainable,
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
    bug._state = bug.IS_RUNNING;
    intent = intent || bug.NEUTRAL_DIRECTION;

    //
    // run distance is affected by chemotaxical level of intent.
    // TODO dialize run distance modifiers?
    //
    if ( intent === bug.CORRECT_DIRECTION ) {
      distance *= 1.5;
    } else if ( intent === bug.WRONG_DIRECTION ) { 
      distance *= 0.5;
    }

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
    context.translate( 
            bug.x - bug.HALF_HIT_WIDTH, 
            bug.y - bug.HALF_HIT_HEIGHT ); 

    var theta_offset = 1.57; // 90 degress offset in radians (due to html5 canvas).
    context.rotate( bug.theta + theta_offset ); 
    context.translate( 
            -bug.HALF_HIT_WIDTH, 
            -bug.HALF_HIT_HEIGHT ); 

    context.drawImage( bug._cached_image, 0, 0 ); 

    context.restore(); 
  }; 

  /*
  * cached image of the bacteria.
  * see http://www.html5rocks.com/en/tutorials/canvas/performance/
  */
  Bacteria.prototype._cached_image = (function(){
    var bug_proto = Bacteria.prototype;
    var canvas = document.createElement( 'canvas' );
    canvas.width =  bug_proto.HIT_WIDTH;
    canvas.height = bug_proto.HIT_HEIGHT;
    
    var c = canvas.getContext( '2d' );
    c.strokeStyle = '#0000FF';

    c.beginPath();
    c.moveTo( 0, 0 ); c.lineTo( 8, 0 );
    c.moveTo( 8, 0 ); c.lineTo( 8, 4 );
    c.moveTo( 8, 4 ); c.lineTo( 0, 4 );
    c.moveTo( 0, 4 ); c.lineTo( 0, 0 );
    c.moveTo( 1, 0 ); c.lineTo( 1, 4 );
    c.moveTo( 7, 0 ); c.lineTo( 7, 4 );
    c.closePath();
    c.stroke(); 

    return canvas;
  })(); 

  /* How long bacteria take (in game-ticks) to reproduce. */
  Bacteria.prototype.REPRODUCTION_TIME = 5;

  /* How often (in game-ticks) bacteria decide to undergo reproduction. */
  Bacteria.prototype.REPRODUCTION_FREQUENCY = 20;

  /* The probability that a bacteria will go into a tunble while running. */
  Bacteria.prototype.TUMBLE_PROBABILITY = 0.3;

  /*
  * Override GameObject.prototype.update
  * @return void
  */
  Bacteria.prototype.update = function() {
    var bug = this;
    switch ( bug._state ) {
      case bug.IS_TUMBLING:
        bug.run();
        break;
      case bug.IS_RUNNING: 
        bug.set_lot( yarn.graph.find_lot( bug.x, bug.y ) );
        if ( bug._frame > bug.REPRODUCTION_FREQUENCY - 2 ) {
          bug._frame = 0;
          bug.reproduce();
          break;
        }
        if ( Math.random() < bug.TUMBLE_PROBABILITY ) {
          bug.tumble();
        } else {
          bug.run();  //..continue running..
        }
        break;
      case bug.IS_REPRODUCING:
        if ( bug._frame > bug.REPRODUCTION_TIME ) {
          bug._frame = 0;
          bug.tumble();
        } 
          bug.reproduce( bug._frame );
        break; 
      default:
        bug.tumble();
        break;
    }
    bug._frame++;
  };

  /** 
  * @public
  * Bacteria game-lot setter/getter, 
  * associates a bacterium with a plotted chemical-signal area.
  */
  Bacteria.prototype.set_lot = function( lot ) {
    var bug = this;
    bug._lot = lot;
  };
  Bacteria.prototype.get_lot = function() {
    var bug = this;
    var lot = bug._lot;
    if ( !lot ) {
      console.warn( "TODO missing lot." );  // TODO this should be managed by the graph.
    }
    return lot;
  };

  /*
  * Kill a bacterium, and mark it's surrounding area as dangerous to other bacterium.
  * overrides Bot.kill.
  * @return void
  */
  Bacteria.prototype.kill = function() {
    var bug = this,
        lot = this.get_lot();
    if ( lot ) lot.mark_dangerous();
    Bot.prototype.kill.call( bug ); 
  };

  /*
  * returns true if the selected bacteria is currently undergoing binary-fission.
  */
  Bacteria.prototype.is_reproducing = function() {
    var bug = this;
    return bug._state === bug.IS_REPRODUCING;
  };

  /**
  * Bacteria.set_position overrides GameObject.set_position.
  * @copy GameObject#set_position( x, y ).
  * @return GameObject
  */
  Bacteria.prototype.set_position = function( x, y ) {
    var bug = this;
    bug.set_lot( yarn.graph.find_lot( x, y ) );
    GameObject.prototype.set_position.call( bug, x, y );
    return bug;
  };

  /*
  * tell the bacteria to undergo reproduction.
  * This action takes n+ game ticks (as determined by REPRODUCTION_TIME).
  */
  Bacteria.prototype.reproduce = function( frame ) {
    var bug = this,
        lot;
    bug._state = bug.IS_REPRODUCING;
    if ( frame > bug.REPRODUCTION_TIME - 1 ) {
      yarn.graph.push( 
          yarn.plant.make_bacteria()
          .set_position( bug.x, bug.y ) );  //..spawn offspring..
      lot = bug.get_lot();
      if ( lot ) lot.mark_crowded();
      bug._state = bug.IS_RUNNING;
    }
  }; 

  //--------------------------------------------------

  /* Percentage decay of signal values per tick. */
  Lot.prototype.SIGNAL_DECAY = 0.5;

  /* How much signal units get added when marking something on a lot. */
  Lot.prototype.SIGNAL_FACTOR = 10;

  /* The maximum number of times a signal can be passed-on/re-told between neighbors. */
  Lot.prototype.MAX_RETELLINGS = 2; 

  /* 
  * The minimum chemical signal level to register a truth about a lot. 
  * note: should be greater than zero due to the nature of decay 
  * only approaching but never quite reaching zero.
  */
  Lot.prototype.MINIMUM_SIGNAL = 1.5; 

  /* Clear a lot's chemical signals; Effectively proclaiming a lot as being "neutral". */
  Lot.prototype.clear_signals = function() {
    var lot = this;
    lot._danger_level =     0;
    lot._population_level = 0;
    lot._resource_level =   0;
  }; 

  /*
  * semi-recursive,
  * Mark an area as dangerous and let the neighboring lots know that they are thereby indangered too.
  * @return void
  */
  Lot.prototype.mark_dangerous = function() {
    var lot = this;
    lot.mark_signal( "_danger_level" );
  };

  /*
  * semi-recursive,
  * Flag an lot area as being over-crowded (with bacteria).
  * This message is passed-along to surrounding neighbor lots.
  * @return void
  */ 
  Lot.prototype.mark_crowded = function() {
    var lot = this;
    lot.mark_signal( "_population_level" );
  };

  /*
  * @private
  * semi-recursive,
  * Pass on a chemical signal to the lot and it's surrounding neighbors.
  * @param message_attribute (string) the chemical message to pass on (Lot property to add to).
  * @param retellings (int) the number of times the "mark-as-dangerous" message has been passed on.
  *                   Defaults to 0.  
  * @return void
  */ 
  Lot.prototype.mark_signal = function( message_attribute, retellings ) {
    var lot = this;
    retellings = retellings || 1; 
    if ( retellings > lot.MAX_RETELLINGS ) {
      return;
    }

    var signal_strength = lot.SIGNAL_FACTOR / retellings;
    lot[ message_attribute ] += signal_strength;

    // 
    // psst, pass it on...
    //
    retellings++;
    $.each( lot._neighbors, function( index, neighbor ) {
      neighbor.mark_signal( message_attribute, retellings ); 
    } );
  }; 

  /**
  * Update the Lot's signal information, to be called 
  * by the game-graph during it's update-world phase.
  *
  * Since Lots aren't GameObjects, it does not override GameObject.prototype.update.
  *
  * @return void.
  */
  Lot.prototype.update = function() {
    var lot = this,
        decay = this.SIGNAL_DECAY;
    lot._danger_level *=     decay;
    lot._population_level *= decay;
    // TODO should resources decay as well?
  };

  /*
  * returns true if the lot is flagged with too many danger signals.
  */
  Lot.prototype.is_dangerous = function() {
    var lot = this;
    return lot._danger_level > lot.MINIMUM_SIGNAL;
  };

  Lot.prototype.is_overcrowded = function() {
    var lot = this;
    return lot._population_level > lot.MINIMUM_SIGNAL;
  };

  Lot.prototype.is_bountiful = function() {
    var lot = this;
    return lot._resource_level > lot.MINIMUM_SIGNAL;
  }; 

  // TODO allow setting neighboring lots in the graph?...

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

  /* The projectile weapon levels corresponding to its stats. */
  Projectile.prototype.WEAPON_LEVEL_1 = 1;
  Projectile.prototype.WEAPON_LEVEL_2 = 2;
  Projectile.prototype.WEAPON_LEVEL_3 = 3;
  Projectile.prototype.WEAPON_LEVEL_4 = 4;
  Projectile.prototype.WEAPON_LEVEL_5 = 5;
  Projectile.prototype.WEAPON_LEVEL_6 = 6;
  Projectile.prototype.WEAPON_LEVEL_7 = 7;
  Projectile.prototype.WEAPON_LEVEL_8 = 8;

  /* The rendered color is based on the weapon's level. */ 
  Projectile.prototype.COLOR_1 = '#cccccc'; /* grey         */
  Projectile.prototype.COLOR_2 = '#ffffff'; /* white        */
  Projectile.prototype.COLOR_3 = '#00ff00'; /* green        */
  Projectile.prototype.COLOR_4 = '#0000ff'; /* blue         */
  Projectile.prototype.COLOR_5 = '#ff00ff'; /* purple       */
  Projectile.prototype.COLOR_6 = '#ffcc00'; /* orange       */
  Projectile.prototype.COLOR_7 = '#ddffee'; /* pearlescent  */

  /* 
  * The base velocity used in calculating 
  * the projectile's level based trajectory velocity. 
  */ 
  Projectile.prototype.BASE_VELOCITY = 1;

  /*
  * The velocity factor used in calculating projectile velocity.
  */
  Projectile.prototype.VELOCITY_FACTOR = 0.2;

  /*
  * Set the Projectile's weapon level, 
  * affecting it's speed, damage, and other notable characteristics.
  * @param lvl  The Weapon Level as an integer, defaults to Projectile.WEAPON_LEVEL_1.
  * @return void
  */
  Projectile.prototype.set_weapon_level = function( lvl ) {
    var bullet = this;
    lvl = lvl || bullet.WEAPON_LEVEL_1;

    bullet.velocity = bullet.BASE_VELOCITY + ( bullet.BASE_VELOCITY * bullet.VELOCITY_FACTOR * lvl );

    var color = bullet.COLOR_1;
    switch ( lvl ) {
      case bullet.WEAPON_LEVEL_1:
        break; 
      case bullet.WEAPON_LEVEL_2:
        color = bullet.COLOR_2;
        break;
      case bullet.WEAPON_LEVEL_3:
        color = bullet.COLOR_3;
        break;
      default:
        // TODO other weapon levels...
        break;
    }
    bullet.color = color;
  };

  Projectile.prototype.HIT_HEIGHT = 8;
  Projectile.prototype.HIT_WIDTH =  2;
  Projectile.prototype.HALF_HIT_HEIGHT = Projectile.prototype.HIT_HEIGHT / 2;
  Projectile.prototype.HALF_HIT_WIDTH =  Projectile.prototype.HIT_WIDTH  / 2;

  /*
  * Draw the projectile.
  */
  Projectile.prototype.draw = function() {
    var bullet = this,
      context = yarn.context; 
    context.save();

    context.setTransform( 1, 0, 0, 1, 0, 0 ); 
    context.translate( 
            bullet.x - bullet.HALF_HIT_WIDTH, 
            bullet.y - bullet.HALF_HIT_HEIGHT ); 

    var theta_offset = 1.57; // 90 degress offset in radians (due to html5 canvas).
    context.rotate( bullet.theta + theta_offset ); 
    context.translate( 
            -bullet.HALF_HIT_WIDTH, 
            -bullet.HALF_HIT_HEIGHT ); 
    
    var c = context;
    c.strokeStyle = bullet.color;

    c.beginPath();
    c.moveTo( 0, 0 ); c.lineTo( 8, 0 );
    c.moveTo( 0, 1 ); c.lineTo( 8, 1 );
    c.closePath();
    c.stroke(); 

    context.restore(); 
  };

  //-------------------------------------------------- 

  /**
  * @public
  * Generate a bot game object.
  * @return bot
  */
  ManufacturingPlant.prototype.make_bot = function() {
    var bot = $.extend( {}, 
        new GameObject(), 
        new Bot() ); 

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
    var bug = $.extend( {}, 
        new GameObject(), 
        new Bot(),
        new Bacteria() ); 

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
    var player = $.extend( {}, 
        new GameObject(), 
        new Bot(),
        new Player() ); 

    // TODO set the bot's sprite...

    return player
        .set_position( 0, 0 )
        .set_velocity( 0, 0 )
        .set_health( 1 );
  }; 

  /**
  * @public
  * Generate a lot of area.  Lots convey "chemical-signal" information within an area, 
  * and are used by game-objects such as bacteria to communicate/think.
  * @return Lot
  */
  ManufacturingPlant.prototype.make_lot = function() {
    var lot = $.extend( {}, new Lot() ); 
    lot.clear_signals();
    return lot;
  };

  /**
  * @public
  * Assemble a projectile to be shot in a direction.
  * @param weapon_level   Optional, an integer representing the projectile's weapon level.
  * @return A Projectile game object.
  */
  ManufacturingPlant.prototype.make_projectile = function( weapon_level ) {
    weapon_level = weapon_level || Projectile.WEAPON_LEVEL_1;
    var projectile = $.extend( {}, 
        new GameObject(),
        new Projectile() );
    projectile.set_weapon_level( weapon_level );
    return projectile;
  };

  return new ManufacturingPlant();
})();


