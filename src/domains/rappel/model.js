const mongoose = require('mongoose');
const Traitement = require('./../traitement/model');

const rappelSchema = new mongoose.Schema({
  morningDateTime: { type: Date },
  noonDateTime: { type: Date },
  eveningDateTime: { type: Date },
  nombreJours: { type: String },
  userEmail: { type: String },
  nommedicament: { type: String },
  startDate: { type: Date },
  idMedicament: { type: mongoose.Schema.Types.ObjectId, ref: 'Traitement' },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Rappel = mongoose.model("Rappel", rappelSchema);
module.exports = Rappel;