'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
  
  
var PlayerSocialActivitySchema = new Schema({
	timeStamp: {
		type: Date,
		default: Date.now
	},

	activityType: {
		type: String,
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
PlayerSocialActivitySchema.statics.load = function (id, cb) {
	this.findOne({
	}).populate('user', 'name username').exec(cb);
};

mongoose.model('PlayerSocialActivity', PlayerSocialActivitySchema);