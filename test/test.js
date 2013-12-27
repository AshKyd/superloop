var assert = require("assert");
describe('SuperLoop', function(){
	var superLoop = require('../superloop.js');
    describe('Init', function(){
        it('should exist', function(){
            assert.equal('function', typeof superLoop);
        })
    })
})