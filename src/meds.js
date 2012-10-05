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
/*global yarn:true  */
//-------------------------------------------------- 
/*
* ..meds.js, uly, sept2012..
*
* The MedicineCabinet (yarn.meds) provides various ways 
* of treating/killing micro-organisms 
* and provides the player a way of "nuking" waves of in-game enemies.
*
* Modeled after biology, anti-biotics and other treatments facilitate 
* artificial selection and after a while in-game enemies/bacteria 
* will eventually become resistant.
*/
yarn.meds = (function(){

  var MedicineCabinet = function() {};

  //
  // pseudo constants used to mark survivors of 
  // which treatments they are now resistant to.
  //
  // Used in bit-wise OR statements as multi-resistance flags.
  // http://stackoverflow.com/questions/261062/when-to-use-bitwise-operators-during-webdevelopment
  //
  MedicineCabinet.prototype.TYPE_PENICILLIN = 1;
  MedicineCabinet.prototype.TYPE_X =          2;
  MedicineCabinet.prototype.TYPE_Y =          4;
  MedicineCabinet.prototype.TYPE_Z =          8;
  MedicineCabinet.prototype.TYPE_T =         16;
  MedicineCabinet.prototype.TYPE_Y =         32;

  //
  // The probability of wiping out targeted specimen 
  // (effectiveness) for each treatment.
  //
  MedicineCabinet.prototype.PENICILLIN_EFFECTIVENESS = 0.9;

  /*
  * Apply penicillin to the game world and kill a bunch 
  * of bacteria during the next "turn".
  *
  * from wikipedia:
  * beta-Lactam antibiotics inhibit the formation of peptidoglycan 
  * cross-links in the bacterial cell wall, 
  * but have no direct effect on cell wall degradation.
  * 
  * TODO synergistic effect with aminoglycosides.
  */
  MedicineCabinet.prototype.apply_penicillin = function() {
    var meds = this;
    var the_one = true;
    yarn.graph.onetime_update_callback( function( game_object ) { 
      if ( !game_object || !game_object.is_bacteria )  {
        return;
      } 
      meds._apply_antibiotic( game_object, 
                              meds.TYPE_PENICILLIN, 
                              meds.PENICILLIN_EFFECTIVENESS,
                              the_one );
      the_one = false;
    } );
  }; 

  /*
  * to be used as reusable "update_callback" closures applying various antibiotics against bacteria.
  *
  * TODO ensure at least one bug gets squished?
  *
  * @param bug -                      (Bacteria) passed in from yarn.graph during update_world.
  * @param antibiotic_type -          a power of two representing an antibiotic type we are applying.
  * @param antibiotic_effectiveness - the probability of killing an uninitiated bacterial victim.
  * @param is_forced_survivor -       if false will force at least one bacteria to survive and become resistant.
  * @return void
  */
  MedicineCabinet.prototype._apply_antibiotic = function( bug, 
                                                          antibiotic_type, 
                                                          antibiotic_effectiveness,
                                                          is_forced_survivor ) {
    var resistance = bug.resistance || 0;
    if ( resistance & antibiotic_type ) {
      return; //..lucky bugger lives (resistant)..
    }
    if ( is_forced_survivor ) {
      bug.resistance = resistance | antibiotic_type;
      return;
    } 
    if ( Math.random() < antibiotic_effectiveness ) {
      bug.kill(); 
    } else {
      bug.resistance = resistance | antibiotic_type; 
    } 
  };

  //--------------------------------------------------
  return new MedicineCabinet(); 
})();

