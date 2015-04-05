'use strict';
/*
	Node Routes
*/

var serverController = require('../controllers/speedupServerController');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Das, app, auth, database) {
	
	
	app.route('/speedup').get(serverController.all);
	app.route('/speedup').post(serverController.create);
	app.route('/speedup').delete(serverController.empty);
	app.route('/speedup/:speedupId').get(serverController.show);
	app.route('/speedup/:speedupId').delete(serverController.destroy);
	app.route('/speedup/:speedupId').put(serverController.update);
	
	app.param('speedupId', serverController.get);
	

  app.get('/das/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/das/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/das/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/das/example/render', function(req, res, next) {
    Das.render('index', {
      package: 'das'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
/**/
};
