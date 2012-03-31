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
        width: 768,
        height: 448, 

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
} 

var graph = new Array();

var do_test_loop = function()
{ 
    clear_canvas(); 

    graph.forEach(function(codeTrail)
            {
                codeTrail.draw( g.ctx ); 
            }); 

    g.gameLoop = setTimeout( do_test_loop, 1000 / 50);    // last!
//  g.gameLoop = setTimeout( do_test_loop, 1000 );    // last!
//  g.gameLoop = setTimeout( do_test_loop, 100 );    // last!
}

var setup_code_trails = function()
{
    var n = 1;
    /* return a number representing the code trails "level". */
    var get_n = function()
    {
        return n++; 
    }

    var x = 0;
    var get_x = function()
    {
        return Math.floor(Math.random()*g.width); //TODO slots..
    }
    var y = 0;
    var get_y = function()
    {
        // TODO sine fxn...
        return -10;
    }

    var last_delay = 0;
    var get_delay = function()
    {
        return last_delay += 3;    
    }

    for ( var i=256; i > 0; i-- )
    {
        graph.push( g.gameFactory.newCodeTrail( get_n(), get_x(), get_y(), get_delay() ) );
    }

//  graph.push( g.gameFactory.newCodeTrail( get_n(), get_x(), get_y() ) );
}

var main = function()
{
    setup_code_trails(); 

    do_test_loop();
}

main();
