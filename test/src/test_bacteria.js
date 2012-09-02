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

  test( "Bacteria can sense/communicate chemical signals within their immediate environment, and they", function(){
    expect(4);

    var bug = yarn.plant.make_bacteria();
    var lot = yarn.plant.make_lot(); 
    lot.mark_dangerous();
 
    equal( bug.determine_intent( lot ), bug.WRONG_DIRECTION, 
        "should try to move away from danger." );

    lot.clear_signals();
    lot.mark_bountiful(); 
    equal( bug.determine_intent( lot ), bug.CORRECT_DIRECTION, 
        "should try to move towards resources." );

    lot.clear_signals();
    lot.mark_crowded(); 
    equal( bug.determine_intent( lot ), bug.WRONG_DIRECTION, 
        "should try to move away from each other and spread out." );

    lot.clear_signals();
    bug.set_lot( lot );
    bug.kill();
    equal( lot.is_dangerous(), true, 
        "should let other bacteria know that an area is dangerous on death." );
  }); 

  test( "Bacteria reproduce via binary-fission, and they", function(){
    expect(5);
    var bug = yarn.plant.make_bacteria(); 
    
    equal( bug.is_reproducing(), false, "should not be reproducing when a bacteria is first instantiated." );

    var i = 20;
    while ( i-- ) { 
      bug.update();
    } 
    equal( bug.is_reproducing(), true, "should reproduce after every 20 game-loop-cycles." );

    var previous_count = yarn.graph._game_objects.length;
    i = 6;
    while ( i-- ) { 
      bug.update();
    } 
    yarn.graph.update_world();  // note:Additions require calling update_world.
    equal( !bug.is_reproducing() && yarn.graph._game_objects.length > previous_count, true, 
        "should take 5 cycles to complete the process." );

    equal( yarn.graph._game_objects.length > previous_count, true, 
        "should create a new bacteria from the existing bacteria so that they \"double\" in number." );

    var x = 0, 
        y = 0;
    bug.set_position( x, y );
    bug.reproduce();
    while ( bug.is_reproducing() ) {
      bug.update();
    }
    equal( bug.x === x && bug.y === y, true, "should not be moving while they reproducing." );
  }); 
 
  test( "Bacteria are suspectible to anti-biotics, and they", function(){
    expect(3);
    //TODO play around with the idea of different kinds of anti-biotics -- growth inhibitors, etc...

    yarn.graph._clear_game_graph();
    var i = 10;
    while ( i-- ) {
      yarn.graph.push( yarn.plant.make_bacteria() );
    }
    yarn.graph.update_world();
    var initial_bug_count = yarn.graph.length;
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
