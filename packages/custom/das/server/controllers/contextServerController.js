'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Context = mongoose.model('Context'),
	lodash = require('lodash');

// create	
exports.create = function(req,res,next) {
	var context = new Context(req.body);
	console.log('create context');
	console.log(req.body);
	
	context.save(function(err) {
		if (err) {
			return res.status(500).json({ error: 'Cannot save metric context'});
		}
		console.log('in save callback');
		console.log('result' + context);
		
		if (next !== null) {
			next(err, context);
		}
		
		//return res.json(context);
	});
};

// get all
exports.all = function(req,res) {
	Context.find().sort('timeStamp').populate('subGoal').exec(function(err, contexts){
		if (err) {
			return res.status(500).json({ error: 'Cannot get all metric context'});
		}
		return res.json(contexts);
	});
};

// destroy
exports.destroy = function(req,res) {
	var context = req.context;
	
	context.remove(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot delete metric context'});
		}
		return res.json(context);
	});
};

// update
exports.update = function(req,res) {
	var context = req.context;
	context = lodash.extend(context, req.body);
	
	context.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot save metric context'});
		}
		return res.json(context);
	});
};

// show one
exports.show = function(req,res) {
	return res.json(req.context);
};

// get one by id
exports.get = function(req,res,next,id) {
	Context.load(id, function(err, context) {
		if (err) {
			return next(err);
		}
		
		if (!context) {
			return next(new Error('Failed to load Context ' + id));
		}
		
		req.context = context;
		next();
	});
};