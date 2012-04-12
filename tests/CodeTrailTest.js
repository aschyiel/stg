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
        width:  400,
        height: 300, 

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

g.gameFactory = new GameFactory();
g.canvas = document.getElementById('id_canvas'), 
g.ctx = g.canvas.getContext('2d'); 
g.canvas.width = g.width;
g.canvas.height = g.height; 

var clear_canvas = function(){
	g.ctx.fillStyle = '#202020';  /* background colour. */
	g.ctx.clearRect(0, 0, g.width, g.height);
	g.ctx.beginPath();
	g.ctx.rect(0, 0, g.width, g.height);
	g.ctx.closePath();
	g.ctx.fill();
}; 

var graph = [];

var do_test_loop = function()
{ 
    clear_canvas(); 

    graph.forEach(function(codeTrail)
            {
                codeTrail.draw( g.ctx ); 
            }); 

    g.gameLoop = setTimeout( do_test_loop, 5 );    // last!
//  g.gameLoop = setTimeout( do_test_loop, 1000 / 50);    // last!
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
    //  400x300
    //  64 --- 8 fps
    //  32 --- 14 fps
    //  16 --- 22 fps
    //
    //  768x448
    //  64 --- 8 fps, 120 msec update frequency.
    //  32 --- 13~14 fps, 72~80 msec
    //  16 --- 20 fps, 50 msec
    //  8  --- 27 fps, 37 msec
    //

    //  5 msec gameloop timeout
    //
    //  400x300
    // 256 --- 4 fps
    //  64 --- 8 fps
    //  32 ---    fps
    //  16 --- 23 fps
    //
    //  768x448
    //  64 --- 
    //  32 --- 
    //  16 --- 
    //  8  --- 
    //



//  for ( var i=256; i > 0; i-- )
    for ( var i=64; i > 0; i-- )
//  for ( var i=32; i > 0; i-- )
//  for ( var i=16; i > 0; i-- )
//  for ( var i=8; i > 0; i-- )
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
