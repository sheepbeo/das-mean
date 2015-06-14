'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Session = mongoose.model('Session'),
	Context = mongoose.model('Context'),
	lodash = require('lodash');

// create	
exports.create = function(req,res) {
	
	var data = req.body;
	var context = new Context(data.context);

	context.save(function(err, savedData) {
		if (err) {
			return res.status(500).json({ error: 'Cannot save metric session context' });
		}
		//console.log(savedData);
		data.context = savedData._id;
		//console.log(data);

		var session = new Session(data);
	
		session.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(500).json({ error: 'Cannot save metric session'});
			}
			return res.json(session);
		});

	});
	
};

// get all
exports.all = function(req,res) {
	console.log('all called');

	Session.find().sort('timeStamp').populate('context').exec(function(err, sessions){
		if (err) {
			return res.status(500).json({ error: 'Cannot get all metric session'});
		}
		return res.json(sessions);
	});
};

// destroy !deprecated
exports.destroy = function(req,res) {
	var session = req.session;
	
	session.remove(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot delete metric session'});
		}
		return res.json(session);
	});
};

// empty aka. destroy all, !deprecated
exports.empty = function(req,res) {
	Session.remove({}, function(err, session) {
		if (err) {
			return res.json(err);
		}
		
		return res.json('emptied');
	});
};

// update: !deprecated
exports.update = function(req,res) {
	var session = req.session;
	session = lodash.extend(session, req.body);
	
	session.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(500).json({ error: 'Cannot save metric session'});
		}
		return res.json(session);
	});
};

// show one
exports.show = function(req,res) {
	return res.json(req.session);
};

// get one by id
exports.get = function(req,res,next,id) {
	Session.findById(id).populate('context').exec(function(err, session) {
		console.log(id);
		console.log(session);
	
		if (err) {
			return next(err);
		}
		
		if (!session) {
			return next(new Error('Failed to load Session ' + id));
		}
		
		req.session = session;
		next();
	});
};

