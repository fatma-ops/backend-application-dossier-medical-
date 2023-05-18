const mongoose = require('mongoose');
const Traitement = require('./../traitement/model')
const rappelSchema = new mongoose.Schema({
 
  rappels: [{
    heure: { type: String },
   
  }],
  dateDeCommencement:{type: String} ,
  userEmail:{ type:String },
  medicament:{type:String},

  idTraitement: { type: mongoose.Schema.Types.ObjectId, ref: 'Traitement' },

 
  created: {
    type: Date,
    required: true,
    default: Date.now,
},

});

const Rappel = mongoose.model("Rappel", rappelSchema);
module.exports = Rappel ;