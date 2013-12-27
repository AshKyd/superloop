if(typeof window == 'undefined'){
	window = {};
}

function SuperLoop(opts){
	// Default non-focused interval of 610 milliseconds is potentially the
	// lowest you can go before throttling.
	// http://getcontext.net/read/settimeout-requestanimationframe
	this.nonRenderInterval = opts.nonRenderInterval || 610;
	this.ontick = opts.ontick || function(){};
	this.capFps = 60;
}
SuperLoop.prototype.start = function(){
	var _this = this;

	var tick = function(){
		// Cancel any timeouts.
		window.cancelTimeout(_this.timeout);

		// Fire the custom ontick code.
		_this.ontick();

		// Queue another tick.
		queueTick();
	}

	var queueTick = function(){
		// Request a callback before the next page redraw/animation frame.
		_this.animationRequest = _this.requestAnimFrame(loop);

		// Set a timeout to fire if we haven't received an animation frame.
		_this.timeout = window.setTimeout(function(){
			_this.cancelAnimFrame(_this.animationRequest);
			tick();
		},_this.nonRenderInterval)
	}

	// Set things going.
	queueTick();
}

/**
 * Shim for requestAnimationFrame with setTimeout fallback.
 * http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
SuperLoop.requestAnimFrame = (function(){
	// shim layer with setTimeout fallback
	return  window.requestAnimationFrame	||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		function( callback ){
			return window.setTimeout(callback, 1000 / this.capFps);
		};
})();

SuperLoop.cancelAnimFrame = (function(){
	// shim layer with setTimeout fallback
	return  window.cancelAnimationFrame	||
		window.webkitCancelAnimationFrame	||
		window.mozCancelAnimationFrame		||
		function( id ){
			return window.cancelTimeout(id);
		};
})();

if(typeof module != 'undefined' && module.exports){
	module.exports = SuperLoop;
}