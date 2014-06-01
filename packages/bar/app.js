'use strict';
/*
 * Defining the Package
 */
/*
The following is necessary because bluebird (used in bull) throws
an uncaught exception that propagates upwards and causes an issue with
johnny-fives REPL
*/
//process.on('uncaughtException',function(error){});

var Module    = require("meanio").Module;
var Bar       = new Module("Bar");

var voicejs = require('voice.js');
var queue   = require('bull');

var async   = require("async");
var util    = require('util');
var http    = require('http')
var fs      = require('fs');

var redis = require('redis'),
    redis_client = redis.createClient();

var client = new voicejs.Client({
  email:'otto.mixr@gmail.com',
  password:'PishPosh',
  tokens: require('./tokens.json')
});

var cocktailQ = queue('cocktails', 6379, 'localhost');

cocktailQ
  .on('completed', function(job){
    var parsed = JSON.parse(JSON.stringify(job.data));
      
    client.altsms({
      to: parsed.order.human.cell,
      text: "Order up!  "+parsed.order.cocktail.name+
            " for "+parsed.order.human.name+"!"
    }, function(err, res, data){
      if (err)  return console.log(err); 
      console.log('SMS sent to ' + parsed.order.human.cell);
    });

    cocktailQ.pause();
  })

  .on('paused', function(){
    console.log("Queue paused!");
  })

  .on('resumed', function(job){
    console.log("Queue resumed");
});


cocktailQ.process(function(job, done){
  console.log("Begin processing.");

  var parsed = JSON.parse(JSON.stringify(job.data));
  var routes = JSON.parse(JSON.stringify(parsed.order.cocktail.routes));

  for (var route in routes){
    var options = {
      host: 'localhost',
      port: 3000,
      path: ''+routes[route], 
      method: 'UNLOCK'
    };

    http.request(options, function(rem) {}).end();
  }

  done();
});

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */

Bar.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Bar.routes(app, auth, database);

      //var board = five.Board({io: bone});

      var solenoid = new Array();
      var sol_ison = new Array();

      var i = 0;

      for (i = 0; i < 6; i++) {
        sol_ison[i] = false;
      }

//  #### HELPER_FUNCTIONS ####

      function solenoid_lock(sol_num) {
        sol_ison[sol_num] = false;
//        solenoid[sol_num].off();

        util.log('Solenoid '+sol_num+': Closed\t- '+Date.now());
      }

      function solenoid_unlock(sol_num) {
        sol_ison[sol_num] = true;
//        solenoid[sol_num].on();

        util.log('Solenoid '+sol_num+': Open\t- '+Date.now());
      }

      function solenoid_get_status(sol_num) {
        if (solenoid_is_valid(sol_num))
          return sol_ison[sol_num];
      }

      function solenoid_is_valid(sol_num) {
        return (sol_num>=0 && sol_num<=5);
      }

      function pump_unlock() {
//        pump.on();

        util.log('Pump '+pump_index+': Open\t- '+Date.now());
      }

      function pump_lock() {
//        pump.off();

        util.log('Pump '+pump_index+': Closed\t- '+Date.now());
      }

// #### HELPER_FUNCTIONS END ####

      app.unlock('/cold/:sol_num/:oz', function(req, res){


         if (solenoid_is_valid(req.params.sol_num)) {
          if (!sol_ison[req.params.sol_num]) {

            var PUMP_OFFSET_TIME = 10;
            var OZ_TIME = 1850; //MS
            var oz_num  = req.params.oz;
 
            solenoid_unlock(3);
            solenoid_unlock(req.params.sol_num);

            setTimeout(
              solenoid_lock,
              (OZ_TIME*oz_num) + PUMP_OFFSET_TIME,
              3
            );

            setTimeout(solenoid_lock,OZ_TIME*oz_num,req.params.sol_num);
            res.send('true');

            } else {
              util.log('Solenoid '+req.params.sol_num+': ERR\t- Already Open');
              res.send('false');
            }
        } else {
            util.log('Nope');
            res.send('false');
        }
      
      });

      app.post('/resume', function(req,res){
        cocktailQ.resume();
        res.send(true);
      });


      app.get('/queue', function(req,res){
        var context     = {};
        context.json_orders = [];
        
        async.series([
          function(callback) {
            redis_client.lrange('bull:cocktails:wait',0,-1, function (err, list) {
              if (err) return callback(err);
              context.list = list;
              callback();
            });
          },
          function(callback) {
            context.callback=callback;

            async.eachSeries(context.list, function (hash, callback){
              redis_client.hget('bull:cocktails:'+hash, 'data', function (err, json) {
                if (err) return callback(err);
                context.json_orders.push(JSON.parse(json));
                callback();
              });
            }, function(err) {
                context.callback();
            });
          }
        ], 
        function(err) {
          if (err) console.log("ERROR");
          res.send(context.json_orders);
        });
      });

      app.post('/queue', function(req,res){
        console.log(req.body);
        cocktailQ.add(req.body);
        res.send(true);
        console.log("Added "+req.body.order.cocktail.name+
                  " for "+req.body.order.human.name+"!");
      });

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

      app.unlock('/solenoid', function(req,res) {
        for (i = 0; i < 6; i++) {
          if (!solenoid_get_status(i))
            solenoid_unlock(i);
        }
        res.send(true);
      });

      app.get('/solenoid/:sol_num', function(req,res){
        res.type('text/plain');

        if (solenoid_is_valid(req.params.sol_num))
          res.send(solenoid_get_status(req.params.sol_num));
      });

      app.unlock('/warm/:sol_num/:oz', function(req,res){
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
            }
        } else {
            util.log('Nope');
            res.send('false');
        }
      });

    return Bar;
});
