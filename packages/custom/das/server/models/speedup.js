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
		default: 0
	},
	
	context: {
		level: {
			type: Number,
			default: 0
		},
		resource: {
			type: Number,
			default: 0
		},
		premium: {
			type: Number,
			default: 0
		},
		
		buildings: [
			{
				type: {
					type: String,
					default: ''
				},
				level: {
					type: Number,
					default: 0
				},
				posX: {
					type: Number,
					default: 0
				},
				posY: {
					type: Number,
					default: 0
				}
			}
		]
	}
	
	/**/
});

// Static
SpeedupSchema.statics.load = function (id, cb) {
	this.findOne({
	}).populate('user', 'name username').exec(cb);
};

mongoose.model('Speedup', SpeedupSchema);