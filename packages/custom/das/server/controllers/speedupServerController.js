'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Speedup = mongoose.model('Speedup'),
	lodash = require('lodash');

// create	
exports.create = function(req,res) {
	console.log('hi');
	var speedup = new Speedup(req.body);
	console.log(req.body);
	
	speedup.save(function(err) {
		if (err) {
			return res.status(500).json({ error: 'Cannot save metric speedup'});
		}
		return res.json(speedup);
	});
};

// get all
exports.all = function(req,res) {
	console.log('all called');

	Speedup.find().sort('timeStamp').populate('subGoal').exec(function(err, speedups){
		if (err) {
			return res.status(500).json({ error: 'Cannot get all metric speedup'});
		}
		return res.json(speedups);
	});
};

// destroy
exports.destroy = function(req,res) {
	var speedup = req.speedup;
	
	speedup.remove(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot delete metric speedup'});
		}
		return res.json(speedup);
	});
};

// empty aka. destroy all
exports.empty = function(req,res) {
	Speedup.remove({}, function(err, speedup) {
		if (err) {
			return res.json(err);
		}
		
		return res.json('emptied');
	});
};

// update
exports.update = function(req,res) {
	var speedup = req.speedup;
	speedup = lodash.extend(speedup, req.body);
	
	speedup.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot save metric speedup'});
		}
		return res.json(speedup);
	});
};

// show one
exports.show = function(req,res) {
	return res.json(req.speedup);
};

// get one by id
exports.get = function(req,res,next,id) {
	Speedup.findById(id, function(err, speedup) {
		console.log(id);
		console.log(speedup);
	
		if (err) {
			return next(err);
		}
		
		if (!speedup) {
			return next(new Error('Failed to load Speedup ' + id));
		}
		
		req.speedup = speedup;
		next();
	});
};

