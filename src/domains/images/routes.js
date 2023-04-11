const express = require('express');
const router = express.Router();
const multer = require('multer');
const Image = require("./model")


//storage 
const Storage = multer.diskStorage({
  destination:'uploads',
  filename:(req,file,cb)=>{
    cb(null , file.originalname);
  }
});
const upload = multer({
  storage:Storage
}).single('testimage');

// Upload middleware for PUT request
const uploadPut = multer({
  storage: Storage
}).single('testimage');

router.post('/upload' , (req , res) => {
  upload(req , res , (err) => {
    if(err){
      console.log(err , 'it has an error')
    }else {
      try {
      const newImage = new Image ({
        name:req.body.name,
        date:req.body.date,
        image:{
          data:req.file.filename,
          contentType:'image/png'
        },
        
      })

      newImage.save();
      res.status(201).json(newImage);
    }catch (err) {
        console.error(err);
        res.status(500).send('an error happend ');
      }


    }
  })
})


router.put('/put/:id', uploadPut, async (req, res) => {
  const id = req.params.id;

  try {
    // Find the image to update by ID
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).send('Image not found');
    }

    // Update the image data with the new file information
    image.name = req.body.name;
    image.date = req.body.date;
    image.image.data = req.file.filename;

    // Save the updated image to the database
    const updatedImage = await image.save();

    // Send the updated image data back to the client
    res.status(200).json(updatedImage);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating image');
  }
});

router.get('/search', async (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the request query parameters
  try {
    const image = await Image.findOne({ $or: [ { name: searchQuery }, { date: searchQuery } ] }); // Search for the image in the database using the name or date
    if (image) {
      res.status(200).json(image); // Return the image data if found
    } else {
      res.status(404).send('Image not found'); // Return a 404 error if the image is not found
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error searching for image'); // Return a 500 error if an error occurs while searching for the image
  }
});



  module.exports = router;
  
  
  
  
  
  