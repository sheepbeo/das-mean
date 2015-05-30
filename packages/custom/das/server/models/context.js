'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
  
  
var ContextSchema = new Schema({
	timeStamp: {
		type: Date,
		default: Date.now
	},

	playerId: {
		type: String,
		default: '',
	},

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
	
});

// Static
ContextSchema.statics.load = function (id, cb) {
	this.findOne({
	}).populate('user', 'name username').exec(cb);
};

mongoose.model('Context', ContextSchema);