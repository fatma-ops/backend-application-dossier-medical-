const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  name: { type: String,
     required: true },
  date: {type : String },
  image: { data: Buffer, contentType: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
},
  
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
