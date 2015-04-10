WebMail-JS est un mini webmail fait entièrement avec les technologies MEAN js.
L'application va nous permettre de s'authentifier avec notre compte google +, de récupérer tous nos contacts, d'envoyer des mails et de recevoir les nouveaux mails en temp réel. 
Pour installer et utiliser WebMail-JS suivez les instructions si-après :


1-) Clonner le repository
	git clone https://github.com/brahbassim/WebMail-JS.git

2-) Télécharger toutes les dependances, pour cela lancez la commandes :
	npm install

3-)Créer un nouveau projet dans la console de google developers https://console.developers.google.com/, pour l'authentification avec google + et créer un nouveau client ID avec les informations suivantes : 
	-Redirect URIs : http://127.0.0.1:8080/auth/google/callback
	-Javascript Origins : http://127.0.0.1:8080
N'oublier pas d'activer l'API de google + dans la console de google developers.

4-)Configuration de WebMail-JS:
	-Remplacer informations de WebMail-JS->configs->socialAuth.js par les votres.
	-Remplacer dans WebMail-JS->app->routes->api.route.js :
	```
		var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: 'votre_adresse_gmail',
		    pass: 'votre_mot_de_passe_gmail'
		  }
		});
		```
	-Remplacer dans WebMail-JS->server.js : 
	```
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
		```

5-)Démarrer WebMail-JS : 
node server.js

