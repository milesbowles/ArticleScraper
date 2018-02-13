// Dependencies
var moment = require("moment");
var mongoose = require('mongoose');

// Create Schema Class
var Schema = mongoose.Schema;

// Create Article Schema
var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },
  
  subtitle: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true
  },

  // Date of article scrape - formatted with Moment-JS
  updated: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm A')
  },

  // Create relation to the Comment model
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]

});

// Create article model using mongoose
var Article = mongoose.model('Article', ArticleSchema);

// Export article model
module.exports = Article;