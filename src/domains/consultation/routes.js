const express = require('express');
const router = express.Router();
const multer = require('multer');

const Consultation = require('./model');

const fs = require('fs');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    // Vérifier si le fichier est un type de fichier accepté (par exemple, JPEG, PNG, GIF)
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/gif'
    ) {
      cb(null, true); // Accepter le fichier
    } else {
      cb(new Error('Type de fichier non pris en charge')); // Rejeter le fichier
    }
  },
});
// Destination folder to save the photos

// add Consultation
router.post('/add', upload.single('ordonnance'), (req, res) => {
  try {
    const { userEmail } = req.body;
    let cout = req.body.cout ? parseFloat(req.body.cout) : 0;
    let remboursement = req.body.remboursement ? parseFloat(req.body.remboursement) : 0;

    if (isNaN(cout) || isNaN(remboursement) || cout < 0 || remboursement < 0) {
      return res.status(400).json({ message: 'Le cout et le remboursement doivent être des nombres positifs.' });
    }

    const newConsultation = new Consultation({
      objet: req.body.objet,
      type: req.body.type,
      date: req.body.date,
      contact: req.body.contact,
      cout: cout,
      remboursement: remboursement,
      userEmail: req.body.userEmail, 
    });

    if (req.file) {
      newConsultation.ordonnance = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      };
    }

    newConsultation.save();
    res.status(201).json(newConsultation);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur, essaye');
  }
});
// add consultation avec multiple images _________________________________________________
router.post('/add/multiple', upload.array('ordonnance', 3), async (req, res) => {
  try {
    const { userEmail } = req.body;
    let cout = req.body.cout ? parseFloat(req.body.cout) : 0;
    let remboursement = req.body.remboursement ? parseFloat(req.body.remboursement) : 0;

    if (isNaN(cout) || isNaN(remboursement) || cout < 0 || remboursement < 0) {
      return res.status(400).json({ message: 'Le cout et le remboursement doivent être des nombres positifs.' });
    }

    const newConsultation = new Consultation({
      objet: req.body.objet,
      type: req.body.type,
      date: req.body.date,
      contact: req.body.contact,
      cout: cout,
      remboursement: remboursement,
      userEmail: req.body.userEmail, 
      ordonnonces: []
    });

    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        newConsultation.ordonnance.push({
          data: fs.readFileSync(req.files[i].path),
          contentType: req.files[i].mimetype,
        });
      }
    }

    await newConsultation.save();
    res.status(201).json(newConsultation);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l\'enregistrement de l\'analyse dans la base de données');
  }
});






//read consultations
router.get('/:userEmail', async (req, res) => {
    try {
      const userEmail = req.params.userEmail;
      const consultations = await Consultation.find({ userEmail });
      res.json(consultations);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur');
    }
  });


//Affiche les images d'analyse
router.get('/imagesConsultation/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    const images = consultation.ordonnance; // Supposons que les images soient stockées dans un tableau appelé "images"

    const imageResponses = images.map((image) => ({
      contentType: image.contentType,
      data: image.data.toString('base64')
    }));

    res.status(200).json({
      images: imageResponses
    });
  } catch (err) {
    console.error('Error fetching images:', err);
    res.sendStatus(500);
  }
});







  // delete an consultation by ID
router.delete('/delete/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const deletedConsultation = await Consultation.findByIdAndDelete(id);
      if (!deletedConsultation) {
        return res.status(404).send('Consultation introuvable');
      }
      res.json(deletedConsultation);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur');
    }
  });

  router.put('/modifier/:id', upload.single('ordonnance'), async (req, res) => {
    try {
      const { id } = req.params;
      const { userEmail } = req.body;
  
      const updatedConsulation = {
        objet: req.body.objet,
          type:req.body.type,
          date: req.body.date,
          contact: req.body.contact,
        userEmail: req.body.userEmail,
        cout: req.body.cout,
          remboursement:req.body.remboursement,
      };
  
      if (req.file) {
        updatedConsulation.ordonnance = {
          data: fs.readFileSync(req.file.path),
          contentType: req.file.mimetype,
        };
      }
      const result = await Consultation.findByIdAndUpdate(id, updatedConsulation, { new: true });
      if (!result) {
        return res.status(404).json({ message: 'consultation introuvable' });
      }
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la modification du consultation');
    }
  });

  
  


  module.exports = router;
