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
app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', userRoutes)


app.listen(3000, () => {
    console.log("Serveur à l'écoute")
})
// .then(() => res.status(200).json({ message: 'connexion au serveur réussie'}))
// .catch(error => res.status(400).json({error}));