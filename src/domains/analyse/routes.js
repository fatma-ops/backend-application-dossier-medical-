const express = require('express');
const router = express.Router();
const multer = require('multer');
const Analyse = require('./model');

const path = require('path');

//storage 
const Storage = multer.diskStorage({
  destination:'uploads',
  filename:(req,file,cb)=>{
    cb(null , file.originalname);
  }
});
const upload = multer({
  storage:Storage
}).single('testimage');
// Upload middleware for PUT request
const uploadPut = multer({
  storage: Storage
}).single('testimage');

// Serveur d'images
router.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);
  res.sendFile(imagePath);
});


// add Analyse
router.post('/add' , (req , res) => {
  upload(req , res , (err) => {
    if(err){
      console.log(err , 'it has an error')
    }else {
      try {
        const { userEmail } = req.body;

      const newAnalyse = new Analyse ({
        title:req.body.title,
        date:req.body.date,
        contact: req.body.contact,

        image:{
          data:req.file.filename,
          contentType:'image/png'
        },
        userEmail:req.body.userEmail,
        
      })

      newAnalyse.save();
      res.status(201).json(newAnalyse);
    }catch (err) {
        console.error(err);
        res.status(500).send('Zrreur ');
      }


    }
  })
});

//read analyses
router.get('/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const analyses = await Analyse.find({ userEmail });
    res.json(analyses);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur');
  }
});










// delete an analysis by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedAnalyse = await Analyse.findByIdAndDelete(id);
    if (!deletedAnalyse) {
      return res.status(404).send('Analyse introuvable');
    }
    res.json(deletedAnalyse);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur');
  }
});









// update analyse
router.put('/put/:id', uploadPut, async (req, res) => {
  const id = req.params.id;

  try {
    // Find the image to update by ID
    const analyse = await Analyse.findById(id);

    if (!analyse) {
      return res.status(404).send('Analyse introuvable');
    }

    // Update the image data with the new file information
    analyse.title = req.body.title;
    analyse.date = req.body.date;
    analyse.contact = req.body.contact;

    analyse.userEmail = req.body.userEmail;

    analyse.image.data = req.file.filename;

    // Save the updated image to the database
    const updatedAnalyse = await analyse.save();

    // Send the updated image data back to the client
    res.status(200).json(updatedAnalyse);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la mise à jour de la analyse');
  }
});
// search analyses
router.get('/search', async (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the request query parameters
  try {
    const a = await Analyse.findOne({ $or: [ { title: searchQuery }, { date: searchQuery } ] }); // Search for the image in the database using the name or date
    if (a) {
      res.status(200).json(a); // Return the image data if found
    } else {
      res.status(404).send('Image not found'); // Return a 404 error if the image is not found
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching for image'); // Return a 500 error if an error occurs while searching for the image
  }
});

  module.exports = router;
  