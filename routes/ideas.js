const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Idea index page
router.get('/', (req, res) => {
   Idea.find({})
       .lean()
       .sort({ date: 'desc' })
       // without lean() -->
       // .then(ideas => {
       //     res.render('ideas/index', {
       //         ideas_to_hb: ideas.map(xer => xer.toJSON());
       //     });
       // })
       .then(ideas => {
           console.log(ideas);
           res.render('ideas/index', {
               ideas_to_handlebars: ideas
           });
       })
       .catch(error => res.status(500).send(error));
});

// Add idea form
router.get('/add', (req, res) => {
   res.render('ideas/add');
});

// edit idea form
router.get('/edit/:id', (req, res) => {
   Idea.findOne({
       _id: req.params.id
   })
       .lean()
       .then(idea => {
           res.render('ideas/edit', {
               idea_to_hb: idea
           });
       })
});


//  Process form
router.post('/', (req, res) => {
   let errors = [];

   if (!req.body.title) {
       errors.push({ text: 'Please add title.' });
   }

   if (!req.body.details) {
       errors.push({ text: 'Please add details.' });
   }

   if (errors.length > 0) {
       res.render('ideas/add', {
           errors: errors,
           title: req.body.title,
           details: req.body.details
       });
   } else {
       const newUser = {
           title: req.body.title,
           details: req.body.details
       };
       new Idea(newUser)
           .save()
           .then(idea => {
               req.flash('success_msg','Added successfully!');
               res.redirect('/ideas');
           })
   }

});

// Edit form process
router.put('/:id', (req, res) => {
   Idea.findOne({
       _id: req.params.id
   })
       .then(idea => {
           idea.title = req.body.title;
           idea.details = req.body.details;

           idea.save().then(idea => {
               //res.redirect('/ideas');
           })
       })
});

// Delete idea
router.delete('/:id', (req, res) => {
   Idea.deleteOne({ _id: req.params.id })
       .then(() => {
           req.flash('success_msg','Idea successfully deleted!');
           res.redirect('/ideas');
       })
});


module.exports = router;

