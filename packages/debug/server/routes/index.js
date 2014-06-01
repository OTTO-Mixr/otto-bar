'use strict';

// The Package is past automatically as first parameter
module.exports = function(Debug, app, auth, database) {

    app.get('/debug/example/anyone', function (req,res,next) {
      res.send('Anyone can access this');
    });

    app.get('/debug/example/auth',auth.requiresLogin, function (req,res,next) {
      res.send('Only authenticated users can access this');
    });

    app.get('/debug/example/admin',auth.requiresAdmin, function (req,res,next) {
      res.send('Only users with Admin role can access this');
    });    

    app.get('/debug/example/render', function (req,res,next) {
      Debug.render('index', {package:'debug'}, function (err, html) {
        //Rendering a view from the Package server/views
        res.send(html);
      })
    })
};