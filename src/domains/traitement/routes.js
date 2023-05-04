const express = require('express');
const router = express.Router();
const Traitement = require('./model');





// add Traitement
router.post('/add' , (req , res) => {
  
    
      try {
        const { userEmail } = req.body;

      const newTraitement = new Traitement ({
        dateDeCommencement:req.body.dateDeCommencement,
        nombreFois:req.body.nombreFois,
        nombreJour:req.body.nombreJour,
        userEmail:req.body.userEmail,
        idConsultation:req.body.idConsultation,
        heureRappel:req.body.heureRappel,
        
      })

      newTraitement.save();
      res.status(201).json(newTraitement);
    }catch (err) {
        console.error(err);
        res.status(500).send('Erreur ');
      }


    
  
});


//read Traitement
router.get('/:idConsultation', async (req, res) => {
    try {
      const idConsultation = req.params.idConsultation;
      const traitements = await Traitement.find({ idConsultation });
      res.json(traitements);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur');
    }
  });



  router.delete('/delete/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const deletedTraitement = await Traitement.findByIdAndDelete(id);
      if (!deletedTraitement) {
        return res.status(404).send('Traitement introuvable');
      }
      res.json(deletedTraitement);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur');
    }
  });


// update Traitement
router.put('/put/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      // Find the treatement to update by ID
      const traitement = await Traitement.findById(id);
  
      if (!traitement) {
        return res.status(404).send('Traitement introuvable');
      }
  
      // Update the treatemenr data with the new file information
      traitement.dateDeCommencement = req.body.dateDeCommencement;
      traitement.nombreFois = req.body.nombreFois;
      traitement.nombreJour = req.body.nombreJour;
      traitement.userEmail = req.body.userEmail;
      traitement.idConsultation = req.body.idConsultation;

      traitement.heureRappel=req.body.heureRappel;

  
  
  
      // Save the updated treatement to the database
      const updatedTraitement = await traitement.save();
  
      // Send the updated treatement data back to the client
      res.status(200).json(updatedTraitement);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la mise à jour du Traitement');
    }
  });

  
module.exports = router;
