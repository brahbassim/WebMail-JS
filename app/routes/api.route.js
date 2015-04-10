//Chargemenet des modules externes
var request = require('request');
var nodemailer = require('nodemailer');

//Configuration de nodemailer
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'votre_adresse_gmail',
    pass: 'votre_mot_de_passe_gmail'
  }
});

module.exports = function(app, passport) {

	//Récupère tous les contacts
	app.get('/api/contacts', isAuth, function(req, res) {
		request('https://www.google.com/m8/feeds/contacts/default/full?alt=json&oauth_token='+req.user.google.token, function (error, response, body) {
	    if (!error) {
	    	//Liste des contacts 
	  		var contactList = [];
	  		//console.log(body);
	      var feed = JSON.parse(body);
	      var contacts = feed.feed.entry;
	      contacts.forEach(function (element) {
	        var newContact = {
	          name: element.title["$t"],
	          email: element["gd$email"][0].address
	        };
	        contactList.push(newContact); 
	      });
	      res.json(contactList);
	    }
	  });
	});

	//Envoie un mail
	app.post('/api/semail', isAuth, function(req, res) {
		transporter.sendMail({
	    from: req.user.google.email,
	    to: req.body.to,
	    subject: req.body.subject,
	    text: req.body.message
		});
		res.json({email: 'Bien envoyé!'});
	});

};

//Middleware pour virifer si l'utilisateur est authentifié
function isAuth(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}