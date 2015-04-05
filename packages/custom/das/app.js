'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Das = new Module('das');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Das.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Das.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Das.menus.add({
    title: 'das example page',
    link: 'das example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Das.aggregateAsset('css', 'das.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Das.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Das.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Das.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Das;
});
