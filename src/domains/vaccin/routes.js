const express = require('express');
const router = express.Router();
const multer = require('multer');
const Vaccin = require('./model');


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



// add Vaccin
router.post('/add' , (req , res) => {
  upload(req , res , (err) => {
    if(err){
      console.log(err , 'it has an error')
    }else {
      try {
        const { userEmail } = req.body;

      const newVaccin = new Vaccin ({
        title:req.body.title,
        maladieCible:req.body.maladieCible,
        date:req.body.date,
        image:{
          data:req.file.filename,
          contentType:'image/png'
        },
        userEmail:req.body.userEmail,
        commentaire : req.body.commentaire
        
      })

      newVaccin.save();
      res.status(201).json(newVaccin);
    }catch (err) {
        console.error(err);
        res.status(500).send('erreur ');
      }


    }
  })
});

//read vaccines
router.get('/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const vaccines = await Vaccin.find({ userEmail });
    res.json(vaccines);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur');
  }
});


// delete an vaccin by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedVaccin = await Vaccin.findByIdAndDelete(id);
    if (!deletedVaccin) {
      return res.status(404).send('Vaccin introuvable');
    }
    res.json(deletedVaccin);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur');
  }
});









// update vaccin
router.put('/put/:id', uploadPut, async (req, res) => {
  const id = req.params.id;

  try {
    // Find the Vaccin to update by ID
    const vaccin = await Vaccin.findById(id);

    if (!vaccin) {
      return res.status(404).send('Vaccin introuvable');
    }

    // Update the Vaccin data with the new file information
    vaccin.title = req.body.title;
    vaccin.maladieCible = req.body.maladieCible;

    vaccin.date = req.body.date;
    vaccin.userEmail = req.body.userEmail;

    vaccin.image.data = req.file.filename;
    vaccin.commentaire = req.body.commentaire;


    // Save the updated Vaccin to the database
    const updatedVaccin = await vaccin.save();

    // Send the updated Vaccin data back to the client
    res.status(200).json(updatedVaccin);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la mise à jour du vaccin');
  }
});
// search vaccines
router.get('/search', async (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the request query parameters
  try {
    const a = await Vaccin.findOne({ $or: [ { title: searchQuery }, { date: searchQuery } ] }); // Search for the image in the database using the name or date
    if (a) {
      res.status(200).json(a); // Return the image data if found
    } else {
      res.status(404).send('Vaccin introuvable'); // Return a 404 error if the image is not found
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching for Vaccin'); // Return a 500 error if an error occurs while searching for the image
  }
});

  module.exports = router;