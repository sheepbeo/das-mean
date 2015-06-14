'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	AllianceSocialActivity = mongoose.model('AllianceSocialActivity'),
	lodash = require('lodash');

// create	
exports.create = function(req,res) {
	
	var data = req.body;

	var allianceSocialActivity = new AllianceSocialActivity(data);
	
	allianceSocialActivity.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot save metric allianceSocialActivity'});
		}
		return res.json(allianceSocialActivity);
	});
	
};

// get all
exports.all = function(req,res) {
	console.log('all called');

	AllianceSocialActivity.find().sort('timeStamp').exec(function(err, allianceSocialActivities){
		if (err) {
			return res.status(500).json({ error: 'Cannot get all metric allianceSocialActivity'});
		}
		return res.json(allianceSocialActivities);
	});
};

// destroy !deprecated
exports.destroy = function(req,res) {
	var allianceSocialActivity = req.allianceSocialActivity;
	
	allianceSocialActivity.remove(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot delete metric allianceSocialActivity'});
		}
		return res.json(allianceSocialActivity);
	});
};

// empty aka. destroy all, !deprecated
exports.empty = function(req,res) {
	AllianceSocialActivity.remove({}, function(err, allianceSocialActivity) {
		if (err) {
			return res.json(err);
		}
		
		return res.json('emptied');
	});
};

// update: !deprecated
exports.update = function(req,res) {
	var allianceSocialActivity = req.allianceSocialActivity;
	allianceSocialActivity = lodash.extend(allianceSocialActivity, req.body);
	
	allianceSocialActivity.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot save metric allianceSocialActivity'});
		}
		return res.json(allianceSocialActivity);
	});
};

// show one
exports.show = function(req,res) {
	return res.json(req.allianceSocialActivity);
};

// get one by id
exports.get = function(req,res,next,id) {
	AllianceSocialActivity.findById(id).populate('context').exec(function(err, allianceSocialActivity) {
		console.log(id);
		console.log(allianceSocialActivity);
	
		if (err) {
			return next(err);
		}
		
		if (!allianceSocialActivity) {
			return next(new Error('Failed to load AllianceSocialActivity ' + id));
		}
		
		req.allianceSocialActivity = allianceSocialActivity;
		next();
	});
};

