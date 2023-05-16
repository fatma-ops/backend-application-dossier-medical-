const express = require('express');
const router = express.Router();
const Traitement = require('./model');





// add Traitement
router.post('/add' , (req , res) => {
  
    
      try {
        const { userEmail } = req.body;

      const newTraitement = new Traitement ({
        dateDeCommencement:req.body.dateDeCommencement,
        nbrFois:req.body.nbrFois,
        nbrJour:req.body.nbrJour,
        medicament:req.body.medicament,
        userEmail:req.body.userEmail,
        idConsultation:req.body.idConsultation,
        
      })

      newTraitement.save();
      res.status(201).json(newTraitement);
    }catch (err) {
        console.error(err);
        res.status(500).send('Erreur ');
      }


    
  
});

// add Consultation
router.post('/add', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err, 'Erreur');
    } else {
      try {
        const { userEmail } = req.body;

        let traitements = [];

        if (Array.isArray(req.body.traitements)) {
          traitements = req.body.traitements.map((treatment) => {
            return {
              date: treatment.date,
              nbrjours: treatment.nbrjours,
              nbrfois: treatment.nbrfois,
              medicament: treatment.medicament,
            };
          });
        }

        const newTraitement = new Consultation({
          cout: req.body.cout,
          remboursement: req.body.remboursement,
          traitements: traitements,
          idConsultation:req.body.idConsultation,
          userEmail: req.body.userEmail,
        });

        newTraitement.save();
        res.status(201).json(newTraitement);
      } catch (err) {
        console.error(err);
        res.status(500).send('Erreur, essaye');
      }
    }
  });
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
      traitement.nbrFois = req.body.nbrFois;
      traitement.nbrJour = req.body.nbrJour;
      traitement.medicament = req.body.medicament;

      traitement.userEmail = req.body.userEmail;
      traitement.idConsultation = req.body.idConsultation;


  
  
  
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
