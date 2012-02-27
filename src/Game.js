/**
*   ..Game.js, uly, feb2012..
*
*   This is the "main" javaScript file that controls the game from a high-level.
*   It handles keyboard events, and top-level gameState changes such as pausing.
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
        stage: 0,

        /* the current "level" in the game. */
        level: 0,

        /* show status via labels such as game progress. */
        showStats: true

        };

//
//  further global variable initialization(s).
//

g.gameFactory = new GameFactory();
g.director = new Director();
g.player = g.gameFactory.getPlayer();
g.player.setupDefaultGameObject();
g.director.addToGraph( g.player );
g.canvas = document.getElementById('id_canvas'), 
g.ctx = g.canvas.getContext('2d'); 
g.canvas.width = g.width;
g.canvas.height = g.height; 
g.player.setPosition(~~((g.width - g.player.width)/2), ~~((g.height - g.player.height)/2)); 

g.images = new Object();
g.images.pew = new Image();
g.images.pew.src = "../media/pew.png"; 

/*
*   TODO:I am not sure what this is for!
*/
if (!window.console) console = {};
console.log = console.log || function(){};
console.warn = console.warn || function(){};
console.error = console.error || function(){};
console.info = console.info || function(){};

var clear_canvas = function(){
	g.ctx.fillStyle = '#808080';  /* background colour. */
	g.ctx.clearRect(0, 0, g.width, g.height);
	g.ctx.beginPath();
	g.ctx.rect(0, 0, g.width, g.height);
	g.ctx.closePath();
	g.ctx.fill();
} 

//
//  input event handlers.
//

document.onkeydown = function( event )
{
    switch ( event.keyCode )
    {
        case 87:  /* w */
        case 38:  /* up-arrow */
            g.player.setIsMovingUp( true ); 
            break;
        case 83:  /* s */
        case 40:  /* down-arrow */
            g.player.setIsMovingDown( true );
            break;
        case 65:  /* a */
        case 37:  /* left-arrow */
            g.player.setIsMovingLeft( true );
            break;
        case 68:  /* d */
        case 39:  /* right-arrow */ 
            g.player.setIsMovingRight( true );
            break; 
        case 32:  /* spaceBar */
            g.player.setIsShooting( true );
            break; 
        case 80:    /* "p" */
            togglePause();
            break;
        default:
            break;
    }
}

document.onkeyup = function( event )
{
    switch ( event.keyCode )
    {
        case 87:  /* w */
        case 38:  /* up-arrow */
            g.player.setIsMovingUp( false );
            break;
        case 83:  /* s */
        case 40:  /* down-arrow */
            g.player.setIsMovingDown( false );
            break;
        case 65:  /* a */
        case 37:  /* left-arrow */
            g.player.setIsMovingLeft( false );
            break;
        case 68:  /* d */
        case 39:  /* right-arrow */
            g.player.setIsMovingRight( false );
            break;
        case 32:  /* spaceBar */
            g.player.setIsShooting( false );
            break; 
        default:
            break;
    }
} 

/*
*   toggle the game's pause state.
*   TODO:use enum...
*/
var togglePause = function()
{
    g.gameState = ( g.gameState == "PAUSED" )? "PLAYING" : "PAUSED";
}

var doGameLoop = function(){


	if ( "PLAYING" == g.gameState )
	{ 
        clear_canvas(); 
        g.director.direct(); 
        g.director.draw( g.ctx );
    }
    else if ( "PAUSED" == g.gameState )
    {
        g.ctx.fillStyle = 'yellow';
        g.ctx.fillText( 'PAUSED', g.width / 2, g.height / 2 ); 
    }

	g.gameLoop = setTimeout( doGameLoop, 1000 / 50);    // last!
}

/*
*   the main method in the Game.js
*/
var main = function()
{
    g.gameState = "PLAYING";
    g.level = 1;
    g.stage = 1;

    g.director.setLevel( g.level );
    g.director.setStage( g.stage );
    g.director.setupLevelStage();
    doGameLoop();
}

main();
