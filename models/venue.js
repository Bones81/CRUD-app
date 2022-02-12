const mongoose = require('mongoose')
const Schema = mongoose.Schema

const venueSchema = new Schema({
  name: {type: String, required: true, unique: true },
  type: {type: String},
  year: {type: String},
  capacity: {type: Number},
  cost: {type: Number},
  nicknames: [String],
  stillExists: Boolean,
  pSport: {type: String},
  pTeam: {type: String},
  sSports: [String],
  sTeams: [String],
  city: {type: String},
  state: {type: String},
  country: {type: String},
  outsideImg: {type: String},
  insideImg: {type: String},
  highlightURL: {type: String},
  mapsURL: {type: String},
  links: {
    website: {type: String},
    twitter: {type: String},
    fb: {type: String},
    ig: {type: String},
  }
})

const Venue = mongoose.model('Venue', venueSchema)

module.exports = Venue