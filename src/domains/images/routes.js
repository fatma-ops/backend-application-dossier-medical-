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
        userId:req.body.userId,
        
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

  module.exports = router;
  
  
  
  
  
  