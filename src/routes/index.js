const express = require("express");
const router = express.Router();

const userRoutes = require("./../domains/user");
const OTPRoutes = require("./../domains/otp");
const EmailVerificationRoutes = require ("./../domains/email_verification");
const ForgetPasswordRoutes = require("./../domains/forget_password");
const AnalyseRoutes = require("./../domains/analyse");
const ImageRoutes = require("./../domains/images");
const VaccinRoutes = require("./../domains/vaccin");
const MedecinRoutes = require("./../domains/medecin");
const ConsultationRoutes = require("./../domains/consultation");
const TraitementRoutes = require("./../domains/traitement");
const RappelRoutes = require("./../domains/rappel");



router.use("/user" , userRoutes);
router.use("/otp",OTPRoutes);
router.use("/email_verification" , EmailVerificationRoutes);
router.use("/forget_Password" , ForgetPasswordRoutes);
router.use("/analyse",AnalyseRoutes);
router.use("/image",ImageRoutes);
router.use("/vaccin",VaccinRoutes);
router.use("/medecin",MedecinRoutes);
router.use("/consultation",ConsultationRoutes);
router.use("/traitement",TraitementRoutes);
router.use("/rappel", RappelRoutes);


module.exports = router ; 