// Dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var logger = require('morgan'); 
var request = require('request'); 
var cheerio = require('cheerio'); 


// Initialize Express
var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}))

// Serve Static Content
app.use(express.static(process.cwd() + '/public'));

// Express-Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// Database configuration with mongoose
// ---------------------------------------------------------------------------------------------------------------
// Connect to localhost if not a production environment
if(process.env.NODE_ENV == 'production'){
  mongoose.connect('mongodb://heroku_r8575rds:70hit1bor32rdje24e1ej0ico5@ds231228.mlab.com:31228/heroku_r8575rds'); 
} else {
  mongoose.connect('mongodb://localhost/ArticleScraper');
}
var db = mongoose.connection;
// Show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});
// Mongoose connection success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});
// Import the comment and article models
var Comment = require('./models/comment.js');
var Article = require('./models/article.js');
// ---------------------------------------------------------------------------------------------------------------

// Import controller
var router = require('./controllers/controller.js');
app.use('/', router);

// Launch App
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Running on port: ' + port);
});