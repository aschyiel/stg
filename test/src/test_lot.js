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
  yarn.pause(); 

  test( "The game graph initializes the setup of the lot-matrix", function(){
    expect( 7 );

    var width = yarn.CANVAS_WIDTH;
    var steps = 12; // The number of steps to test should be larger than 8 (width of canvas in "Lots").
    var step = width / steps;
    var lots = []; 
    var i = steps; while ( i-- ) {
      lots.push( yarn.graph.find_lot( i * step, 0 ) ); // search for lots moving horizontally 
                                                       // along the top of the game board.
    }
    lots = _.unique( lots ); 
    lots = _.select( lots, function( item ) { return !!item; } );
    equal( lots.length, 8, "should be 8 lot-cells wide." );
    equal( yarn.graph.NUMBER_OF_LOTS_HORIZONTALLY, 8, "should be 8 lot-cells wide as defined in the prototype." );

    var height = yarn.CANVAS_HEIGHT;
    step = height / steps;
    i = steps = 21;
    lots = [];
    while ( i-- ) {
      lots.push( yarn.graph.find_lot( 0, i * step ) ); // search for lots moving vertically 
                                                       // along the left edge of the game board.
    } 
    lots = _.unique( lots ); 
    lots = _.select( lots, function( item ) { return !!item; } );
    equal( lots.length, 8, "should be 8 lot-cells tall." );
    equal( yarn.graph.NUMBER_OF_LOTS_VERTICALLY, 8, "should be 8 lot-cells tall as defined." );

    equal( yarn.graph._lots.length, 64, "should contain 64 lot-cells (just like a chess board)." );

    // TODO these are indirect tests and therefore bad...

    equal( 
        yarn.graph.NUMBER_OF_LOTS_HORIZONTALLY * yarn.graph.LOT_WIDTH, 
        yarn.CANVAS_WIDTH, 
        "should exactly fill the game width." );


    equal( 
        yarn.graph.NUMBER_OF_LOTS_VERTICALLY * yarn.graph.LOT_HEIGHT, 
        yarn.CANVAS_HEIGHT, 
        "should exactly fill the game board vertically." );
  }); 

  test( "Lots have neighbors", function(){
    equal( false, true, "corners shuld have exactly 3 neighbors" );
    equal( false, true, "edges (excluding corners) shuld have exactly 5 neighbors" );
    equal( false, true, "\"middle\" lots should be surround by exactly 8 neighboring lots." );
    equal( false, true, "All lots should have at least 3 neighbors." );
    equal( false, true, "All lots should have at most 8 neighbors." ); 
  }); 

  test( "Surrounding \"cell-walls\" constitution is bound to their lots,", function(){
    expect(1);
    equal( false, true, "therefore when there is too many bacteria, they should \"die\"." );
  }); 

  test( "The \"Lot-grid\" provides a way detect GameObject collisions.", function(){
  });

  test( "GameObjects are assigned to lots during game play based on position", function(){
    equal( false, true, "and should have a lot by default when added to the game graph." );
    equal( false, true, "and should be reassigned to a different lot when they move accross the playing field." );
    equal( false, true, "and multiple GameObjects should share the same lot if they are close enough." );
  });

  test( "Lots provide a way to store temporal information about an area", function(){
    expect( 3 );
    // TODO is_bountiful, etc.
    equal( false, true, "Bacteria should be able to communicate about population density information." );
    equal( false, true, "Bacteria should be able to communicate danger." );
    equal( false, true, "Lots should provide information on the area's resources abundance." );
  }); 

  test( "Lots communicate with neighbors in a rippling \"signal\" effect", function(){
    equal( false, true, "Given a \"dangerous\" lot, it's neighbors should be aware of their indangerment." );

  }); 

  test( "Lot signals decay", function() { 
    equal( false, true, "should be less signal after 1 turn." );
    equal( false, true, "should eventually approach a signal strength of zero." ); 
  } );

  setTimeout( run_demo, 1000 ); 
} 

var run_demo = function() {
  yarn.graph._clear_game_graph(); 
  yarn.tick();
 
  var x = yarn.HALF_CANVAS_WIDTH,
      y = yarn.HALF_CANVAS_HEIGHT;

  yarn.graph.push( yarn.plant.make_player().set_position( x, y ) );
  yarn.graph.push( yarn.plant.make_bacteria().set_position( x - 50, y ) ); 

  yarn.tick();
  yarn.resume();
};

$(document).on( yarn.EVENT_GAME_READY, main ); 
