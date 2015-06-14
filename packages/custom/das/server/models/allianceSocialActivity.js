'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
  
  
var AllianceSocialActivitySchema = new Schema({
	timeStamp: {
		type: Date,
		default: Date.now
	},

	activityType: {
		type: String,
		default: ''
	},
	
	allianceId: {
		type: String,
		default: ''
	}
	
});

// Static
AllianceSocialActivitySchema.statics.load = function (id, cb) {
	this.findOne({
	}).populate('user', 'name username').exec(cb);
};

mongoose.model('AllianceSocialActivity', AllianceSocialActivitySchema);