const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require('./model');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' }); // Destination folder to save the photos

router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const newImage = new Image({
      photo: {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype
      },
      userEmail: req.body.userEmail
    });

    await newImage.save();

    res.status(200).json(newImage);
  } catch (err) {
    console.error('Error uploading image:', err);
    res.sendStatus(500);
  }
});

router.get('/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).send('Image not found');
    }

    res.status(200).json({
      photo: {
        contentType: image.image.contentType,
        data: image.image.data.toString('base64')
      },
      userEmail: image.userEmail
    });
  } catch (err) {
    console.error('Error fetching image:', err);
    res.sendStatus(500);
  }
});


router.get('/images/user/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;

    const images = await Image.find({ userEmail: userEmail });

    if (images.length === 0) {
      return res.status(404).send('No images found for the provided userEmail');
    }

    res.status(200).json(images);
  } catch (err) {
    console.error('Error fetching images:', err);
    res.sendStatus(500);
  }
});






module.exports = router;

  
  
  
  
  
  