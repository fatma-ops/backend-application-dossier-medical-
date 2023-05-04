const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  type: {
    type: String},
  date:{type : String } ,
  contact:{type: String},
  ordonnace: { data: Buffer, contentType: String },
  idTraitement: { type: mongoose.Schema.Types.ObjectId, ref: 'Traitement' },

  userEmail:{ type:String },
  created: {
    type: Date,
    required: true,
    default: Date.now,
},
});

const Consultation = mongoose.model("Consultation", consultationSchema);
module.exports = Consultation ;