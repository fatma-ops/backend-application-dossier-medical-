const express = require("express");
const router = express.Router();
const { createNewUser , authenticateUser} = require("./controller");
const {sendVerificationOTPEmail} = require('./../email_verification/controller');
const User = require('./model')
const mongoose = require('mongoose');

//Signin
router.post("/" , async (req,res) => {
try {
   let{ email , password } = req.body;
   email = email.trim();
   password = password.trim();

   if(!( email && password)){
      throw Error("Aucune information de connexion fournie");
   }

   const authenticatedUser = await authenticateUser
   ({email , password});
   res.status(200).json(authenticatedUser);
} catch ( error) {
   res.status(400).send(error.message);
}
});




//Signup
router.post("/signup", async (req,res) => {
    try{
     let{prenom ,nom, email ,groupeSanguin,allergie, password} = req.body;
     prenom = prenom.trim();
     nom = nom.trim();
     email = email.trim();
     groupeSanguin = groupeSanguin.trim();
     allergie = allergie.trim();
     password= password.trim();
     if(!(prenom && nom && email && password && groupeSanguin && allergie )){
        throw Error("Champs de saisie vides. !");
     } else if(!/^[a-zA-Z]*$/.test(prenom)){
        throw Error ("Prénom invalide");
     }else if(!/^[a-zA-Z]*$/.test(nom)){
      throw Error ("Nom invalide");
     }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        throw Error ("Adresse e-mail invalide");
     }else if(!/^[a-zA-Z][+-].*$/.test(groupeSanguin)){
      throw Error ("groupeSanguin invalide");
    }else if(!/^[a-zA-Z]*$/.test(allergie)){
      throw Error ("allergie invalide");
      } else if(password.length<8){
      throw Error("Le mot de passe est trop court !");
     }
     
     
     else{
        const newUser = await createNewUser({
         prenom ,
         nom,
         email,
         groupeSanguin,
         allergie,
         password,
         
        });
        await sendVerificationOTPEmail(email);
        res.status(200).json(newUser); 
     }
    }catch (error) {
      let errorMessage;
      switch(error.message) {
        case 'Champs de saisie vides. !':
          errorMessage = 'Veuillez remplir tous les champs.';
          break;
        case 'Prénom invalide':
          errorMessage = 'Le prénom est invalide.';
          break;
        case 'Nom invalide':
          errorMessage = 'Le nom est invalide.';
          break;
        case 'Adresse e-mail invalide':
          errorMessage = 'L\'adresse e-mail est invalide.';
          break;
          case 'groupeSanguin invalide':
          errorMessage = 'Groupe sanguin invalide';
          break;
          case 'allergie invalide':
            errorMessage = 'allergie invalide';
            break;
        case 'Le mot de passe est trop court !':
          errorMessage = 'Le mot de passe doit contenir au moins 8 caractères.';
          break;
          case 'L\'utilisateur avec l\'e-mail fourni existe déjà.':
          errorMessage = 'L\'utilisateur avec l\'e-mail fourni existe déjà.';
          break;
        default:
          errorMessage = 'Une erreur s\'est produite, veuillez réessayer.';
      }
      res.status(400).send({error:errorMessage}); 
    }
});
//update profile
router.put('/:email', async (req, res) => {
  try {
    const userId = req.params.email;
    const updateData = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        allergie: req.body.allergie,
        groupeSanguin: req.body.groupeSanguin,
    }
    const updatedUser = await User.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userId) }, updateData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});







module.exports = router;