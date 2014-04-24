'use strict';

// The Package is past automatically as first parameter
module.exports = function(Menu, app, auth, database) {

    app.get('/menu/example/anyone', function (req,res,next) {
      res.send('Anyone can access this');
    });

    app.get('/menu/example/auth',auth.requiresLogin, function (req,res,next) {
      res.send('Only authenticated users can access this');
    });

    app.get('/menu/example/admin',auth.requiresAdmin, function (req,res,next) {
      res.send('Only users with Admin role can access this');
    });    

    app.get('/menu/example/render', function (req,res,next) {
      Menu.render('index', {package:'menu'}, function (err, html) {
        //Rendering a view from the Package server/views
        res.send(html);
      })
    })
};