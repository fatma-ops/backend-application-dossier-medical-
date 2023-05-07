const mongoose = require('mongoose');

const analyseSchema = mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String },
  contact: { type: String, required: true },
 
  image: {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true }
  }, 
  cout:{type:String},
  remboursement:{type:String},
  userEmail: { type: String, required: true }
});

// add a virtual property `imageUrl` to the schema
analyseSchema.virtual('imageUrl').get(function() {
  return `/uploads/${this.image.data.toString('base64')}`;
});


const Analyse = mongoose.model("Analyse", analyseSchema);
module.exports = Analyse ;