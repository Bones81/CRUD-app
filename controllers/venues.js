const express = require('express');
const { db } = require('../models/venue.js');
const router = express.Router();
const Venue = require('../models/venue.js')

//___________________
// Routes
//___________________
//localhost:3000
// START PAGE ROUTE
router.get('/' , (req, res) => {
  Venue.countDocuments({}, (err, count) => {
    res.render('start.ejs', {
      tabTitle: 'Venues',
      numVenues: count
    });
  })
});

// INDEX ROUTE
router.get('/venues', (req, res) => {
  Venue.find({}, (err, allVenues) => {
    Venue.countDocuments({}, (err, count) => {
      res.render('index.ejs', {
        tabTitle: 'Venues Home Page',
        venues: allVenues,
        venuesCount: count
      })
    })
  })
})

// NEW ROUTE
router.get('/venues/new', (req, res) => {
  res.render('new.ejs', {
    tabTitle: 'Add New Venue'
  })
})

// SHOW ROUTE
router.get('/venues/:id', (req, res) => {
  Venue.findById(req.params.id, (err, foundVenue) => {
    res.render('show.ejs', {
      tabTitle: foundVenue.name + ' | Details',
      venue: foundVenue,
    })
  })
})

// CREATE ROUTE
router.post('/venues', (req, res) => {
  //reformat form data to match schema
  req.body.capacity = Number(req.body.capacity)
  req.body.cost = Number(req.body.cost)
  req.body.nicknames = req.body.nicknames.split(', ')
  if(req.body.stillExists === "on") {
    req.body.stillExists = true 
  } else {
    req.body.stillExists = false
  }
  req.body.sSports = req.body.sSports.split(', ')
  req.body.sTeams = req.body.sTeams.split(', ')
  
  req.body.links = {} // must initialize 'links' as a key of the data object before you can assign values to it!
  req.body.links.website = req.body.website
  req.body.links.twitter = req.body.twitter
  req.body.links.fb = req.body.fb
  req.body.links.ig = req.body.ig

  // res.send(req.body)
  Venue.create(req.body, (err, createdVenue) => {
    res.redirect('/venues')
  })
})

// EDIT ROUTE
router.get('/venues/:id/edit', (req, res) => {
  Venue.findById(req.params.id, (err, foundVenue) => {
    res.render('edit.ejs', {
      tabTitle: 'Edit ' + foundVenue.name,
      venue: foundVenue
    })
  })
})

// UPDATE ROUTE
router.put('/venues/:id', (req, res) => {
  //reformat form data to match schema
  req.body.capacity = Number(req.body.capacity)
  req.body.cost = Number(req.body.cost)
  req.body.nicknames = req.body.nicknames.split(', ')
  if(req.body.stillExists === "on") {
    req.body.stillExists = true 
  } else {
    req.body.stillExists = false
  }
  req.body.sSports = req.body.sSports.split(', ')
  req.body.sTeams = req.body.sTeams.split(', ')

  req.body.links = {} // must initialize 'links' as a key of the data object before you can assign values to it!
  req.body.links.website = req.body.website
  req.body.links.twitter = req.body.twitter
  req.body.links.fb = req.body.fb
  req.body.links.ig = req.body.ig
  
  Venue.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, foundVenue) => {
    res.redirect('/venues')
  })
})

//DELETE ROUTE
router.delete('/venues/:id', (req, res) => {
  Venue.findByIdAndRemove(req.params.id, (err, droppedVenue) => {
    res.redirect('/venues')
  })
})

//SEARCH ROUTE
router.post('/venues/search', (req, res) => {
  Venue.collection.createIndex( { "$**": "text"} )
  
  Venue.find({ $text: { $search: req.body.searchString} }, (err, searchResults) => {
    res.render('index.ejs', {
      tabTitle: 'Search results',
      venues: searchResults,
      venuesCount: searchResults.length
    })
    
  })
})


module.exports = router