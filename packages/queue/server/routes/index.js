'use strict';

// The Package is past automatically as first parameter
module.exports = function(Queue, app, auth, database) {

    app.get('/queue/example/anyone', function (req,res,next) {
      res.send('Anyone can access this');
    });

    app.get('/queue/example/auth',auth.requiresLogin, function (req,res,next) {
      res.send('Only authenticated users can access this');
    });

    app.get('/queue/example/admin',auth.requiresAdmin, function (req,res,next) {
      res.send('Only users with Admin role can access this');
    });    

    app.get('/queue/example/render', function (req,res,next) {
      Queue.render('index', {package:'queue'}, function (err, html) {
        //Rendering a view from the Package server/views
        res.send(html);
      })
    })
};