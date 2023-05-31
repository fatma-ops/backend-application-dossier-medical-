const express = require('express');
const router = express.Router();
const multer = require('multer');
const Vaccin = require('./model');

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

// add Vaccin avec une seule photo_______________________________________________
router.post('/add' , upload.single('image'), (req , res) => {
 
      try {
        const { userEmail } = req.body;

      const newVaccin = new Vaccin ({
        title:req.body.title,
        maladieCible:req.body.maladieCible,
        date:req.body.date,
        image:{
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype
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
});
//________________________________________________________________________________
router.post('/add/multiple', upload.array('images', 3), async (req, res) => {
  try {
    const { userEmail } = req.body;
    

    

    const newVaccin = new Vaccin({
      title:req.body.title,
        maladieCible:req.body.maladieCible,
        date:req.body.date,
     
      userEmail: req.body.userEmail, 
      images: [],
      commentaire : req.body.commentaire 

    });

    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        newVaccin.images.push({
          data: fs.readFileSync(req.files[i].path),
          contentType: req.files[i].mimetype,
        });
      }
    }

    await newVaccin.save();
    res.status(201).json(newVaccin);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l\'enregistrement de l\'analyse dans la base de données');
  }
});
//________________________________________________________________________

//read vaccins 
router.get('/user/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;

    const vaccines = await Vaccin.find({ userEmail: userEmail });
    res.status(200).json(vaccines);
  } catch (err) {
    console.error('Error fetching vaccines:', err);
    res.sendStatus(500).send('erreur');
  }
});
//Affiche les images du vaccin
router.get('/imagesVaccin/:id', async (req, res) => {
  try {
    const vaccin = await Vaccin.findById(req.params.id);
    const images = vaccin.images; // Supposons que les images soient stockées dans un tableau appelé "images"

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


//Update analyse_____________________________________________________________________
router.put('/modifier/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;

    const updatedVaccin = {
      title: req.body.title,
      maladieCible: req.body.maladieCible,
      date: req.body.date,
      userEmail: req.body.userEmail,
      commentaire: req.body.commentaire,
    };

    if (req.file) {
      updatedVaccin.image = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      };
    }
    const result = await Vaccin.findByIdAndUpdate(id, updatedVaccin, { new: true });
    if (!result) {
      return res.status(404).json({ message: 'Vaccin introuvable' });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la modification du vaccin');
  }
});

//________________________________________________________________________________

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