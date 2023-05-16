const mongoose = require('mongoose');

const analyseSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String },
  contact: { type: String, required: true },
 
  image: {
   type:String
  }, 
  cout:{type:String},
  remboursement:{type:String},
  userEmail: { type: String, required: true }
});




const Analyse = mongoose.model("Analyse", analyseSchema);
module.exports = Analyse ;