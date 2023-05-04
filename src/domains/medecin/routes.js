const express = require('express');
const router = express.Router();
const Medecin = require('./model');





// add Analyse
router.post('/add' , (req , res) => {
  
    
      try {
        const { userEmail } = req.body;

      const newMedecin = new Medecin ({
        nom:req.body.nom,
        adresse:req.body.adresse,
        specialite:req.body.specialite,
        numero:req.body.numero,
        commentaire:req.body.commentaire,
        userEmail:req.body.userEmail,
        
      })

      newMedecin.save();
      res.status(201).json(newMedecin);
    }catch (err) {
        console.error(err);
        res.status(500).send('Erreur ');
      }


    
  
});

//read médecin
router.get('/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const medecins = await Medecin.find({ userEmail });
    res.json(medecins);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur');
  }
});










// delete an medecin by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMedecin = await Medecin.findByIdAndDelete(id);
    if (!deletedMedecin) {
      return res.status(404).send('Médecin introuvable');
    }
    res.json(deletedMedecin);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur');
  }
});









// update analyse
router.put('/put/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Find the image to update by ID
    const medecin = await Medecin.findById(id);

    if (!medecin) {
      return res.status(404).send('Médecin introuvable');
    }

    // Update the image data with the new file information
    medecin.nom = req.body.nom;
    medecin.adresse = req.body.adresse;
    medecin.specialite = req.body.specialite,
    medecin.numero=req.body.numero,
    medecin.commentaire = req.body.commentaire,

    medecin.userEmail = req.body.userEmail;


    // Save the updated image to the database
    const updatedMedecin = await medecin.save();

    // Send the updated image data back to the client
    res.status(200).json(updatedMedecin);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la mise à jour du contact');
  }
});
// search analyses
router.get('/search', async (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the request query parameters
  try {
    const a = await Medecin.findOne({ $or: [ { nom: searchQuery }, { adresse: searchQuery } ] }); // Search for the image in the database using the name or date
    if (a) {
      res.status(200).json(a); // Return the image data if found
    } else {
      res.status(404).send('Medecin introuvable'); // Return a 404 error if the image is not found
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur'); // Return a 500 error if an error occurs while searching for the image
  }
});


  module.exports = router;
  