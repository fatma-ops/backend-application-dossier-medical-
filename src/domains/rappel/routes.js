const express = require('express');
const router = express.Router();
const Rappel = require('./model');

// add rappel
router.post('/add', (req, res) => {
      try {
        const { userEmail } = req.body;
        let rappels = [];
        if (Array.isArray(req.body.rappels)) {
          rappels = req.body.rappels.map((rappel) => {
            return {
              
              heure: rappel.heure,
              
            };
          });
        }
        const newRappel = new Rappel({
          rappels: rappels,
          dateDeCommencement : req.body.dateDeCommencement,
          medicament:req.body.medicament,
          idTraitement:req.body.idTraitement,
          userEmail: req.body.userEmail,
        });

        newRappel.save();
        res.status(201).json(newRappel);
      } catch (err) {
        console.error(err);
        res.status(500).send('Erreur, essaye');
      }
    
  
});
// Get Rappel
router.get('/:userEmail', (req, res) => {
  const { userEmail } = req.params;

  Rappel.find({ userEmail })
    .then((rappels) => {
      res.status(200).json(rappels);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Erreur, essaye');
    });
});

// Delete Rappel
router.delete('/delete/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const deletedRappel = await Rappel.findByIdAndDelete(id);
      if (!deletedRappel) {
        return res.status(404).send('Rappel introuvable');
      }
      res.json(deletedRappel);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur');
    }
  });

  module.exports = router;
