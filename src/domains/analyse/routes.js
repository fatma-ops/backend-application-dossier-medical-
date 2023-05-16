const express = require('express');
const router = express.Router();
const multer = require('multer');
const Analyse = require('./model');

const path = require('path');

// Configuration de Multer pour télécharger les fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });




// add Analyse
router.post('/add' ,upload.single('image') ,(req , res) => {
  try {
    const { userEmail } = req.body;
    const { filename } = req.file; // utiliser la propriété filename au lieu de path
    const newAnalyse = new Analyse ({
      title:req.body.title,
      date:req.body.date,
      contact: req.body.contact,
      image: filename, // utiliser filename ici
      cout:req.body.cout,
      remboursement: req.body.remboursement,
      userEmail:req.body.userEmail,
    })

    newAnalyse.save();
    res.status(201).json(newAnalyse);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur ');
  }
});

//read analyses
router.get('/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const analyses = await Analyse.find({ userEmail });
    const updatedAnalyses = analyses.map(analyse => {
      return {
        ...analyse.toObject(),
        image: `uploads/${analyse.image}` // construire un nouveau chemin d'accès relatif pour l'image
      };
    });
    res.json(updatedAnalyses);
  } catch (err) {
    console.error(err);
    res.status(500).send('erreur');
  }
});




// get Image by ID
router.get('/:id', async (req, res) => {
  try {
    const analyse = await Analyse.findById(req.params.id);
    if (!analyse) {
      return res.status(404).json({ msg: 'Image not found' });
    }
    res.set('Content-Type', 'image/jpeg');
    res.sendFile(analyse.image);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Image not found' });
    }
    res.status(500).send('Server Error');
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
router.put('/put/:id', async (req, res) => {
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
    analyse.cout.data = req.body.cout;
    analyse.remboursement = req.body.remboursement;


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
  