'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
  
  
var SessionSchema = new Schema({
	begin: {
		type: Date,
		default: Date.now
	},

	end: {
		type: Date,
		default: Date.now
	},
	
	playerId: {
		type: String,
		default: ''
	},

	context: {
		type: Schema.ObjectId,
		ref: 'Context'
	}
	
	/**/
});

// Static
SessionSchema.statics.load = function (id, cb) {
	this.findOne({
	}).populate('user', 'name username').exec(cb);
};

mongoose.model('Session', SessionSchema);