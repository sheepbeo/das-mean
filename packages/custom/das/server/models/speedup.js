'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
  
  
var SpeedupSchema = new Schema({
	timeStamp: {
		type: Date,
		default: Date.now
	},
	type: {
		type: String,
		default: ''
	},
	timeLeft: {
		type: String,
		default: ''
	},
	timeTotal: {
		type: String,
		default: ''
	},
	premiumSpent: {
		type: Number,
		default: 0
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
SpeedupSchema.statics.load = function (id, cb) {
	this.findOne({
	}).populate('user', 'name username').exec(cb);
};

mongoose.model('Speedup', SpeedupSchema);