// Dependencies
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request'); 
var cheerio = require('cheerio'); 

// Import models
var Comment = require('../models/comment.js');
var Article = require('../models/article.js');

// Root
router.get('/', function (req, res) {
  // Scrape data
  res.redirect('/scrape');
});

// Render scraped articles
router.get('/articles', function (req, res) {

  // Grab articles from MongoDB and sort (newest on top)
  Article.find().sort({ _id: -1 })
    // Grab article comments
    .populate('comments')
    // Render handlebars template
    .exec(function (err, doc) {
      if (err) {
        console.log(err);
      } else {
        var hbsObject = { articles: doc }
        res.render('index', hbsObject);
      }
    });

});

// Web Scrape Route
router.get('/scrape', function (req, res) {
  // URL of website to scrape 
  var url = 'https://curiosity.com/subjects/science-technology/topics/';
  var linkUrl = 'https://curiosity.com'
  // Grab the body of the html with request
  request(url, function (error, response, body) {
    // Load body into cheerio and assign a shorthand selector
    var $ = cheerio.load(body);
    // Scrape each article
    $('.content-card').each(function (i, element) {
      // Creates an empty article object
      var article = {};
      // Grabs the article title 
      article.title = $(this).find('h3').contents()[0]['data'];
      // Grabs the article link 
      article.link = linkUrl + $(this).find('a').attr('href');
      // Grabs the article subtitle 
      article.subtitle = $(this).find('p').contents()[0]['data'];
      // Grabs the article image
      article.image = $(this).find('.topic-image').attr('data-src');
      // Error handling to ensure there are no empty scrapes 
      // TODO: figure out if you should use undefined instead of ''
      if (article.title !== "" && article.summary !== "") {
        // Determines if article is already in the database
        Article.count({ title: article.title }, function (err, check) {
          // Checks if entry is unique
          if (check == 0) {
            // Create a new entry
            var entry = new Article(article);
            // Save entry to database
            entry.save(function (err, articleObject) {
              if (err) {
                console.log(err);
              } else {
                // Print new entry to console
                console.log(articleObject);
              }
            });
          } else {
            // Message to indicate that scraper found content already in database
            console.log('Scrape content already in database')
          }
        });
      } else {
        // Warning that scraper found incomplete data
        console.log('Broken scrape content. Content was not saved to database.')
      }
    });
    // Redirect to articles route
    res.redirect("/articles");
  });
});

// Add comment
router.post('/add/comment/:id', function (req, res) {
  // Grab article id
  var articleId = req.params.id;
  // Grab name
  var name = req.body.name;
  // Grab comment
  var comment = req.body.comment;
  // Article object same as comment model
  var article = {
    name: name,
    comment: comment
  };
  // Create new comment entry
  var entry = new Comment(article);
  // Save entry to database
  entry.save(function (err, commentObject) {
    if (err) {
      console.log(err);
    } else {
      // Push new comment into article comments list
      Article.findOneAndUpdate({ '_id': articleId }, { $push: { 'comments': commentObject._id } }, { new: true })
      // execute the above query
      .exec(function (err, commentObject) {
        if (err) {
          console.log(err);
        } else {
          // Send status code 200 (success)
          res.sendStatus(200);
        }
      });
    }
  });
});

// Delete comment
router.post('/remove/comment/:id', function (req, res) {
  // Grab comment id
  var commentId = req.params.id;
  // Find and remove comment using comment id
  Comment.findByIdAndRemove(commentId, function (err, todo) {
    if (err) {
      console.log(err);
    } else {
      // Send status code 200 (success)
      res.sendStatus(200);
    }
  });
});

// Export Router 
module.exports = router;