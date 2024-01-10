// Create web server

var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');
var Post = require('../models/Post');

// Get all comments for a post
router.get('/:postId', function(req, res, next) {
  Comment.find({post: req.params.postId}, function(err, comments) {
    if (err) {
      return next(err);
    }
    res.json(comments);
  });
});

// Create a new comment for a post
router.post('/:postId', function(req, res, next) {
  var comment = new Comment(req.body);
  Post.findById(req.params.postId, function(err, post) {
    if (err) {
      return next(err);
    }
    comment.post = post;
    comment.save(function(err, comment) {
      if (err) {
        return next(err);
      }
      post.comments.push(comment);
      post.save(function(err, post) {
        if (err) {
          return next(err);
        }
        res.status(201).json(comment);
      });
    });
  });
});

// Update a comment
router.put('/:commentId', function(req, res, next) {
  Comment.findByIdAndUpdate(req.params.commentId, req.body,
    function(err, comment) {
      if (err) {
        return next(err);
      }
      res.json(comment);
    });
});

// Delete a comment
router.delete('/:commentId', function(req, res, next) {
  Comment.findByIdAndRemove(req.params.commentId, req.body,
    function(err, comment) {
      if (err) {
        return next(err);
      }
      res.json(comment);
    });
});

module.exports = router;