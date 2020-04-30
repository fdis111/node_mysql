const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');

//Configuration de la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'kda_test',
  password: 'root',
});

//Connexion à la base de données
connection.connect((erreur) => {
  if (erreur) {
    throw erreur;
  }
  console.log('La connexion à la base de données est établie');
});

//Initialisation du serveur express
const server = express();

//Dire à express de mettre les données venants du formulaire dans BODY
server.use(express.urlencoded({ extended: false }));

//Dire à express où aller trouver les vues(Nos pages web que le user sait voir)
server.set('views');

//Dire à express d'utiliser EJS comme moteur de template
server.set('view engine', 'ejs');

server.get('/apprenants', (req, res) => {
  connection.query('select * from student', (erreur, resultat) => {
    if (erreur) throw erreur;
    return res.render('apprenants/index', { apprenants: resultat });
  });
});

server.post('/apprenants', (req, res) => {
  console.log('BB');
  connection.query(
    `insert into student(nom,prenom) values('${req.body.nom}','${req.body.prenom}')`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.redirect('/apprenants');
    }
  );
});

server.get('/apprenants/new', (req, res) => {
  return res.render('apprenants/new');
});

server.get('/apprenants/:id', (req, res) => {
  connection.query(
    `select * from student where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.render('apprenants/show', { apprenant: resultat[0] });
    }
  );
});


server.get("/apprenants/del/:id", (req, res) => {
  connection.query(`delete from student where id = ${req.params.id}`, (err, result) => {
    if (err) throw err;
    return res.redirect("/apprenants") 
  })
})

server.get("/apprenants/mod/:id", (req, res) => {
  connection.query(
    `select * from student where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.render('apprenants/update', { apprenant: resultat[0] });
    }
  );
})

server.post("/apprenants/mod/:id", (req, res) => {
  connection.query(
    ` update student set nom = "${req.body.nom}", prenom = "${req.body.prenom}" where id=${req.params.id}`,
    (erreur, resultat) => {
      if (erreur) throw erreur;
      return res.redirect('/apprenants');
    }
  );
})


//Définition du port
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Le serveur écoute sur le port ${PORT}`);
});