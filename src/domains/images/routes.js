const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('./model');

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

// Route pour télécharger une image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { filename, path } = req.file;
    const { name, date } = req.body;
    const newImage = new Image({
      name,
      date,
      image: path,
    });
    await newImage.save();
    res.send('Image téléchargée avec succès');
  } catch (error) {
    console.error(error);
    res.status(500).send('Une erreur est survenue lors du téléchargement de l\'image.');
  }
});

router.get('/image/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(404).end();
    }
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(data);
  });
});

module.exports = router;
  
  
  
  
  
  