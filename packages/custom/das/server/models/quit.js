'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
  
  
var QuitSchema = new Schema({
	timeStamp: {
		type: Date,
		default: Date.now
	},

	dateBegin: {
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
QuitSchema.statics.load = function (id, cb) {
	this.findOne({
	}).populate('user', 'name username').exec(cb);
};

mongoose.model('Quit', QuitSchema);