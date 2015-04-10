//Chargemenet des modules externes
var mongoose = require('mongoose');

//Création du schema mongoose de user
var userSchema = mongoose.Schema({
	google : {
    id    : String,
    token : String,
    email : String,
    name  : String
  }

});

//Crée et exporte le model User
module.exports = mongoose.model('User', userSchema);

