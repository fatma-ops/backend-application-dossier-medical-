const express = require('express');
const router = express.Router();
const Analyse = require('./model')
const mongoose = require('mongoose');
const multer = require('multer');


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


// add Analyse
router.post('/add' , (req , res) => {
  upload(req , res , (err) => {
    if(err){
      console.log(err , 'it has an error')
    }else {
      try {
        const { userEmail } = req.body;

      const newAnalyse = new Analyse ({
        title:req.body.title,
        date:req.body.date,
        image:{
          data:req.file.filename,
          contentType:'image/png'
        },
        userEmail:userEmail,
        
      })

      newAnalyse.save();
      res.status(201).json(newAnalyse);
    }catch (err) {
        console.error(err);
        res.status(500).send('an error happend ');
      }


    }
  })
});

//read analyses
router.get('/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const analyses = await Analyse.find({ userEmail });
    res.json(analyses);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});


// delete an analysis by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedAnalyse = await Analyse.findByIdAndDelete(id);
    if (!deletedAnalyse) {
      return res.status(404).send('Analysis not found');
    }
    res.json(deletedAnalyse);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});

// search analyses by keyword
router.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    const regex = new RegExp(keyword, 'i');
    const analyses = await Analyse.find({
      $or: [
        { title: regex },
        { date: regex }
      ]
    });
    res.json(analyses);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});






// Update analysis
// update analyse
router.put('/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const update = {
      title: req.body.title,
      date: req.body.date,
      image: {
        data: req.file.filename,
        contentType: 'image/png'
      },
      userEmail: req.body.userEmail
    };
    const options = { new: true }; // Return the updated document
    const updatedAnalyse = await Analyse.findOneAndUpdate({ _id: id }, update, options);
    if (!updatedAnalyse) {
      res.status(404).send(`Analyse with ID ${id} not found`);
      return;
    }
    res.json(updatedAnalyse);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
});
  module.exports = router;
  