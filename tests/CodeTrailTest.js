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
	g.ctx.fillStyle = '#808080';  /* background colour. */
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

    graph.each(function(codeTrail)
            {
                codeTrail.tick(); 
            });

    graph.each(function(codeTrail)
            {
                codeTrail.draw( g.ctx ); 
            }); 

	g.gameLoop = setTimeout( doGameLoop, 1000 / 50);    // last!
}

var setup_code_trails()
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
        if ( x > g.width )
                x = n % 32;

        return x += 32;
    }
    var y = 0;
    var get_y = function()
    {
        // TODO sine fxn...
        return 0;
    }

    for ( var i=10; i > 0; i-- )
    {
        graph.push( gameFactory.newCodeTrail( get_n(), get_x(), get_y() ) );
    }
}

var main = function()
{
    setup_code_trails(); 

    do_test_loop();
}

main();
