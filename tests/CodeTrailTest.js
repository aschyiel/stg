/**
*   ..CodeTrailTest.js, uly, march2012..
*
*   This runs a visual test against the matrix-rip-off code trails.
*/

//
//  globals.
//

var g = {
        canvas: null,
        ctx: null, 
        gameLoop: null,
        width:  800,
        height: 600, 

        /* the global game state. */
        gameState: "PLAYING",

        /* the current stage in a level in the game. */
        //stage: 0,

        /* the current "level" in the game. */
        level: 0,

        /* show status via labels such as game progress. */
        showStats: true

        };

//
//  further global variable initialization(s).
//

g.busy = false;
g.gameFactory = new GameFactory();
g.canvas = document.getElementById('id_fg_canvas'); 

g.ctx = g.canvas.getContext('2d'); 

g.canvas.width =  g.width;
g.canvas.height = g.height; 

g.bg_canvas = document.createElement( 'canvas' );
g.bg_canvas.width = g.width;
g.bg_canvas.height = g.height;
g.bg_ctx = g.bg_canvas.getContext( '2d' );

var _bg_canvas = document.getElementById('id_bg_canvas');
_bg_canvas.width = g.width;
_bg_canvas.height = g.height;
var _bg_ctx = _bg_canvas.getContext('2d');

var clear_canvas = function(){
//  g.ctx.fillStyle = '#202020';  /* background colour. */
    g.ctx.clearRect(0, 0, g.width, g.height);
//  g.ctx.beginPath();
//  g.ctx.rect(0, 0, g.width, g.height);
//  g.ctx.closePath();
//  g.ctx.fill();
}; 

var graph = [];

var do_test_loop = function()
{ 
//console.profile();
//  if ( g.busy )
//  { 
//      g.gameLoop = setTimeout( do_test_loop, 1000 / 50);    
//  }

    if ( g.busy )
            return;

    g.busy = true;

    clear_canvas(); 

    graph.forEach(function(codeTrail)
            {
                codeTrail.draw(); 
            }); 

    _bg_ctx.drawImage( g.bg_canvas, 0, 0 ); 

//  g.gameLoop = setTimeout( do_test_loop, 1000 / 50);    
    g.gameLoop = setTimeout( do_test_loop, 20 );    
    g.busy = false;
//console.profileEnd();
};

var setup_code_trails = function()
{
    var n = 1;
    /* return a number representing the code trails "level". */
    var get_n = function()
    {
        return n++; 
    };

    var x = 0;
    var get_x = function()
    {
        return Math.floor(Math.random()*g.width); //TODO slots..
    };
    var y = 0;
    var get_y = function()
    {
        // TODO sine fxn...
        return -10;
    };

    var last_delay = 0;
    var get_delay = function()
    {
        return last_delay += 3;    
    };

    //  20 msec gameloop timeout
    //
    //  768x448
    //  64 --- 8 fps, 120 msec update frequency.
    //  32 --- 13~14 fps, 72~80 msec
    //  16 --- 20 fps, 50 msec
    //  8  --- 27 fps, 37 msec
    //


//  for ( var i=256; i > 0; i-- )
    for ( var i=64; i > 0; i-- )
//  for ( var i=32; i > 0; i-- )
//  for ( var i=16; i > 0; i-- )
//  for ( var i=8; i > 0; i-- )
//  for ( var i=2; i > 0; i-- )
    {
        graph.push( g.gameFactory.newCodeTrail( get_n(), get_x(), get_y(), get_delay() ) );
    } 
};

var main = function()
{
    setup_code_trails(); 
    graph.push( new Stats() );

    do_test_loop();
};

main();
