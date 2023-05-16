const mongoose = require('mongoose');
const Consultation = require('./../consultation/model')
const traitementSchema = new mongoose.Schema({
  cout: { type: String },
  remboursement: { type: String },
  traitements: [{
    dateDeCommencement: { type: String },
    nbrfois: { type: String },
    nbrJours: { type: String },
    medicament: { type: String }
  }],
  
  userEmail:{ type:String },
  idConsultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },

 
  created: {
    type: Date,
    required: true,
    default: Date.now,
},

});

const Traitement = mongoose.model("Traitement", traitementSchema);
module.exports = Traitement ;