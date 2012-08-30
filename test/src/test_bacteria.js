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
* test bacteria.js, uly, aug2012
*
* Bacteria represent bad guys in yarn; They are modeled after bacteria in microbiology.
* Bacteria do binary-fission, tumble-run movement, and "smell" their environments.
*/ 

var main = function()
{ 
  console.debug( "test_bot start." );
  yarn.pause(); 

  test( "Bacteria use tumble-run for their motility, and they", function(){
    expect(4);
    equal( false, true, "should pick a random direction when they tumble." );
    equal( false, true, "should move in a straight line when they run." );
    equal( false, true, "should run less if they are going in the wrong direction." );
    equal( false, true, "should run more if they are going in the right direction." ); 
  }); 

  test( "Bacteria can sense their immediate environment, and they", function(){
    expect(3);
    equal( false, true, "should move away from danger." );
    equal( false, true, "should move towards resources." );
    equal( false, true, "should try to move away from each other and spread out." );
  }); 

  test( "Bacteria reproduce via binary-fission, and they", function(){
    expect(4);
    equal( false, true, "should reproduce every 20 game-loop-cycles." );
    equal( false, true, "should create a new bacteria from the exsiting bacteria." );
    equal( false, true, "should not be \"tumbling\" while reproducing." );
    equal( false, true, "should not be \"running\" while reproducing." );
  }); 
 
  test( "Bacteria are suspectible to anti-biotics, and they", function(){
    expect(3);
    equal( false, true, "should get mostly killed from exposure to \"new\" anti-biotics." );
    equal( false, true, "should not be completely killed off from anti-biotics." );
    equal( false, true, "should build up a resistance to \"old\" anti-biotics." );
  }); 

  test( "Bacteria are game objects that take damage, and they ", function(){
    expect(2);
    equal( false, true, "should be able to be killed." );
    equal( false, true, "should die after 1 point of damage." );
  }); 

  test( "Bacteria are game objects that deal damage to \"cell-walls\", and they ", function(){
    expect(2);
    equal( false, true, "should actually deal damage to cell-walls." );
    equal( false, true, "should be able to destroy cell-walls." );
  }); 

  yarn.resume(); 
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
