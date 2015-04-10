//Chargement des modules externes
var express = require('express');
var logger = require('morgan')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');

//Chargement des modules internes
var db = require('./configs/mongodb.js');
var MailListener = require("mail-listener2");
require('./configs/passport')(passport);

//Création d'une application express
var app = express();

var server = require('http').createServer(app);

var socketio = require('socket.io')(server);

//Définition du port d'écoute
var port = process.env.PORT || 8080;

//Connection à mongodb
mongoose.connect(db.dburi);

//Configuration d'express
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({secret: 'azerty', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/app/views/'));
app.use(express.static(path.join(__dirname, 'public')));


//Chargement des routes
require('./app/routes/index.route')(app, passport);
require('./app/routes/auth.route')(app, passport);
require('./app/routes/api.route')(app, passport);

//Configuration de mailistener
var mailListener = new MailListener({
  username: "votre_adresse_gmail",
  password: "votre_mot_de_passe_gmail",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX",
  searchFilter: "UNSEEN", 
  markSeen: true,
  fetchUnreadOnStart: true, 
  mailParserOptions: {streamAttachments: true} 
});

mailListener.start(); 

mailListener.on("server:connected", function(){
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});

mailListener.on("error", function(err){
  console.log(err);
});

mailListener.on("mail", function(mail){
 socketio.emit("receive email", mail);
});

//Démarrage de l'application sur le port définit
server.listen(port);
console.log('Démarrage de l\'application sur le port ' + port);