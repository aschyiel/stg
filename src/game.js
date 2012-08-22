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
*/
var yarn = function(){
  return { 
    GAME_IS_PAUSED: 1,
    GAME_IS_RUNNING: 2, 
    state: null,
    canvas: null
  };
}; 

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
  game.state = game.GAME_IS_RUNNING;
};

/*
* anonymous,
* setup our game.
*/
(function() {
  var game = yarn;
  game.state = game.GAME_IS_RUNNING;

  game.canvas = $( 'canvas.yarn' )[0];

})();

