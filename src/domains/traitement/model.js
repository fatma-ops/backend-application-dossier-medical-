const mongoose = require('mongoose');
const Consultation = require('./../consultation/model')
const traitementSchema = new mongoose.Schema({
  dateDeCommencement: {
    type: String,
   
  },
  nombreFois:{type : String } ,
  nombreJour:{type : String } ,
  userEmail:{ type:String },
  idConsultation: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' },
  heureRappel:{ type:String },

 
  created: {
    type: Date,
    required: true,
    default: Date.now,
},

});

const Traitement = mongoose.model("Traitement", traitementSchema);
module.exports = Traitement ;