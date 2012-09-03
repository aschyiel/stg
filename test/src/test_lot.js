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
* test lot.js, uly, sept2012
*
* Lots record passing infomation about a local area/allotment of space.
* They represent cellular entities communicating chemical signals with each other,
* and game-design-wise, the hope is to allow emergent behavior to proliferate.
*
*/ 
var main = function()
{ 
  console.debug( "test_bot start." );
  yarn.pause(); 

  test( "The game graph initializes the setup of the lot-matrix", function(){
    expect(1);
    equal( false, true, "Edges should have less neighbors." );
    equal( false, true, "should be as wide as the game field. " );
    equal( false, true, "should be as tall as the game field. " );
  }); 

  test( "Surrounding \"cell-walls\" constitution is bound to their lots,", function(){
    expect(1);
    equal( false, true, "therefore when there is too many bacteria, they should \"die\"." );
  }); 

  yarn.resume(); 
} 

$(document).on( yarn.EVENT_GAME_READY, main ); 
