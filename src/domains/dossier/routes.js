const express = require('express');
const router = express.Router();
const Dossier = require('./model');

// Créer un nouveau dossier
router.post('/Add', async (req, res) => {
    try {
      const { nom, userEmail } = req.body;
      const dossier = new Dossier({ nom, userEmail });
      const savedDossier = await dossier.save();
      res.status(201).json(savedDossier);
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la création du dossier' });
    }
  });


  router.post('/Addq', async (req, res) => {
    const { nom, userEmail } = req.body;
  
    // Vérifiez le nombre de dossiers associés à l'email de l'utilisateur
    const count = await Dossier.countDocuments({ userEmail });
  
    // Vérifiez si le nombre de dossiers est inférieur à 4
    if (count < 4) {
      // Créez le nouveau dossier
      const nouveauDossier = new Dossier({ nom, userEmail });
      await nouveauDossier.save();
  
      // Répondez avec succès
      return res.status(200).json({ message: 'Dossier créé avec succès.' });
    }
  
    // Renvoyez une réponse indiquant que le nombre maximal de dossiers a été atteint
    return res.status(400).json({ message: 'Vous avez atteint le nombre maximal de dossiers.' });
  });
  
  // Obtenir tous les dossiers par email
router.get('/dossiers/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const dossiers = await Dossier.find({ userEmail: email });
    res.status(200).json(dossiers);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des dossiers' });
  }
});
  
  // Obtenir un dossier par son ID
  router.get('/:id', async (req, res) => {
    try {
      const dossier = await Dossier.findById(req.params.id);
      if (dossier) {
        res.status(200).json(dossier);
      } else {
        res.status(404).json({ error: 'Dossier introuvable' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du dossier' });
    }
  });
  
  // Mettre à jour un dossier
  router.put('/update/:id', async (req, res) => {
    try {
      const { nom } = req.body;
      const updatedDossier = await Dossier.findByIdAndUpdate(req.params.id, { nom }, { new: true });
      if (updatedDossier) {
        res.status(200).json(updatedDossier);
      } else {
        res.status(404).json({ error: 'Dossier introuvable' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du dossier' });
    }
  });
  
  // Supprimer un dossier
  router.delete('/delete/:id', async (req, res) => {
    try {
      const deletedDossier = await Dossier.findByIdAndDelete(req.params.id);
      if (deletedDossier) {
        res.status(200).json({ message: 'Dossier supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Dossier introuvable' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du dossier' });
    }
  });
  
  module.exports = router;




module.exports = router;
