const mongoose = require('mongoose');

const analyseSchema = mongoose.Schema({
  title: { type: String },
  type: { type: String },

  date: { type: String },
  contact: { type: String },
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
