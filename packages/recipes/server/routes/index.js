'use strict';

// The Package is past automatically as first parameter
module.exports = function(Recipes, app, auth, database) {

    app.get('/recipes/example/anyone', function (req,res,next) {
      res.send('Anyone can access this');
    });

    app.get('/recipes/example/auth',auth.requiresLogin, function (req,res,next) {
      res.send('Only authenticated users can access this');
    });

    app.get('/recipes/example/admin',auth.requiresAdmin, function (req,res,next) {
      res.send('Only users with Admin role can access this');
    });    

    app.get('/recipes/example/render', function (req,res,next) {
      Recipes.render('index', {package:'recipes'}, function (err, html) {
        //Rendering a view from the Package server/views
        res.send(html);
      })
    })
};