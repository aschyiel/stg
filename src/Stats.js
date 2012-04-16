/*
*   ..Stats.js, uly, april2012..
*
*   intended to be used as a Singleton,
*   Display game statistics (fps), useful for dev/debug-mode.
*/
function Stats()
{ 
    var that = this; 

    /* the previous timestamp. */
    that.first = that.last = Date.now(); 

    that.x = g.width - 200;
    that.y = g.height - 25;

    that.frames = 0; 

    that.height = 12;
    that.width = 36;

    that.canvas = document.createElement( 'canvas' );
    that.canvas.height = that.height;
    that.canvas.width = that.width;
    that.ctx = that.canvas.getContext( '2d' ); 
//  that.ctx.fillStyle = 'yellow';

    /* GameObject pseudo-interface "draw". */
    that.draw = function()
    {
        var x = that.x,
                y = that.y,
                h = that.height,
                w = that.width,
                ctx = that.ctx,
                img = that.canvas;

        that.frames++;
        var now = Date.now();
        var msec = now - that.last; 
        var fps = ~~(1000 / msec);

        that.last = now; 


//      g.ctx.clearRect( x, y, w, h );
        ctx.clearRect( 0, 0, w, h );

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.rect( 0, 0, w, h );
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'yellow';
        ctx.fillText( "FPS:"+fps, 0, h );   
        g.ctx.drawImage( img, x, y ); 

        //
        //  TODO:fillText is slow!!!
        //
//      g.ctx.fillText( "total frames:"+that.frames,
//              that.x, get_y() ); 

    } 
}


