// connexion bdd avec then catch pour signaler les erreurs ou le succès
// headers de toutes les requêtes
// app.js > gère les routes de base
// server.js > lance le serveur

const express = require('express')
const app = express()
const path = require ('path');

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')

// on gère le problème de cors (le front et le back tournent sur la même machine)
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:8081'
}));


// Middleware
app.use(express.json())

const mongoose = require('mongoose');
main().catch(err => console.log(err));
// on connecte mongoose à la bonne bdd
async function main() {
  await mongoose.connect('mongodb://localhost:27017/saucesdb');
}

app.use('/images', express.static(path.join(__dirname, 'images')));

// const userCtrl = require('./controller/user');

// app.post('/api/auth/signup', userCtrl.signup)
// app.post('/api/auth/login', userCtrl.login)


// var crypto = require('crypto');

// // on déclare un schéma pour les users
// const userSchema = new mongoose.Schema({
//     email: String,
//     password: String
// });

// // on déclare un modèle pour les users
// const User = mongoose.model('users', userSchema);



// app.post('/api/auth/signup', async (req,res) => {
//     console.log("route signup")
//     res.status(200).json("route post signup")
//     console.log(JSON.stringify(req.body))
//     // on hache le mot de passe récupéré du front
//     const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('base64');
//     // on crée une variable newUser contenant l'email et le mot de passe haché
//     const newUser = new User(
//         { 
//             email: req.body.email, 
//             password: hashedPassword,
//         });
//     // on save le newUser
//     await newUser.save();
//     console.log("on a passé le save")
// })

// app.post('/api/auth/login', (req,res) => {
//     console.log("route login")
//     let requestEmail = req.body.email
//     let requestPassword = req.body.password
//     let hashedRequestPassword = crypto.createHash('sha256').update(requestPassword).digest('base64');

//     // on cherche chaque user avec un email correspondant à la requête, en sélectionnant les champs email et password
//     User.findOne({ 'email': requestEmail }, 'email password', function (err, user) {
//         if (err) return handleError(err);
//         console.log(user.email + " a pour mot de passe " + user.password)
//         // on compare le mot de passe récupéré avec le mot de passe envoyé haché
//         if(user.password === hashedRequestPassword){
//             res.status(200).json("connexion réussie")
//         }else{
//             res.status(403).json("mot de passe ou utilisateur invalide")
//         }
//     });
// })

app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', userRoutes)

app.listen(3000, () => {
    console.log("Serveur à l'écoute")
})