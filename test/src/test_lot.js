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
    //expect( 5 );

    var lots = yarn.graph._lots,
        graph = yarn.graph;

    var top_left_corner =     graph.find_lot( 0, 0 ); 
    equal( top_left_corner._neighbors.length, 3, "The top left corner should have exactly 3 neighbors" ); 
    var top_right_corner =    graph.find_lot( yarn.CANVAS_WIDTH, 0 );
    equal( top_right_corner._neighbors.length, 3, "The top right corner should have exactly 3 neighbors" ); 
    var bottom_left_corner =  graph.find_lot( 0, yarn.CANVAS_HEIGHT );
    equal( bottom_left_corner._neighbors.length, 3, "The bottom left corner should have exactly 3 neighbors" ); 
    var bottom_right_corner = graph.find_lot( yarn.CANVAS_WIDTH, yarn.CANVAS_HEIGHT ); 
    equal( bottom_right_corner._neighbors.length, 3, "The bottom right corner should have exactly 3 neighbors" );

    var x,
        y,
        lot,
        b = true;
    var reset_x_and_y = function() {
      x = y = 0;
    }
    var next_x = function() {
      x += 20; 
      return x;
    }; 
    var next_y = function() {
      y += 20; 
      return y;
    };
    var check_edges_for_a_side = function( next_x, next_y ) { 
      var lot = graph.find_lot( next_x(), next_y() );
      var x, y;
      while ( lot ) {
        if ( lot !== top_left_corner
            && lot !== top_right_corner
            && lot !== bottom_left_corner
            && lot !== bottom_right_corner ) {
          if ( !b ) {
            break;
          }
          b = lot._neighbors.length == 5; 
        }
        x = next_x(); y = next_y();
        if ( x > yarn.CANVAS_WIDTH
            || y > yarn.CANVAS_HEIGHT ) {
          break;
        }
        lot = graph.find_lot( x, y );
      } 
    };

    reset_x_and_y();
    check_edges_for_a_side( next_x, function(){return 0} );                    // top   
    reset_x_and_y();
    check_edges_for_a_side( function(){return 0}, next_y );                    // left  
    reset_x_and_y();
    check_edges_for_a_side( function(){return yarn.CANVAS_WIDTH }, next_y );   // right  
    reset_x_and_y();
    check_edges_for_a_side( next_x, function(){ return yarn.CANVAS_HEIGHT } ); // bottom 
    reset_x_and_y(); 
    equal( b, true, "edges (excluding corners) should have exactly 5 neighbors" );

    var w = graph.NUMBER_OF_LOTS_HORIZONTALLY;
    var middle_lots = _.chain( graph._lots )
        .select( function( it ) { return it.grid_index > w } )        // Exclude top edge. 
        .select( function( it ) { return it.grid_index < ( graph.NUMBER_OF_LOTS_VERTICALLY 
            * ( w - 1 ) ) } )                                  // Exclude bottom edge.
        .select( function( it ) { return 0 !== it.grid_index % w } )  // Exclude left edge.
        .select( function( it ) { return w - 1 !== it.grid_index % w } )  // Exclude right edge.
        .value();
    equal( false, 
        _.chain( middle_lots )
            .collect( function( it ) { return 8 == it._neighbors.length } ) 
            .contains( false )
            .value()
        , "\"middle\" lots should be surround by exactly 8 neighboring lots." ); 

    var is_not_all_atleast_3_neighbors = _.chain( graph._lots )
        .collect( function( it ) { return it._neighbors.length >= 3; } )
        .contains( false )
        .value();
    equal( false, is_not_all_atleast_3_neighbors, "All lots should have at least 3 neighbors." );

    var is_not_all_under_8_neighbors = _.chain( _.collect( graph._lots, function( lot, idx ) {
          return lot._neighbors.length < 9;    
        } ) )
        .contains( false ) 
        .value();
    equal( false, is_not_all_under_8_neighbors, "All lots should have at most 8 neighbors." ); 

  }); 

  test( "Lots provide a way to store temporal information about an area", function(){
    expect( 2 );

    reset_game_objects();

    // TODO is_bountiful, etc.
    var graph = yarn.graph,
        bug = yarn.plant.make_bacteria().set_position( 77, 77 ),
        lot; 
    graph.push( bug ); yarn.tick(); yarn.tick();
    lot = graph.find_lot( bug.x, bug.y );
    var pop_lvl_1 = lot[ "_population_level" ] || 0;
    bug.reproduce();
    var i = bug.REPRODUCTION_TIME + 2;  //..plus add-to-graph time..
    while ( i-- ) {
      yarn.tick();
    }
    var pop_lvl_2 = lot[ "_population_level" ] || 0; 
    equal( true, pop_lvl_2 > pop_lvl_1, "Bacteria should be able to communicate about population density information." );

    var danger_lvl_1 = lot[ "_danger_level" ] || 0;
    bug.kill(); yarn.tick(); yarn.tick(); 
    var danger_lvl_2 = lot[ "_danger_level" ] || 0;
    equal( true, danger_lvl_2 > danger_lvl_1, "Bacteria should be able to communicate danger." ); 
  }); 

  test( "Lots communicate with neighbors in a rippling \"signal\" effect", function(){ 
    reset_game_objects(); 
    var graph = yarn.graph, 
        w = yarn.CANVAS_WIDTH,
        h = yarn.CANVAS_HEIGHT;
    var center_lot = graph.find_lot( w * 0.5, h * 0.5 );

    //..closure to collect signal information..
    var collect_signals = function( lots ) {
        return _.chain( lots )
        .collect( function( it ) {  
          return {  
            "_danger_level":     it._danger_level,
            "_population_level": it._population_level
          };
        } )
        .value(); 
    };

    //
    // Before.
    //

    var adjacent_signals_initial = collect_signals( center_lot._neighbors ); 
    var outer_neighbors = _.chain( center_lot._neighbors )
        .collect( function( it ) {
          return it._neighbors;
        } )
        .flatten( true )  //..flatten the nested lists by 1 level.. 
        .select( function( it ) {
          return !_.contains( center_lot._neighbors, it ) && !_.isEqual( center_lot, it ) ;
        } )
        .uniq()
        .value(); // TODO this incorrectly collects 16 outer-neighbors instead of the expected (4+4+3+3=) 14.
    var outer_neighbor_signals_initial = collect_signals( outer_neighbors ); 

    //
    // Send out "Lot" signals.
    //

    center_lot.mark_dangerous();
    center_lot.mark_crowded(); 

    //
    // After.
    //

    var adjacent_signals_final = collect_signals( center_lot._neighbors );
    var outer_neighbor_signals_final = collect_signals( outer_neighbors ); 

    equal( true, 
        center_lot[ "_danger_level" ] > adjacent_signals_final[ 0 ][ "_danger_level" ], 
        "The signal center should be the strongest signal carrier." ); 

    var total_signal_by_name = function( lots, signal_name ) {
      return _.chain( lots )
          .collect( function( it ) { 
            return it[ signal_name ] || 0;
          } )
          .reduce( function( memo, it ) {
            return memo + it;
          } )
          .value(); 
    }; 

    var danger_levels_initial = total_signal_by_name( adjacent_signals_initial, "_danger_level" );
    var danger_levels_final  =  total_signal_by_name( adjacent_signals_final,   "_danger_level" ); 
    equal( true, 
        danger_levels_final > danger_levels_initial, 
        "Given a \"dangerous\" lot, it's neighbors should be aware of their indangerment." );

    var population_levels_initial = total_signal_by_name( adjacent_signals_initial, "_population_level" );
    var population_levels_final  =  total_signal_by_name( adjacent_signals_final,   "_population_level" ); 
    equal( true, 
        population_levels_final > population_levels_initial, 
        "Given a \"crowded\" area, it's surrounding neighbors should feel somewhat crowded too." ); 

    var outer_danger_levels = total_signal_by_name( outer_neighbor_signals_final, "_danger_level" );
    equal( true, 
        outer_danger_levels < danger_levels_final, 
        "Adjacent neighbors should receive \"stronger\" signals relative to outer/distance neighbors." ); 
  }); 

  test( "Lot signals decay", function() { 
    reset_game_objects();
    var graph = yarn.graph, 
        w = yarn.CANVAS_WIDTH,
        h = yarn.CANVAS_HEIGHT;
    var center_lot = graph.find_lot( w * 0.5, h * 0.5 );

    center_lot.mark_dangerous();
    var signal_initial = center_lot._danger_level;
    yarn.tick(); 
    var signal_after_1_turn = center_lot._danger_level; 
    equal( true, 
        signal_after_1_turn < signal_initial, 
        "should be less signal after 1 turn." );

    var turns = 100;
    while ( turns-- ) {
      yarn.tick();
    }
    var signal_after_many_turns_later = center_lot._danger_level; 
    equal( true, 
        ( signal_after_many_turns_later - 0.05 ) < 0, 
        "should eventually approach a signal strength of zero." ); 
  } );

  setTimeout( run_demo, 1000 ); 
} 

/* Reset our lot-grid spatial-signal information along with the game-graph. */
var reset_game_objects = function() {
  _.each( yarn.graph._lots, function( lot ) {
      lot.clear_signals();
  } ); 
  yarn.graph._clear_game_graph();
};

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
