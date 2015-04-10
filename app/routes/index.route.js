module.exports = function(app, passport) {

	//Renvoie la page index
	app.get('/', function(req, res) {
		res.render('index');
	});

};