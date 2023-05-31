const mongoose = require('mongoose');

const analyseSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String },
  contact: { type: String, required: true },
  images: [{
    data: { type: Buffer },
    contentType: { type: String }
  }],
  cout: { type: Number },
  remboursement: { type: Number },
  userEmail: { type: String, required: true }
});

const Analyse = mongoose.model("Analyse", analyseSchema);
module.exports = Analyse;
