const OTP = require("./model");
const generateOTP = require("./../../util/generateOTP");
const sendEmail = require ("./../../util/sendEmail");
const { hashData , verifyHashedData} = require("./../../util/hashData");
const {AUTH_EMAIL} = process.env;
const verifyOTP = async ({email , otp}) => {
    try{
     if(!(email && otp)){
        throw error ("Fournir des valeurs pour les e-mails , otp");
     }
     // ensure otp record exists
     const matchedOTPRecord = await OTP.findOne({
        email ,
     });
     if(!matchedOTPRecord){
        throw Error("Aucun enregistrement OTP trouvé.");
     }
     const {expiresAt} = matchedOTPRecord;

     //checking for expired code
     if(expiresAt < Date.now()){
        await OTP.deleteOne({email});
        throw Error("Le code a attendu Demande pour un nouveau");
     }
     // not expired yet verify value
     const  hashedOTP = matchedOTPRecord.otp;
     const validOTP = await verifyHashedData(otp,hashedOTP);
     return validOTP;

    }catch(error){

    }
};


const sendOTP = async ({email , subject , message , duration = 1}) => {
try {
if(!(email && subject && message)){
    throw Error("Fournir des valeurs pour les e-mails , subject , message");

}
// clear any old record 
await OTP.deleteOne({ email });

// generate pin

const generatedOTP = await generateOTP();

//send email

const mailOptions = {
from: AUTH_EMAIL,
to: email ,
subject , 
html:`<p> ${message}</p> <p style ="color:tomato ; font-size:25px;letter-spacing:2px ;"><b>
    ${generatedOTP}</b></p><p> Ce code  <b> expire dans ${duration} heure(s)</b>.</p>`,
};
await sendEmail(mailOptions);

// save otp record

const hashedOTP = await hashData(generatedOTP);
const newOTP = await new OTP ({
    email ,
    otp : hashedOTP , 
    createdAt : Date.now(),
    expiresAt : Date.now() + 3600000 * +duration,
});
const createdOTPRecord = await newOTP.save();
return createdOTPRecord;


}catch(error){
throw error;
}
};
const deleteOTP = async (email) =>{
    try{
    await OTP.deleteOne({email});
    }catch(error){
     throw error;
    }
}
module.exports = {sendOTP , verifyOTP, deleteOTP};