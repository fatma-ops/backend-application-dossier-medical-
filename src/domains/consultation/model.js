const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  type: {
    type: String},
  date:{type : String } ,
  contact:{type: String},
  ordonnance: { data: Buffer, contentType: String },
  idTraitement: { type: mongoose.Schema.Types.ObjectId, ref: 'Traitement' },

  userEmail:{ type:String },
  commentaire:{type:String},
  cout:{type:String},
  remboursement:{type:String},
  created: {
    type: Date,
    required: true,
    default: Date.now,
},
});

const Consultation = mongoose.model("Consultation", consultationSchema);
module.exports = Consultation ;