const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  name: { type: String,
     required: true },
  date: {type : String , required: true},
  image: { type: String},
  
  created: {
    type: Date,
    required: true,
    default: Date.now,
},
  
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
