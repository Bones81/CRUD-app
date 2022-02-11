const mongoose = require('mongoose')
const Schema = mongoose.Schema

const venueSchema = new Schema({
  name: {type: String, required: true, unique: true },
  venueType: {type: String},
  yearBuilt: {type: String},
  capacity: {type: Number},
  costToBuild: {type: Number},
  nicknames: [String],
  stillExists: Boolean,
  pSport: {type: String},
  pTeams: {type: String},
  sSports: [String],
  sTeams: [String],
  city: {type: String},
  state: {type: String},
  country: {type: String},
  outsideImg: {type: String},
  insideImg: {type: String},
  highlightURL: {type: String},
  mapsURL: {type: String},
  socialLinks: {
    twitter: {type: String},
    fb: {type: String},
    ig: {type: String},
  }
})

const Venue = mongoose.model('Venue', venueSchema)

module.exports = Venue