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
* test game.js, uly, aug2012
*
* Run some qunit tests against the yarn's game.js.
* check stuff like keyboard input,
* toggling game state,
* throttling refresh rates, etc.
*
*/ 
$(document).ready(function(){ main(); });

var main = function()
{ 

  test( "html view", function(){
    expect(1);
    var canvas = $('canvas.yarn')[0];
    equal( !!canvas, true, "should provide a canvas of class \".yarn\"." );
  });

  test( "The global \"yarn\" should exist.", function(){
    expect(2);
    equal( !!window.yarn, true, "\"yarn\" is our namespaced global variable (ie window.yarn)." );
    equal( !!window.yarn.canvas, true, "\"yarn\" should have a handle to it's canvas via yarn.canvas." );
  });

  test( "game states", function(){
    equal( yarn.state, yarn.GAME_IS_RUNNING, "the game by default should be running" ); 

    yarn.pause();
    equal( yarn.state, yarn.GAME_IS_PAUSED, "the game should be able to pause" ); 

    yarn.resume();
    equal( yarn.state, yarn.GAME_IS_RUNNING, "the game should be able to resume after a pause." ); 

  }); 
}
