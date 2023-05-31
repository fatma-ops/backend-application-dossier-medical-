const mongoose = require('mongoose');
const Consultation = require('./../consultation/model')
const traitementSchema = new mongoose.Schema({
  cout: { type: Number }, 
  remboursement: { type: Number },
  medicaments: [{
    
    nommedicament: { type: String },
    dateDeCommencement: { type: Date },
    nbrfois: { type: Number },
    nbrJours: { type: Number },
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