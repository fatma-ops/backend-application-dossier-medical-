const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
prenom:String ,
nom:String,
email:{ type:String , unique:true},
groupeSanguin:String,
allergie:String,
password : String , 
token: String,
verified : {type : Boolean , default : false},
});

const User = mongoose.model("User", UserSchema);
module.exports = User ;