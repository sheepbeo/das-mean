'use strict';
/*
	Node Routes
*/

var speedupController = require('../controllers/speedupServerController');
var quitController = require('../controllers/quitServerController');
var sessionController = require('../controllers/sessionServerController');
var allianceSocialActivityController = require('../controllers/allianceSocialActivityServerController');
var playerSocialActivityController = require('../controllers/playerSocialActivityServerController');
var testDataController = require('../controllers/testDataController');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Das, app, auth, database) {
	
	
	app.route('/speedup').get(speedupController.all);
	app.route('/speedup').post(speedupController.create);
	app.route('/speedup').delete(speedupController.empty);
	app.route('/speedup/:speedupId').get(speedupController.show);
	app.route('/speedup/:speedupId').delete(speedupController.destroy);
	app.route('/speedup/:speedupId').put(speedupController.update);
	
	app.param('speedupId', speedupController.get);
	

  app.route('/quit').get(quitController.all);
  app.route('/quit').post(quitController.create);
  app.route('/quit').delete(quitController.empty);
  app.route('/quit/:quitId').get(quitController.show);
  app.route('/quit/:quitId').delete(quitController.destroy);
  app.route('/quit/:quitId').put(quitController.update);
  
  app.param('quitId', quitController.get);


  app.route('/session').post(sessionController.create);

  app.route('/allianceSocialActivity').post(allianceSocialActivityController.create);

  app.route('/playerSocialActivity').post(playerSocialActivityController.create);




  app.route('/createTestData/:typeId').get(testDataController.createEntries);
  app.route('/TestData/:typeId').get(testDataController.createEntries);
  app.param('typeId', testDataController.createEntriesOfType);
  app.route('/clearTestData').get(testDataController.clearEntries);


//// example demo apis:
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
