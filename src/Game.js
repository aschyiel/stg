
//
//  globals.
//
var width = 768, 
        height = 448,
        gLoop,
        _canvas = document.getElementById('id_canvas'), 
        ctx = _canvas.getContext('2d');
                
_canvas.width = width;
_canvas.height = height;

if (!window.console) console = {};
console.log = console.log || function(){};
console.warn = console.warn || function(){};
console.error = console.error || function(){};
console.info = console.info || function(){};

var clear = function(){
	ctx.fillStyle = '#808080';  /* background colour. */
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath();
	ctx.rect(0, 0, width, height);
	ctx.closePath();
	ctx.fill();
} 

/* the global game state. */
var gameState = "";

/* the current stage in a level in the game. */
var stage = 0;

/* the current "level" in the game. */
var level = 0;

var gameFactory = new GameFactory();
var director = new Director();
var player = director.getPlayer();  
player.setPosition(~~((width-player.width)/2), ~~((height - player.height)/2)); 

//
//  input event handlers.
//

document.onkeydown = function( event )
{
    switch ( event.keyCode )
    {
        case 87:  /* w */
        case 38:  /* up-arrow */
            player.setIsMovingUp( true ); 
            break;
        case 83:  /* s */
        case 40:  /* down-arrow */
            player.setIsMovingDown( true );
            break;
        case 65:  /* a */
        case 37:  /* left-arrow */
            player.setIsMovingLeft( true );
            break;
        case 68:  /* d */
        case 39:  /* right-arrow */ 
            player.setIsMovingRight( true );
            break; 
        case 32:  /* spaceBar */
            player.setIsShooting( true );
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
            player.setIsMovingUp( false );
            break;
        case 83:  /* s */
        case 40:  /* down-arrow */
            player.setIsMovingDown( false );
            break;
        case 65:  /* a */
        case 37:  /* left-arrow */
            player.setIsMovingLeft( false );
            break;
        case 68:  /* d */
        case 39:  /* right-arrow */
            player.setIsMovingRight( false );
            break;
        case 32:  /* spaceBar */
            player.setIsShooting( false );
            break; 
        default:
            break;
    }
}
//
//  _the_ game loop.
//

var GameLoop = function(){
	clear(); 

	if ( "PLAYING" == gameState )
	{
        director.direct(); 
        director.draw( ctx );
    }
    else if ( "PAUSED" == gameState )
    {
        // TODO!
    }

	gLoop = setTimeout(GameLoop, 1000 / 50);    // last!
}

/*
*   the main method in the Game.js
*/
var main = function()
{
    gameState = "PLAYING";
    level = 1;
    stage = 1;

    director.setLevel( level );
    director.setStage( stage );
    director.setupLevelStage();
    GameLoop();
}

main();
