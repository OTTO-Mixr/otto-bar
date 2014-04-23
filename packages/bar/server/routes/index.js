'use strict';

// The Package is past automatically as first parameter
module.exports = function(Bar, app, auth, database) {

    app.get('/bar/example/fuck', function (req,res,next){
      res.send('fuck');
    });

    app.get('/bar/example/anyone', function (req,res,next) {
      res.send('Anyone can access this');
    });

    app.get('/bar/example/auth',auth.requiresLogin, function (req,res,next) {
      res.send('Only authenticated users can access this');
    });

    app.get('/bar/example/admin',auth.requiresAdmin, function (req,res,next) {
      res.send('Only users with Admin role can access this');
    });    

    app.get('/bar/example/render', function (req,res,next) {
      Bar.render('index', {package:'bar'}, function (err, html) {
        //Rendering a view from the Package server/views
        res.send(html);
      })
    })
};
