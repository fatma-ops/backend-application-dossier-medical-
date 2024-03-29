const express = require('express');
const router = express.Router();
const multer = require('multer');
const Analyse = require('./model');


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


//Add Analyse avec seule image ______________________________________________________
router.post('/add', upload.single('images'), async (req, res) => {
  try {
    const { userEmail } = req.body;
    let cout = req.body.cout ? parseFloat(req.body.cout) : 0;
    let remboursement = req.body.remboursement ? parseFloat(req.body.remboursement) : 0;

    if (isNaN(cout) || isNaN(remboursement) || cout < 0 || remboursement < 0) {
      return res.status(400).json({ message: 'Le cout et le remboursement doivent être des nombres positifs.' });
    }

    const newAnalyse = new Analyse({
      title: req.body.title,
      type: req.body.type,

      date: req.body.date,
      contact: req.body.contact,
      cout: cout,
      remboursement: remboursement,
      userEmail: req.body.userEmail, 
    });

    if (req.file) {
      newAnalyse.images = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
      };
    }

    await newAnalyse.save();
    res.status(201).json(newAnalyse);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l\'enregistrement de l\'analyse dans la base de données');
  }
});


// add Analyse avec multiple images _________________________________________________
router.post('/add/multiple', upload.array('images', 3), async (req, res) => {
  try {
    const { userEmail } = req.body;
    let cout = req.body.cout ? parseFloat(req.body.cout) : 0;
    let remboursement = req.body.remboursement ? parseFloat(req.body.remboursement) : 0;

    if (isNaN(cout) || isNaN(remboursement) || cout < 0 || remboursement < 0) {
      return res.status(400).json({ message: 'Le cout et le remboursement doivent être des nombres positifs.' });
    }
    if (cout > 1000000) {
      return res.status(400).json({ message: 'Le cout ne peut pas dépasser 1,000,000.' });
    }
    
    if (remboursement > 1000000) {
      return res.status(400).json({ message: 'Le remboursement ne peut pas dépasser 1,000,000.' });
    }
    const newAnalyse = new Analyse({
      title: req.body.title,
      type: req.body.type,

      date: req.body.date,
      contact: req.body.contact,
      cout: cout,
      remboursement: remboursement,
      userEmail: req.body.userEmail, 
      images: []
    });

    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        newAnalyse.images.push({
          data: fs.readFileSync(req.files[i].path),
          contentType: req.files[i].mimetype,
        });
      }
    }

    await newAnalyse.save();
    res.status(201).json(newAnalyse);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l\'enregistrement de l\'analyse dans la base de données');
  }
});

//________________________________________________________________________________
router.put('/modifier/analyse/:id', upload.array('images', 3), async (req, res) => {
  try {
    const analyseId = req.params.id;
    const { title,type, date, contact, cout, remboursement, userEmail } = req.body;

    if (isNaN(parseFloat(cout)) || isNaN(parseFloat(remboursement)) || parseFloat(cout) < 0 || parseFloat(remboursement) < 0) {
      return res.status(400).json({ message: 'Le cout et le remboursement doivent être des nombres positifs.' });
    }
    if (cout > 1000000) {
      return res.status(400).json({ message: 'Le cout ne peut pas dépasser 1,000,000.' });
    }
    
    if (remboursement > 1000000) {
      return res.status(400).json({ message: 'Le remboursement ne peut pas dépasser 1,000,000.' });
    }
    const analyse = await Analyse.findById(analyseId);
    if (!analyse) {
      return res.status(404).json({ message: 'Analyse non trouvée.' });
    }

    analyse.title = title;
    analyse.type = type;

    analyse.date = date;
    analyse.contact = contact;
    analyse.cout = parseFloat(cout);
    analyse.remboursement = parseFloat(remboursement);
    analyse.userEmail = userEmail;

    if (req.files) {
      if (req.files.length === 0) {
        return res.status(400).json({ message: 'veuillez remplir tous les champs obligatoires.' });
      }
    
      analyse.images = [];
      for (let i = 0; i < req.files.length; i++) {
        analyse.images.push({
          data: fs.readFileSync(req.files[i].path),
          contentType: req.files[i].mimetype,
        });
      }
    } else {
      return res.status(400).json({ message: 'veuillez remplir les champs obligatoires.' });
    }
    

    await analyse.save();
    res.json(analyse);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la modification de l'analyse dans la base de données");
  }
});














//___________________________________________________________________________________

//read analyses
router.get('/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;

    const analyses = await Analyse.find({ userEmail: userEmail });
    res.status(200).json(analyses);
  } catch (err) {
    console.error('Error fetching analyses', err);
    res.sendStatus(500).send('erreur');
  }
});
//__________________________________________________________________________________

//Affiche image 
router.get('/imageAnalyse/:id', async (req, res) => {
  try {
    const analyse = await Analyse.findById(req.params.id);

   

    res.status(200).json({
      image: {
        contentType: analyse.image.contentType,
        data: analyse.image.data.toString('base64')
      },
    });
  } catch (err) {
    console.error('Error fetching image:', err);
    res.sendStatus(500);
  }
});

//__________________________________________________________________________________
//Affiche les images d'analyse
router.get('/imagesAnalyse/:id', async (req, res) => {
  try {
    const analyse = await Analyse.findById(req.params.id);
    const images = analyse.images; // Supposons que les images soient stockées dans un tableau appelé "images"

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

//____________________________________________________________________________________
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
//__________________________________________________________________________________
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
  