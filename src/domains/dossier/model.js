const mongoose = require('mongoose');

const dossierSchema = mongoose.Schema({
  nom: { type: String },
 
  userEmail: { type: String, required: true },
  created: {
    type: Date,
    required: true,
    default: Date.now,
},
});

const Dossier = mongoose.model("Dossier", dossierSchema);
module.exports = Dossier;