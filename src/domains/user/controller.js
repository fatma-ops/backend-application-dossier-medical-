const User = require("./model");
const  { hashData , verifyHashedData } = require("./../../util/hashData");
const createToken = require ("./../../util/createToken");


const authenticateUser = async (data) => {
try {
const { email , password } = data ;
const fetchedUser = await User.findOne({email});

if(!fetchedUser) {
   throw Error ("identifiants invalides")
}
if(!fetchedUser.verified){
   throw Error ("Votre adresse e-mail n'a pas encore été vérifiée. Vérifiez votre boîte de réception.");
}

const hashedPassword = fetchedUser.password ;
const passwordMatch = await verifyHashedData(password , hashedPassword);

if(!passwordMatch){
   throw Error("Mot de passe invalide!");

}

// create user token 
const tokenData = { userId : fetchedUser._id , email};
const token = await createToken(tokenData);

// assign user token
fetchedUser.token = token ;
return fetchedUser;

}catch (error){
 throw error;
}

};

const createNewUser = async (data) => {
    try{
     const {prenom ,nom, email ,groupeSanguin,allergie ,password } = data ;
     const existingUser = await User.findOne({ email });
     if(existingUser){
        throw Error("L'utilisateur avec l'e-mail fourni existe déjà.");

     }
     //hash password 
     const hashedPassword = await hashData(password);
     const newUser = new User({
        prenom,
        nom,
        email,
        groupeSanguin,
        allergie,
        password: hashedPassword, 
     });
     // save user 
     const createdUser = await newUser.save();
      return createdUser;

    }catch(error){
       throw error ;
    }
};

module.exports = { createNewUser , authenticateUser}