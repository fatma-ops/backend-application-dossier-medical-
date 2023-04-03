const User = require("./../user/model");
const {sendOTP, verifyOTP , deleteOTP} = require("./../otp/controller");

const verifyUserEmail = async ({email , otp}) => {
    try{
    const ValidOTP = await verifyOTP({email , otp});
    if(!ValidOTP){
        throw Error ("Code invalide, vérifiez votre boîte de réception");
    }
    // now update user record to show verified 
   await User.updateOne({email} , {verified : true});


    await deleteOTP(email);
    return ;
    }catch(error){
     throw error ;
    }
}





const sendVerificationOTPEmail = async (email) => {
try{
    // check if an account exists
    const existingUser = await User.findOne({email});
    if(!existingUser){
        throw Error("Il n'y a pas de compte associé à l'adresse e-mail fournie.");
    }
    const otpDetails = {
     email ,
     subject:"Vérification d'email",
     message:"Vérifiez votre adresse e-mail avec le code ci-dessous.",
     duration: 1,

    };
const createdOTP = await sendOTP(otpDetails);
return createdOTP;


}catch(error){
throw error ;
}
};

module.exports = { sendVerificationOTPEmail , verifyUserEmail };

