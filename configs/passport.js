//Chargement des modules externes
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//Chargement des modules internes
var User = require('../app/models/user.model');
var GoogleAuth = require('./socialAuth');



module.exports = function(passport) {

	//Configuration de passport pour les session d'authentifications 
	//Sérialisation
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	//Déserialisation
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

  //Login avec la strategie google
  passport.use('google',new GoogleStrategy({
    clientID: GoogleAuth.googleAuth.clientID,
    clientSecret: GoogleAuth.googleAuth.clientSecret,
    callbackURL: GoogleAuth.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      User.findOne({'google.id': profile.id}, function(err, user){
        if(err)
          return done(err);
        if(user){
          //Renvoie l'utilisateur connecté
          return done(null, user);
        }
        else {
          //Crée un nouvel utilisateur
          var newUser = new User();
          newUser.google.id = profile.id;
          newUser.google.token = accessToken;
          newUser.google.name = profile.displayName;
          newUser.google.email = profile.emails[0].value;          
          newUser.save(function(err){
            if(err)
              throw err;
            //Renvoie le nouvel utilisateur créé et connecté
            return done(null, newUser);
          });
        }
      });
    });
  }
  ));

};