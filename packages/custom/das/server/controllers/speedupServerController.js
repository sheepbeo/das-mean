'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Speedup = mongoose.model('Speedup'),
	Context = mongoose.model('Context'),
	lodash = require('lodash');

// create	
exports.create = function(req,res) {
	console.log('hi');
	console.log(req.body.type);

	// var data = req.body;
	// var context = new Context(data.context);

	// context.save(function(err, savedData) {
	// 	if (err) {
	// 		return res.status(500).json({ error: 'Cannot save metric speedup context' });
	// 	}
	// 	//console.log(savedData);
	// 	data.context = savedData._id;
	// 	//console.log(data);

	// 	var speedup = new Speedup(data);
	
	// 	speedup.save(function(err) {
	// 		if (err) {
	// 			console.log(err);
	// 			return res.status(500).json({ error: 'Cannot save metric speedup'});
	// 		}
	// 		return res.json(speedup);
	// 	});

	// });
	
	exports.createOne(req.body, function(result) {
		if (!result) {
			return res.status(500).json({ error: 'Cannot save metric speedup'});
		} else {
			console.log(result);
			return res.json(result);
		}	
	});
	
};

exports.createOne = function(data, callBack) {
	var context = new Context(data.context);

	context.save(function(err, savedData) {
		if (err != null) {
			callBack(false);
			return false;
		}

		data.context = savedData._id;
		var speedup = new Speedup(data);
	
		speedup.save(function(err, savedData2) {
			if (err != null) {
				callBack(false);
				return false;
			}
			callBack(savedData2);
		});

	});
}

// get all
exports.all = function(req,res) {
	console.log('all called');

	Speedup.find().sort('timeStamp').populate('context').exec(function(err, speedups){
		if (err) {
			return res.status(500).json({ error: 'Cannot get all metric speedup'});
		}
		return res.json(speedups);
	});
};

// destroy !deprecated
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

// empty aka. destroy all, !deprecated
exports.empty = function(req,res) {
	Speedup.remove({}, function(err, speedup) {
		if (err) {
			return res.json(err);
		}
		
		return res.json('emptied');
	});
};

// update: !deprecated
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
	Speedup.findById(id).populate('context').exec(function(err, speedup) {
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

