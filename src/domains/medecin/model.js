const mongoose = require('mongoose');

const medecinSchema = new mongoose.Schema({
  nom: {
    type: String,
   
  },
  adresse:{type : String } ,
  specialite:{type : String } ,
  userEmail:{ type:String },
  numero:{ type:String },
  commentaire:{ type:String },

 
  created: {
    type: Date,
    required: true,
    default: Date.now,
},
});

const Medecin = mongoose.model("Medecin", medecinSchema);
module.exports = Medecin ;