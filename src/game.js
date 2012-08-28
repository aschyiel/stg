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
* game.js, uly, aug2012
*
* singleton,
* has "official" prototype,
* game.js runs the yarn game, and controls it's top level game-states,
* as well as delegating events (such as keyboard events).
*
* game.js uses the global namespace "yarn"
*
* references:
*   game loops:
*   http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
*   https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame
*
*   math:
*   http://james.padolsey.com/javascript/double-bitwise-not/
*
*/
yarn = (function(){

  //
  // private class,
  // to help define some properties belonging to our game.
  //

  var YarnGame = function(){
    var game = this;
    //
    // game states.
    //
    game.GAME_IS_PAUSED = 1;
    game.GAME_IS_RUNNING = 2; 

    // The current game state.
    game.state = -1; 

    // The canvas view we will draw to.
    game.canvas = null;

    // the current frames per second we are running at.
    // for testing purposes.
    game.fps = 0; 

    game._are_all_keys_up = true;
  }; 
  return new YarnGame();
})();

yarn.EVENT_GAME_READY = "YARN_EVENT_GAME_READY";


//--------------------------------------------------

/*
* magically normalize the requestAnimationFrame api (from developer.mozilla.org).
*/
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

//--------------------------------------------------

/**
* @public
* round a number.
* @param n - the number to round.
* @return number.
*/
yarn.round = function( n ) {
  return ~~( n + 0.5 );
}; 

/*
* returns true if the game is paused.
*/
yarn.is_paused = function() {
  return this.state == this.GAME_IS_PAUSED;
}

/*
* pause the game.
*/
yarn.pause = function() {
  var game = this;
  game.state = game.GAME_IS_PAUSED;
};

/*
* resume the game.
*/ 
yarn.resume = function() {
  var game = this;
  if ( game.GAME_IS_RUNNING == game.state || game._is_looping ) {
    console.warn( "redundant resume called, game is already running so ignoring request to resume..." );
    return;
  }

  game.state = game.GAME_IS_RUNNING;
  game._timestamp = new Date(); 
  window.webkitRequestAnimationFrame( game.run ); 
  game._is_looping = true;
};

/*
* @private
* update our game stats such as frames per second,
* mostly for debugging purposes.
*
* @param delta - the difference in milliseconds between now and our last update.
* @return void
*/
yarn.update_stats = function( delta ) {
  var game = yarn;
  var fps = game.round( 1000 / delta );
  game.fps = fps; // used in testing to verify game loop is running.
//console.debug( "fps:"+fps );  // TODO draw this...
};

/*
* @private,
* used to compare against the game loops timestamp
* to calculate our delta time in milliseconds.
*
* This needs to get reset on resume.
*/
yarn._timestamp = new Date();

/*
* run our game loop,
* called by request animation frame.
*/
yarn.run = function( timestamp ) { 
  var game = yarn;
  if ( game.is_paused() ) { 
    game._is_looping = false;
    return;
  }
  var delta_time = timestamp - game._timestamp;
  game.update_stats( delta_time ); 
  game.graph.draw();
  if ( !game._are_all_keys_up ) { 
    game.tick();
  } 
  game._timestamp = new Date();
  window.requestAnimationFrame( game.run );
}; 

/*
* animate our game for a single cycle/animation-frame;
* Because this is a separate function from yarn.run, it simplifies unit testing.
* @param dt - delta time in msec.
* @return void
*/
yarn.tick = function( dt ) {
  console.debug( "..yarn.tick.." );
  var yarn = this;
  if ( !yarn.graph ) {
    console.warn( "graph is not ready yet, ignoring tick request. Try using the EVENT_GAME_READY event?" );
    return;
  }

  yarn.graph.update_world( dt ); 
}; 

/*
* Holds the current keyboard state,
* true represents keydown.,
* and false repsents keyup.
*/
yarn._keys = [];

/*
* the game's keydown handler.
* The way yarn is setup, the user controls the world's "tick-rate" 
* based on how much user-input they put in.
*
* When keys aren't being pressed down, it effectively 
* pauses/suspends the game world's physics;
* Thus giving the player time to think their next move out.
*/
yarn.handle_keydown = function( event ) {
  var game = yarn;
  console.debug( "keydown event.keyCode:"+event.keyCode ); 
  switch ( event.keyCode ) {
    case 32:  /* spaceBar */
    case 65:  /* a */
    case 68:  /* d */
    case 80:  /* "p" */
    case 83:  /* s */
    case 87:  /* w */ 
      yarn._keys[ event.keyCode ] = true;
      game._are_all_keys_up = false;
      break; 
    default:
      break;
  } 
}; 

yarn.handle_keyup = function( event ) {
  var game = yarn;
  switch ( event.keyCode ) {
    case 32:  /* spaceBar */
    case 65:  /* a */
    case 68:  /* d */
    case 80:  /* "p" */
    case 83:  /* s */
    case 87:  /* w */
      yarn._keys[ event.keyCode ] = false;
      break; 
    default:
      break;
  } 
  var are_up = true,
    keys = yarn._keys;
  are_up = are_up || keys[ 32 ]; 
  are_up = are_up || keys[ 65 ]; 
  are_up = are_up || keys[ 68 ]; 
  are_up = are_up || keys[ 80 ]; 
  are_up = are_up || keys[ 83 ]; 
  are_up = are_up || keys[ 87 ]; 

  game._are_all_keys_up = are_up;
};

yarn.handle_click = function( event ) {
  console.debug( "click, \"X\":"+event.offsetX+", \"Y\":"+event.offsetY );
};

yarn.CANVAS_HEIGHT = 400;
yarn.CANVAS_WIDTH =  600;

/*
* temporary...
*/
yarn._setup_sandbox = function() {
  var game = this;
  game.graph.push( game.plant.make_bot().set_position( 20, 20 ).set_velocity( 5,  5 ) );
  game.graph.push( game.plant.make_bot().set_position( 40, 80 ).set_velocity( 2, -1 ) );
};

//--------------------------------------------------

/*
* anonymous,
* setup our game to run.
*/
(function() {
  var game = yarn;
  $(document).ready(function(){
    console.debug( "setting up yarn, and kick-starting the game loop." );
    var $canvas = $( 'canvas.yarn' );
    var $doc = $(document);
    $doc.keydown( function(e) { yarn.handle_keydown( e ) } );  // TODO only listen to 
    $doc.keyup(   function(e) { yarn.handle_keyup(   e ) } );  // canvas's key events..
    $doc.click(   function(e) { yarn.handle_click(   e ) } );  
    game.canvas = $canvas[0];
    game.canvas.height = yarn.CANVAS_HEIGHT;
    game.canvas.width =  yarn.CANVAS_WIDTH;
    game.context = game.canvas.getContext( "2d" );
    console.debug( "canvas:"+game.canvas );
    game.resume();
    $(document).trigger( game.EVENT_GAME_READY ); // needed for testing.
    yarn._setup_sandbox();
  });
}());



