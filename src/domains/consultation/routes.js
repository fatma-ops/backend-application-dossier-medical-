const express = require('express');
const router = express.Router();
const multer = require('multer');

const Consultation = require('./model');

const path = require('path');

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

// Serveur d'images
router.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);
  res.sendFile(imagePath);
});


// add Consultation
router.post('/add' , (req , res) => {
    upload(req , res , (err) => {
      if(err){
        console.log(err , 'Erreur')
      }else {
        try {
          const { userEmail } = req.body;
  
        const newConsultation = new Consultation ({
          type:req.body.type,
          date:req.body.date,
          contact:req.body.contact,

           ordonnace:{
            data:req.file.filename,
            contentType:'image/png'
          },
          idTraitement:req.body.idTraitement,
          userEmail:req.body.userEmail,
          
        })
  
        newConsultation.save();
        res.status(201).json(newConsultation);
      }catch (err) {
          console.error(err);
          res.status(500).send('Erreur , essaye ');
        }
  
  
      }
    })
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

  // update consultation
router.put('/put/:id', uploadPut, async (req, res) => {
    const id = req.params.id;
  
    try {
      // Find the consultation to update by ID
      const consultation = await Consultation.findById(id);
  
      if (!consultation) {
        return res.status(404).send('consultation introuvable');
      }
  
      // Update the consultation data with the new file information
      consultation.type = req.body.type;
      consultation.date = req.body.date;
      consultation.contact = req.body.contact;

      consultation.userEmail = req.body.userEmail;
      consultation.idTraitement = req.body.idTraitement;

      consultation.ordonnace.data = req.file.filename;
  
      // Save the updated consultation to the database
      const updatedConsulation = await consultation.save();
  
      // Send the consultation image data back to the client
      res.status(200).json(updatedConsulation);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la mise à jour de la consultation');
    }
  });
  
  


  module.exports = router;
