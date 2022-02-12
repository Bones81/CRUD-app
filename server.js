//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const Venue = require('./models/venue.js');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()

const venueSeedData = require('./models/seedVenues.js')
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// Seed initial data
// Venue.create(venueSeedData, (err, venues) => {
//   if (err) {console.log(err);}
//   console.log('VENUE SEED DATA ADDED');
// })

// Drop collection
// Venue.collection.drop()

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes
//___________________
//localhost:3000
// START PAGE ROUTE
app.get('/' , (req, res) => {
  Venue.countDocuments({}, (err, count) => {
    res.render('start.ejs', {
      tabTitle: 'Venues',
      numVenues: count
    });
  })
});

// INDEX ROUTE
app.get('/venues', (req, res) => {
  Venue.find({}, (err, allVenues) => {
    res.render('index.ejs', {
      tabTitle: 'Venues Home Page',
      venues: allVenues,
      newVenue: false
    })
  })
})

// NEW ROUTE
app.get('/venues/new', (req, res) => {
  res.render('new.ejs', {
    tabTitle: 'Add New Venue'
  })
})

// SHOW ROUTE
app.get('/venues/:id', (req, res) => {
  Venue.findById(req.params.id, (err, foundVenue) => {
    res.render('show.ejs', {
      tabTitle: foundVenue.name + ' | Details',
      venue: foundVenue,
    })
  })
})

// CREATE ROUTE
app.post('/venues', (req, res) => {
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
    Venue.find({}, (err, allVenues) => {
      res.render('index.ejs', {
        tabTitle: 'Venues Home Page',
        venues: allVenues,
        newVenue: createdVenue
      })
    })
  })
})

// EDIT ROUTE
app.get('/venues/:id/edit', (req, res) => {
  Venue.findById(req.params.id, (err, foundVenue) => {
    res.render('edit.ejs', {
      tabTitle: 'Edit ' + foundVenue.name,
      venue: foundVenue
    })
  })
})

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));