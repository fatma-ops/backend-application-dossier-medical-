const express = require('express');
const router = express.Router();
const Traitement = require('./model');

// add traitement
router.post('/add', (req, res) => {
  try {
    const { userEmail } = req.body;
    let medicaments = [];

    if (Array.isArray(req.body.medicaments)) {
      medicaments = req.body.medicaments.map((medicament) => {
        return {
          nommedicament: medicament.nommedicament,
          dateDeCommencement: medicament.dateDeCommencement,
          nbrfois: parseInt(medicament.nbrfois),
          nbrJours: parseInt(medicament.nbrJours),
        };
      });
    }

    const cout = req.body.cout ? parseFloat(req.body.cout) : 0;
    const remboursement = req.body.remboursement ? parseFloat(req.body.remboursement) : 0;
   
    if (isNaN(cout) || isNaN(remboursement)) {
      return res.status(400).json({ message: 'Le cout et le remboursement doivent être des nombres.' });
    }
    
    if (cout < 0) {
      return res.status(400).json({ message: 'Le cout ne peut pas être négatif.' });
    }
    
    if (remboursement < 0) {
      return res.status(400).json({ message: 'Le remboursement ne peut pas être négatif.' });
    }
    
    if (cout > 1000000) {
      return res.status(400).json({ message: 'Le cout ne peut pas dépasser 1,000,000.' });
    }
    
    if (remboursement > 1000000) {
      return res.status(400).json({ message: 'Le remboursement ne peut pas dépasser 1,000,000.' });
    }
    
    const newTraitement = new Traitement({
      cout: cout,
      remboursement: remboursement,
      medicaments: medicaments,
      idConsultation: req.body.idConsultation,
      userEmail: req.body.userEmail,
    });

    if (medicaments.some((medicament) => medicament.nbrfois <= 0 || Number.isNaN(medicament.nbrfois) || Number.isInteger(medicament.nbrfois) === false)) {
      return res.status(400).json({ message: 'Le nombre de fois est invalide.' });
    }

    if (medicaments.some((medicament) => medicament.nbrJours <= 0 || Number.isNaN(medicament.nbrJours) || Number.isInteger(medicament.nbrJours) === false)) {
      return res.status(400).json({ message: 'Le nombre de jours est invalide.' });
    }

    if (medicaments.some((medicament) => medicament.nbrfois > 10)) {
      return res.status(400).json({ message: 'Le nombre de fois ne doit pas dépasser 10.' });
    }

    if (medicaments.some((medicament) => medicament.nbrJours > 30)) {
      return res.status(400).json({ message: 'Le nombre de jours ne doit pas dépasser 30.' });
    }

    newTraitement.save();
    res.status(201).json(newTraitement);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur, essaye');
  }
});


router.get('/traitements/:userEmail/:idConsultation', (req, res) => {
  const { userEmail, idConsultation } = req.params;

  Traitement.find({ userEmail, idConsultation })
    .then((traitements) => {
      res.status(200).json(traitements);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Erreur, essaye');
    });
});






router.get('/traitements/:userEmail', (req, res) => {
  const { userEmail } = req.params;

  Traitement.find({ userEmail })
    .then((traitements) => {
      res.status(200).json(traitements);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Erreur, essaye');
    });
});




// GET treatments by userEmail and consultation ID
router.get('/:userEmail/:idConsultation', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const idConsultation = req.params.idConsultation;
    const traitement = await Traitement.findOne({ userEmail: userEmail, idConsultation: idConsultation }).select('traitements');
    if (traitement && traitement.traitements.length > 0) {
      res.status(200).json(traitement.traitements);
    } else {
      res.status(200).json([]); // Return an empty array if no treatments found
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve treatments' });
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
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail, medicaments, cout, remboursement } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'L\'identifiant du traitement est requis.' });
    }

    

    // Vérifier si le traitement existe dans la base de données
    const existingTraitement = await Traitement.findById(id);
    if (!existingTraitement) {
      return res.status(404).json({ message: 'Le traitement spécifié est introuvable.' });
    }

    // Mettre à jour les propriétés du traitement existant
    existingTraitement.userEmail = userEmail;
    existingTraitement.medicaments = medicaments;
    existingTraitement.cout = parseFloat(cout);
    existingTraitement.remboursement = parseFloat(remboursement);

    // Valider les modifications
    if (isNaN(existingTraitement.cout) || isNaN(existingTraitement.remboursement)) {
      return res.status(400).json({ message: 'Le cout et le remboursement doivent être des nombres.' });
    }

    if (existingTraitement.cout < 0) {
      return res.status(400).json({ message: 'Le cout ne peut pas être négatif.' });
    }

    if (existingTraitement.remboursement < 0) {
      return res.status(400).json({ message: 'Le remboursement ne peut pas être négatif.' });
    }

    if (existingTraitement.cout > 1000000) {
      return res.status(400).json({ message: 'Le cout ne peut pas dépasser 1,000,000.' });
    }

    if (existingTraitement.remboursement > 1000000) {
      return res.status(400).json({ message: 'Le remboursement ne peut pas dépasser 1,000,000.' });
    }

    // Valider les propriétés des médicaments
    if (existingTraitement.medicaments.some((medicament) => medicament.nbrfois <= 0 || isNaN(medicament.nbrfois) || !Number.isInteger(medicament.nbrfois))) {
      return res.status(400).json({ message: 'Le nombre de fois est invalide.' });
    }

    if (existingTraitement.medicaments.some((medicament) => medicament.nbrJours <= 0 || isNaN(medicament.nbrJours) || !Number.isInteger(medicament.nbrJours))) {
      return res.status(400).json({ message: 'Le nombre de jours est invalide.' });
    }

    if (existingTraitement.medicaments.some((medicament) => medicament.nbrfois > 10)) {
      return res.status(400).json({ message: 'Le nombre de fois ne doit pas dépasser 10.' });
    }

    if (existingTraitement.medicaments.some((medicament) => medicament.nbrJours > 30)) {
      return res.status(400).json({ message: 'Le nombre de jours ne doit pas dépasser 30.' });
    }

    // Sauvegarder les modifications dans la base de données
    const updatedTraitement = await existingTraitement.save();

    res.status(200).json(updatedTraitement);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la mise à jour du traitement.');
  }
});



  
module.exports = router;
