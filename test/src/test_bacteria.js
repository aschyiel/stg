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

/*
* calculate the distance of a given point from the center of the canvas.
*/
var get_distance_from_center = function( x, y ) {
  var a = Math.abs( x - yarn.HALF_CANVAS_WIDTH ), 
      b = Math.abs( y - yarn.HALF_CANVAS_HEIGHT ); 
  return Math.sqrt( a*a + b*b );
}

/*
* Calculate the angle (in radians) given a point from the center of the canvas.
*/
var get_angle_from_center = function( x, y ) {
  var delta_x = x - yarn.HALF_CANVAS_WIDTH,
      delta_y = y - yarn.HALF_CANVAS_HEIGHT;
  var rads = Math.atan2( delta_x, delta_y );
  return rads;
}

/*
* round to 3 decimal places for testing purposes.
*/
var round = function( n ) {
  return Math.round( n * 1000 )/1000; 
}

var main = function()
{ 
  console.debug( "test_bot start." );
  yarn.pause(); 

  test( "Bacteria use tumble-run for their motility, and they", function(){
    expect(5); 
    var bug = yarn.plant.make_bacteria();

    bug.tumble();
    var theta_0 = bug.theta;
    bug.tumble(); 
    equal( bug.theta !== theta_0, true, "should pick a random direction when they tumble." );

    var reset_bug = function(){ bug.set_position( yarn.HALF_CANVAS_WIDTH, yarn.HALF_CANVAS_HEIGHT ); };
    reset_bug(); bug.run(); 
    //
    // depending on your perspective, it either turned left or right,
    // but the net-effect on the rotational angle is still the same.
    //
    equal( ( round( bug.theta ) == round( get_angle_from_center( bug.x, bug.y ) ) ||
        ( round( 2 * Math.PI ) == round( Math.abs(bug.theta) + Math.abs(get_angle_from_center( bug.x, bug.y )) ) ) ), 
        true,
        "should move in a straight line when they run." );

    var get_d = function() { 
          var d = get_distance_from_center( bug.x, bug.y );
          console.debug( "distance:"+d );
          return d;
        };
    reset_bug(); bug.run( bug.NEUTRAL_DIRECTION );
    var normal_run_distance = get_d(); 

    equal( round(normal_run_distance), bug.SPEED, "should run a distance based on speed (ie. 5 units)." );

    reset_bug(); bug.run( bug.WRONG_DIRECTION );
    equal( normal_run_distance > get_d(), true, "should run less if they are going in the wrong direction." );

    reset_bug(); bug.run( bug.CORRECT_DIRECTION );
    equal( normal_run_distance < get_d(), true, "should run more if they are going in the right direction." ); 
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
