const express = require('express');
const router = express.Router();
const Rappel = require('./model');

router.post('/add', async (req, res) => {
  try {

    const newRappel = new Rappel({
      morningDateTime: req.body.morningDateTime,
      noonDateTime: req.body.noonDateTime,
      eveningDateTime: req.body.eveningDateTime,
      nombreJours:req.body.nombreJours,
      startDate: req.body.startDate,
      nommedicament: req.body.nommedicament,
      idMedicament: req.body.idMedicament,
      userEmail: req.body.userEmail,
    });

    await newRappel.save();
    res.status(201).json(newRappel);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur');
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
