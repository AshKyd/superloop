if(typeof window == 'undefined'){
	window = {};
}

function SuperLoop(opts){
	opts = opts || {};
	/**
	 * Interval between each non-rAF frame.
	 * Default non-focused interval of 610 milliseconds is potentially the
	 * lowest you can go before throttling.
	 * http://getcontext.net/read/settimeout-requestanimationframe
	 * @type {[type]}
	 */
	this.nonRenderInterval = opts.nonRenderInterval || 610;
	/**
	 * Cap FPS for timeout method. Assumed non-rAF browsers will be older,
	 * slower.
	 * @type {Number}
	 */
	this.capFps = opts.capFps || 30;
	this.ontick = opts.ontick || function(){};
	this.onrender = opts.onrender || function(){};
}

/**
 * Start a loop running. You can only run one per SuperLoop instance.
 * Stop the loop with .stop(). Pause and resume with .pause() and .resume().
 */
SuperLoop.prototype.start = function(){
	var _this = this;

	_this.startTime = Date.now();

	var tick = function(){
		_this.ontick(Date.now()-_this.startTime);
	}
	
	// Handle any rendering functions (animation frame related stuff)
	var render = function(){
		// Cancel any timeouts.
		window.clearTimeout(_this.timeout);

		// Kill the loop if we've been asked to stop.
		if(!_this.startTime){
			return;
		}

		// Don't tick if we're paused.
		if(!_this.pausedTime){
			tick();
		}

		_this.onrender();
		queueTick();
	}

	var queueTick = function(){
		// Request a callback before the next page redraw/animation frame.
		_this.animationRequest = _this.requestAnimFrame(render);

		// Set a timeout to fire if we haven't received an animation frame.
		_this.timeout = window.setTimeout(function(){
			_this.cancelAnimFrame(_this.animationRequest);
			// Kill the loop if we've been asked to stop.
			if(!_this.startTime){
				return;
			}
			tick();
			queueTick();
		},_this.nonRenderInterval);
	}

	// Set things going.
	queueTick();
}

/**
 * Pause this loop. Paused loops still fire the onrender function but don't
 * fire the ontick function or update the game time.
 * You can use the render function to continue animating various sprites while
 * the game is paused.
 */
SuperLoop.prototype.pause = function(){
	this.pausedTime = Date.now();
}

/**
 * Resume the loop and start updating game time.
 */
SuperLoop.prototype.resume = function(){
	if(!this.pausedTime){
		return false;
	}
	var diff = Date.now() - this.pausedTime;
	this.startTime -= diff;
	this.pausedTime = false;
	return diff;
}

/**
 * Stop the loop completely. This kills the loop, game time, and leaves the 
 * loop structure to be garbage collected.
 */
SuperLoop.prototype.stop = function(){
	this.startTime = false;
	this.pausedTime = false;
	this.cancelAnimFrame(this.animationRequest);
	window.clearTimeout(this.timeout);
}

/**
 * Compatibility layer for requestAnimationFrame with setTimeout fallback.
 * Dropped prefixes (only really affects iOS6.
 * http://caniuse.com/#search=requestanimationframe
 */
SuperLoop.prototype.requestAnimFrame = function(callback){
	if(window.requestAnimationFrame){
		return window.requestAnimationFrame(callback);
	} else {
		return window.setTimeout(callback, 1000 / this.capFps)
	}
};

SuperLoop.prototype.cancelAnimFrame = function(id){
	if(window.cancelAnimationFrame){
		return window.cancelAnimationFrame(id);
	} else {
		return window.clearTimeout(id);
	}
};

if(typeof module != 'undefined' && module.exports){
	module.exports = SuperLoop;
}