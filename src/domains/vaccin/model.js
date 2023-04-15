const mongoose = require('mongoose');

const vaccinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date:{type : String , required: true} ,
  userEmail:{ type:String , required: true },

  image: { data: Buffer, contentType: String }
  ,created: {
    type: Date,
    required: true,
    default: Date.now,
},
});

const Vaccin = mongoose.model("Vaccin", vaccinSchema);
module.exports = Vaccin ;