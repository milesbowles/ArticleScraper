// Setup Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create Comment Schema
var CommentSchema = new Schema({

  name: {
    type: String
  },

  comment: {
    type: String
  }

});

// Create comment model using Mongoose
var Comment = mongoose.model('Comment', CommentSchema);

// Export comment model
module.exports = Comment;
