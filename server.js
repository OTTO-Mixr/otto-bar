'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    logger = require('mean-logger');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initializing system variables
var config = require('./server/config/config');

var db = mongoose.connect('mongodb://otto:OTTOMIXER@novus.modulusmongo.net:27017/epOv4yqe');

// Bootstrap Models, Dependencies, Routes and the app as an express app
var app = require('./server/config/system/bootstrap')(passport, db);

var Drink = mongoose.model('Drink', {
	type : String,
	name : String,
	abv : Number,
	size : Number,
        unit: String,
        oz: Number,
	solenoid : Number,
    carbonated : Boolean,
    refrigerated : Boolean,
    density : Number,
    emptiness: Number
});

var Recipe = mongoose.model('Recipe', {
	name : String,
	description : String,
	ingredients : [],
        abv: Number
});

// api ---------------------------------------------------------------------
// get all drinks
app.get('/api/installedDrinks', function(req, res) {

	// use mongoose to get all drinks in the database
	Drink.find(function(err, installedDrinks) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err);

		res.json(installedDrinks); // return all drinks in JSON format
	});
});

// get all recipes
app.get('/api/recipes', function(req, res) {

	// use mongoose to get all drinks in the database
	Recipe.find(function(err, recipes) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err);

		res.json(recipes); // return all drinks in JSON format
	});
});

app.get('/api/suggestions', function(req, res) {

	// use mongoose to get all names in the database
	Recipe.find({},{'_id':0,'ingredients':1},function(err,recipes) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err);

                var suggestions = [];

                for (var i = 0; i < recipes.length; i++) {
                  var ingredients = recipes[i].ingredients;
                  for (var j = 0; j < ingredients.length; j++)
                    if (suggestions.indexOf(ingredients[j].name) === -1)
                      suggestions.push(ingredients[j].name);
                }

		res.json(suggestions); // return all suggestions as array
	      });
});
//WE BASICALLY ONLY NEED GET AND UPDATE

// create drink and send back all drinks after creation
app.post('/api/installedDrinks', function(req, res) {
	// create a drink, information comes from AJAX request from Angular
	Drink.create({
		//type : req.body.type,
		name : req.body.name,
		//abv : req.body.abv,
		size : req.body.size,
                unit: req.body.unit,
                oz: req.body.oz,
		solenoid : req.body.solenoid,
	    carbonated : req.body.carbonated,
	    refrigerated : req.body.refrigerated,
	    //density : req.body.density,
        emptiness: req.body.emptiness
	}, function(err, drink) {
		if (err)
			res.send(err);

		// get and return all the drinks after you create another
		Drink.find(function(err, drinks) {
			if (err)
				res.send(err);
			res.json(drinks);
		});
	});
});

// create recipe and send back all recipes after creation
app.post('/api/recipes', function(req, res) {
	// create a recipe, information comes from AJAX request from Angular
	Recipe.create({
		name : req.body.name,
		description : req.body.description,
		ingredients : req.body.ingredients,
                abv: req.body.abv
	}, function(err, recipe) {
		if (err)
			res.send(err);

		// get and return all the recipes after you create another
		Recipe.find(function(err, recipes) {
			if (err)
				res.send(err);
			res.json(recipes);
		});
	});
});

// update recipe
app.put('/api/recipes/:recipe_id', function (req, res){
	Recipe.findOneAndUpdate({_id:req.params.recipe_id},
		{
		  name : req.body.name,
		  description : req.body.description,
		  ingredients : req.body.ingredients
		}, function(err, drink) {
		if (err)
			res.send(err);

		// get and return all the drinks after you update one
		Recipe.find(function(err, recipes) {
			if (err)
				res.send(err);
			res.json(recipes);
		});
	});
});
//update drink
app.put('/api/installedDrinks/:solenoidIndex', function (req, res){
	Drink.findOneAndUpdate({solenoid:req.params.solenoidIndex},
                req.body
		/*{
			//type : req.body.type,
			name : req.body.name,
			//abv : req.body.abv,
			carbonated : req.body.carbonated,
                        size : req.body.size,
                        unit: req.body.unit,
                        oz: req.body.oz,
			//density : req.body.density,
                        emptiness: req.body.emptiness
		}*/, function(err, drink) {
		if (err)
			res.send(err);

		// get and return all the drinks after you create another
		Drink.find(function(err, drinks) {
			if (err)
				res.send(err);
			res.json(drinks);
		});
	});
});

// delete a drink
app.delete('/api/installedDrinks/:drink_id', function(req, res) {
	Drink.remove({
		_id : req.params.drink_id
	}, function(err, drink) {
		if (err)
			res.send(err);

		// get and return all the drinks after you create another
		Drink.find(function(err, drinks) {
			if (err)
				res.send(err);
			res.json(drinks);
		});
	});
});

// delete a recipe
app.delete('/api/recipes/:recipe_id', function(req, res) {
	Recipe.remove({
		_id : req.params.recipe_id
	}, function(err, recipe) {
		if (err)
			res.send(err);

		// get and return all the recipes after you create another
		Recipe.find(function(err, recipes) {
			if (err)
				res.send(err);
			res.json(recipes);
		});
	});
});

// Start the app by listening on <port>
app.listen(config.port);
console.log('Mean app started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');

// Initializing logger
logger.init(app, passport, mongoose);

// Expose app
exports = module.exports = app;
