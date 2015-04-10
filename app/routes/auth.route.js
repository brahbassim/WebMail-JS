//Chargemenet des modules externes
var request = require('request');

module.exports = function(app, passport) {

	//Renvoie l'utilisateur sur google pour l'authentifier
	app.get('/auth/google', passport.authenticate('google', {scope: [
		'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/plus.login',
    'https://www.google.com/m8/feeds'
	]}));

	//Reponse de google oauth
	app.get('/auth/google/callback', passport.authenticate('google',
	{ 
  	successRedirect: '/home',
    failureRedirect: '/' 
	}));

	//Renvoie la page home
	app.get('/home', isAuth, function(req, res) {
		res.render('home', { user: req.user});
	});

	//Déconnecte l'utilisateur et le renvoie sur index
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

};

//Middleware pour virifer si l'utilisateur est authentifié
function isAuth(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}
