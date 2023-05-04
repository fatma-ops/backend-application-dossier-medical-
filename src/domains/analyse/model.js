const mongoose = require('mongoose');

const analyseSchema = new mongoose.Schema({
  title: {
    type: String,
   
  },
  date:{type : String } ,
  contact:{type : String } ,

  userEmail:{ type:String },

  image: { data: Buffer, contentType: String }
  ,created: {
    type: Date,
    required: true,
    default: Date.now,
},
});

const Analyse = mongoose.model("Analyse", analyseSchema);
module.exports = Analyse ;