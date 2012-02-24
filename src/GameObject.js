/*
*   ..GameObject.js, uly, feb2012..
*
*   The GameObject serves as the base class for everything that can be inside of the GameGraph.
*
*/
function GameObject( x, y )
{ 
	var that = this;

    //
    //  public variables.
    // 

    that.width =    24;
	that.height =   72;
	that.x = x;
	that.y = y;	
    that.type = "GameObject";

    //
    //  private variables.
    //

    //
    //  public methods.
    //

    that.setPosition = function( x, y )
    {
		that.x = x;
		that.y = y;
	}

    /*
    *   tick one for a turn.
    *
    */
    that.tick = function()
    {
        //..
    }

    /*
    *   draw this gameObject.
    */
    that.draw = function( ctx )
    {
        try 
        {
			ctx.drawImage( that.image, that.x, that.y );
		} 
		catch ( e ) 
        {
            console.warn( e );
		}; 
	}

    /*
    *   indicate if this gameObject needs to be removed from the gameGraph.
    *   usually this will be "true" if the gameObject is "dead" or whatever.
    *
    *   @return boolean
    */
    that.needsRemoved = function()
    {
        return false;
    }

    //
    //  private methods.
    // 

}




