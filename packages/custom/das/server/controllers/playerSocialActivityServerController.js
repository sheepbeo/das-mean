'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	PlayerSocialActivity = mongoose.model('PlayerSocialActivity'),
	Context = mongoose.model('Context'),
	lodash = require('lodash');

// create	
exports.create = function(req,res) {
	
	var data = req.body;
	var context = new Context(data.context);

	context.save(function(err, savedData) {
		if (err) {
			return res.status(500).json({ error: 'Cannot save metric playerSocialActivity context' });
		}
		//console.log(savedData);
		data.context = savedData._id;
		//console.log(data);

		var playerSocialActivity = new PlayerSocialActivity(data);
	
		playerSocialActivity.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(500).json({ error: 'Cannot save metric playerSocialActivity'});
			}
			return res.json(playerSocialActivity);
		});

	});
	
};

// get all
exports.all = function(req,res) {
	console.log('all called');

	PlayerSocialActivity.find().sort('timeStamp').populate('context').exec(function(err, playerSocialActivities){
		if (err) {
			return res.status(500).json({ error: 'Cannot get all metric playerSocialActivity'});
		}
		return res.json(playerSocialActivities);
	});
};

// destroy !deprecated
exports.destroy = function(req,res) {
	var playerSocialActivity = req.playerSocialActivity;
	
	playerSocialActivity.remove(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot delete metric playerSocialActivity'});
		}
		return res.json(playerSocialActivity);
	});
};

// empty aka. destroy all, !deprecated
exports.empty = function(req,res) {
	PlayerSocialActivity.remove({}, function(err, playerSocialActivity) {
		if (err) {
			return res.json(err);
		}
		
		return res.json('emptied');
	});
};

// update: !deprecated
exports.update = function(req,res) {
	var playerSocialActivity = req.playerSocialActivity;
	playerSocialActivity = lodash.extend(playerSocialActivity, req.body);
	
	playerSocialActivity.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot save metric playerSocialActivity'});
		}
		return res.json(playerSocialActivity);
	});
};

// show one
exports.show = function(req,res) {
	return res.json(req.playerSocialActivity);
};

// get one by id
exports.get = function(req,res,next,id) {
	PlayerSocialActivity.findById(id).populate('context').exec(function(err, playerSocialActivity) {
		console.log(id);
		console.log(playerSocialActivity);
	
		if (err) {
			return next(err);
		}
		
		if (!playerSocialActivity) {
			return next(new Error('Failed to load PlayerSocialActivity ' + id));
		}
		
		req.playerSocialActivity = playerSocialActivity;
		next();
	});
};

