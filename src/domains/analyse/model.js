const mongoose = require('mongoose');

const analyseSchema = new mongoose.Schema({
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

const Analyse = mongoose.model("Analyse", analyseSchema);
module.exports = Analyse ;