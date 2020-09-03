const express = require('express');
const mongoose = require('mongoose');

//load helper
const {ensureAuthenticated} = require('../helper/auth');
const router = express.Router();

//load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');


//idea index page
router.get('/', ensureAuthenticated, (req,res) => {
  Idea.find({user: req.user.id}).sort({date:-1}).then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
  });
});

//add idea form
router.get('/add', ensureAuthenticated, (req,res) => {
  res.render('ideas/add');
});


//edit idea form
router.get('/edit/:id', ensureAuthenticated, (req,res) => {
  Idea.findOne({_id:req.params.id}).then(idea => {
    if(idea.user != req.user.id){
      req.flash('error_msg','Not Authorized');
      res.redirect('/ideas');
    }
    else {
      res.render('ideas/edit', {
        idea:idea
      });
    }
  });
});


//process form
router.post('/',ensureAuthenticated,  (req,res) => {
  let errors =[];

  if(!req.body.title){
    errors.push({text:"Title Empty!!"});
  }
  if(!req.body.details){
    errors.push({text:"Details Empty!!"});
  }
  if(errors.length > 0){
    res.render('ideas/add',{
      errors:errors,
      title:req.body.title,
      details:req.body.details
    });
  }
    else{
      const newUser = {
        title:req.body.title,
        details:req.body.details,
        user:req.user.id
      }
      new Idea(newUser).save().then(idea => {
          req.flash('success_msg', 'Video Idea Added');
        res.redirect('/ideas');
      });
      //res.send('OK');
    }
});


//edit form process
router.put('/:id', ensureAuthenticated, (req,res) => {
  Idea.findOne({_id:req.params.id}).then(idea => {
    //change the value
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save().then(idea => {
      req.flash('success_msg', 'Updated');
      res.redirect('/ideas');
    });
  });
});

//delete idea
router.delete('/:id', ensureAuthenticated, (req,res) => {
  Idea.remove({_id:req.params.id}).then(() => {
    req.flash('success_msg', 'Video Idea Removed');
    res.redirect('/ideas');
  });
});


module.exports = router;
