'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Quit = mongoose.model('Quit'),
	Context = mongoose.model('Context'),
	lodash = require('lodash');

// create	
exports.create = function(req,res) {
	
	var data = req.body;
	var context = new Context(data.context);

	context.save(function(err, savedData) {
		if (err) {
			return res.status(500).json({ error: 'Cannot save metric quit context' });
		}
		//console.log(savedData);
		data.context = savedData._id;
		//console.log(data);

		var quit = new Quit(data);
	
		quit.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(500).json({ error: 'Cannot save metric quit'});
			}
			return res.json(quit);
		});

	});
	
};

// get all
exports.all = function(req,res) {
	console.log('all called');

	Quit.find().sort('timeStamp').populate('context').exec(function(err, quits){
		if (err) {
			return res.status(500).json({ error: 'Cannot get all metric quit'});
		}
		return res.json(quits);
	});
};

// destroy !deprecated
exports.destroy = function(req,res) {
	var quit = req.quit;
	
	quit.remove(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot delete metric quit'});
		}
		return res.json(quit);
	});
};

// empty aka. destroy all, !deprecated
exports.empty = function(req,res) {
	Quit.remove({}, function(err, quit) {
		if (err) {
			return res.json(err);
		}
		
		return res.json('emptied');
	});
};

// update: !deprecated
exports.update = function(req,res) {
	var quit = req.quit;
	quit = lodash.extend(quit, req.body);
	
	quit.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot save metric quit'});
		}
		return res.json(quit);
	});
};

// show one
exports.show = function(req,res) {
	return res.json(req.quit);
};

// get one by id
exports.get = function(req,res,next,id) {
	Quit.findById(id).populate('context').exec(function(err, quit) {
		console.log(id);
		console.log(quit);
	
		if (err) {
			return next(err);
		}
		
		if (!quit) {
			return next(new Error('Failed to load Quit ' + id));
		}
		
		req.quit = quit;
		next();
	});
};

