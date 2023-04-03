const User = require("./../user/model");
const {sendOTP , verifyOTP , deleteOTP} = require("./../otp/controller");
const{hashData} = require("./../../util/hashData");


const restUserPassword = async ({email , otp , newPassword}) => {
    try{
    const validOTP = await verifyOTP({email , otp});
    if(!validOTP){
        throw Error("Code incorrecte Vérifiez votre boîte de réception");

    }
    // now update user record with new password.
    if(newPassword.length < 8){
        throw Error("Le mot de passe est trop court");
    }
    const hashedNewPassword = await hashData(newPassword);
    await User.updateOne({email} , {password:hashedNewPassword});
    await deleteOTP(email);
    return ;
    }catch(error){
     throw error ;
    }
}



const sendPasswordRestOTPEmail = async(email)=>{
    try{
// check if an account exists
   const existingUser = await User.findOne({email});
   if(!existingUser){
   throw Error("Il n’y a pas de compte pour l’e-mail fourni");
   }
   
   if(!existingUser.verified){
    throw Error("L’e-mail n’a pas encore été vérifié. Vérifiez votre boîte de réception");
   }

   const otpDetails = {
    email , 
    subject:"Réinitialiser votre mot de passe",
    message:"Entrez le code ci-dessous pour réinitialiser votre mot de passe.",
    duration:1,

   };
   const createdOTP = await sendOTP(otpDetails);
   return createdOTP;

    }catch(error){
     throw error ;
    }
};
module.exports = {sendPasswordRestOTPEmail , restUserPassword};