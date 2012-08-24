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
  }; 
  return new YarnGame();
})();

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
} 

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
  console.debug( "fps:"+fps );  // TODO draw this...
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
  game.tick( delta_time );
  game._timestamp = new Date();
  window.requestAnimationFrame( game.run );
}; 

yarn.WORLD_STEP_FRAME_RATE = 1 / 60;
yarn.VELOCITY_ITERATIONS = 8;
yarn.POSITION_ITERATIONS = 3;

/*
* animate our game for a single cycle/animation-frame;
* Because this is a separate function from yarn.run, it simplifies unit testing.
* @param dt - delta time in msec.
* @return void
*/
yarn.tick = function( dt ) {
  var yarn = this;
  if ( !yarn.graph ) {
    console.warn( "graph is not ready yet, ignoring tick request. Try using the EVENT_GAME_READY event?" );
    return;
  }
  var world = yarn.graph.world;

  yarn.graph.update( dt );

  world.Step( yarn.WORLD_STEP_FRAME_RATE, 
              yarn.VELOCITY_ITERATIONS, 
              yarn.POSITION_ITERATIONS ); 
  world.DrawDebugData();  // TODO
  world.ClearForces();
} 

yarn.EVENT_GAME_READY = "YARN_EVENT_GAME_READY";

/*
* anonymous,
* setup our game to run.
*/
(function() {
  $(document).ready(function(){
    console.debug( "setting up yarn, and kick-starting the game loop." );
    var game = yarn; 
    game.canvas = $( 'canvas.yarn' )[0];
    game.resume();
    $(document).trigger( game.EVENT_GAME_READY ); // needed for testing.
  });
}());

