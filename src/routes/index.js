const express = require("express");
const router = express.Router();

const userRoutes = require("./../domains/user");
const OTPRoutes = require("./../domains/otp");
const EmailVerificationRoutes = require ("./../domains/email_verification");
const ForgetPasswordRoutes = require("./../domains/forget_password");
const AnalyseRoutes = require("./../domains/analyse");
const ImageRoutes = require("./../domains/images");
const VaccinRoutes = require("./../domains/vaccin");




router.use("/user" , userRoutes);
router.use("/otp",OTPRoutes);
router.use("/email_verification" , EmailVerificationRoutes);
router.use("/forget_Password" , ForgetPasswordRoutes);
router.use("/analyse",AnalyseRoutes);
router.use("/image",ImageRoutes);
router.use("/vaccin",VaccinRoutes);


module.exports = router ; 