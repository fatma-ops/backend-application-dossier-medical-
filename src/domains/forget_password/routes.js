const express = require("express");
const router = express.Router();
const {sendPasswordRestOTPEmail , restUserPassword} = require("./controller");
const User = require('../user/model')
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// Password rest request 
router.post("/rest",async(req , res) => {
try {
let{email , otp , newPassword} = req.body;
if(!(email && otp && newPassword)){
  throw Error("Les informations d’identification vides ne sont pas autorisées");
}
await restUserPassword({email , otp, newPassword});
res.status(200).json({email , passwordrest:true});
}catch(error){
res.status(400).send(error.message);
}


});

router.post("/" ,async(req , res) => {
    try{
   const {email} = req.body;
   if(!email) throw Error("Adresse email est invalide");
     const createdPasswordRestOTP = await sendPasswordRestOTPEmail(email);
     res.status(200).json(createdPasswordRestOTP);
    }catch(error){
       res.status(400).send(error.message);
    }
});


// Password change request
router.post("/change", async (req, res) => {
  try {
    let {email, password, newPassword} = req.body;
    if (!(email && password && newPassword)) {
      throw Error("Les informations d’identification vides ne sont pas autorisées");
    }
    // Vérifiez que l'utilisateur a entré le bon mot de passe actuel avant de changer le mot de passe
    const isUserValid = await checkUserCredentials(email, password);
    if (!isUserValid) {
      throw Error("Le mot de passe actuel est incorrect");
    }
    // Mettre à jour le mot de passe
    await updateUserPassword(email, newPassword);
    res.status(200).json({email, passwordChanged: true});
  } catch(error) {
    res.status(400).send(error.message);
  }
});

// Fonction pour vérifier les informations d'identification de l'utilisateur
async function checkUserCredentials(email, password) {
  // Vérifiez les informations d'identification de l'utilisateur dans la base de données
  const user = await User.findOne({email});
  if (!user) {
    return false;
  }
  // Vérifiez que le mot de passe est correct
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return false;
  }
  return true;
}

// Fonction pour mettre à jour le mot de passe de l'utilisateur
async function updateUserPassword(email, newPassword) {
  // Mettez à jour le mot de passe dans la base de données
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds=10);
  await User.updateOne({email}, {password: hashedPassword});
}
module.exports = router ;