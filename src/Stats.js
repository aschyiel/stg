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

    /* GameObject pseudo-interface "draw". */
    that.draw = function()
    {
        that.frames++;
        var now = Date.now();
        var msec = now - that.last; 
        var fps = ~~(1000 / msec);
        var avg_fps = ~~( that.frames / ( now - that.first ) );

        that.last = now; 

        var y = that.y;
        var get_y = function()
        {
            y -= 12;
            return y;
        }

        g.ctx.fillStyle = 'yellow';
        g.ctx.fillText( "effective FPS:"+fps,
                that.x, get_y() );

        g.ctx.fillText( "average FPS:"+avg_fps,
                that.x, get_y() );

        g.ctx.fillText( "total frames:"+that.frames,
                that.x, get_y() ); 
        g.ctx.fillText( "update frequency (msec):"+msec,
                that.x, get_y() ); 

    } 
}


