'use strict';
/*
 * Defining the Package
 */

var Module = require("meanio").Module;

var five = require("johnny-five");
var util = require('util');

var Bar = new Module("Bar");
var board = new five.Board();
/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */

Bar.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Bar.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Bar.menus.add({
      title: 'Activate Solenoid',
      link: 'bar open solenoid',
      roles: ['authenticated'],
      menu: 'main'
    });


    board.on("ready", function() {
      var solenoid = new Array();
      var sol_ison = new Array();
      var i = 0;

      for (i = 0; i < 6; i++) {
        solenoid[i] = new five.Led(i+8);
        sol_ison[i] = false;
      } 

      function solenoid_lock(sol_num) {
        sol_ison[sol_num] = false;
        solenoid[sol_num].off();

        util.log('Solenoid '+sol_num+': Closed\t- '+Date.now());
      }

      function solenoid_unlock(sol_num) {
        sol_ison[sol_num] = true;
        solenoid[sol_num].on();

        util.log('Solenoid '+sol_num+': Open\t- '+Date.now());
      }

      function solenoid_get_status(sol_num) {
        if (solenoid_is_valid(sol_num))
          return sol_ison[sol_num];
      }

      function solenoid_is_valid(sol_num) {
        return (sol_num>=0 && sol_num<=5);
      }

      app.lock('/solenoid/:sol_num', function(req,res){
        if (solenoid_is_valid(req.params.sol_num)) {
          if (solenoid_get_status(req.params.sol_num)){
            solenoid_lock(req.params.sol_num);
            res.send(true);
          }
        } else {
          res.send(false);
        }
      });

      app.lock('/solenoid', function(req,res) {
        for (i = 0; i < 6; i++) {
          if (solenoid_get_status(i))
            solenoid_lock(i);
        }
        res.send(true);
      });

      app.get('/solenoid/:sol_num', function(req,res){
        res.type('text/plain');

        if (solenoid_is_valid(req.params.sol_num))
          res.send(solenoid_get_status(req.params.sol_num));
      });

      app.unlock('/solenoid/:sol_num/:oz', function(req,res){
        res.type('text/plain');


        if (solenoid_is_valid(req.params.sol_num)) {
          if (!sol_ison[req.params.sol_num]) {

            var OZ_TIME = 1850; //MS
            var oz_num  = req.params.oz;
            
            solenoid_unlock(req.params.sol_num);
            setTimeout(solenoid_lock,OZ_TIME*oz_num,req.params.sol_num);
            res.send('true');

            } else {
              util.log('Solenoid '+req.params.sol_num+': ERR\t- Already Open');
              res.send('false');
            //res.end();
            }
        } else {
            util.log('Nope');
            res.send('false');
        }
      });

    });



    /*
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Bar.settings({'someSetting':'some value'},function (err, settings) {
      //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Bar.settings({'anotherSettings':'some value'});

    // Get settings. Retrieves latest saved settigns
    Bar.settings(function (err, settings) {
      //you now have the settings object
    });
    */

    return Bar;
});
