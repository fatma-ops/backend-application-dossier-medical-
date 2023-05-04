const mongoose = require('mongoose');

const vaccinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  maladieCible:{type:String},
  date:{type : String } ,
  userEmail:{ type:String , required: true },

  image: { data: Buffer, contentType: String },
 commentaire:{type:String }

  ,created: {
    type: Date,
    required: true,
    default: Date.now,
},
});

const Vaccin = mongoose.model("Vaccin", vaccinSchema);
module.exports = Vaccin ;