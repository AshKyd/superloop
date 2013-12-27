superloop
=========

A game loop library to handle both render and game state.

Traditionally code examples recommend requestAnimationFrame to handle the game
loop, but this falls down because the optimisations to rAF mean it cna stop
firing when a window is minimised or the user is viewing another tab.

For games that need to continue playing, this is unacceptable and can lead to
heartache down the track.

This library uses both requestAnimationFrame with an optimised fallback to the
traditional setTimeout so the game loop continues to fire even when the page
isn't focused.

Usage
-----
This has barely been tested and isn't production ready yet, so don't use it
unless you're prepared to deal with API changes and fix issues as they arise.

To create a SuperLoop, use the following:

	var myLoop = new SuperLoop({
		ontick: function(){
			// my tick stuff goes here.
		}
	});

Tests
-----
SuperLoop uses Mocha for testing. At the moment there's only the one test, but 
I'm getting to it.