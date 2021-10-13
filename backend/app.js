require('dotenv').config()
const express = require('express')
const app = express()
const path = require ('path');

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')
const helmet = require("helmet");

// helmet est un package aidant à la sécurisation de notre appli
app.use(helmet());
// app.use(helmet.contentSecurityPolicy());
// app.use(helmet.dnsPrefetchControl());
// app.use(helmet.expectCt());
// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.hsts());
// app.use(helmet.ieNoOpen());
// app.use(helmet.noSniff());
// app.use(helmet.permittedCrossDomainPolicies());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());


// le front et le back tournent sur la même machine, on avait donc une erreur car il s'agit d'une violation des règles de sécurité de cors
// on autorise donc l'url sur laquelle on fait tourner le front, pour le développement
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:8081'
}));

var RateLimit = require('express-rate-limit');
// app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 
var limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 200, // limiter chaque IP à 100 requêtes par le paramètre d'au-dessus 
  delayMs: 0 // pas de delaying
});
//  appliquer à toutes les requêtes 
app.use(limiter);

// Middleware
app.use(express.json())

const mongoose = require('mongoose');
main().catch(err => console.log(err));
// on connecte mongoose à la bonne bdd
async function main() {
  await mongoose.connect(process.env.DB_CONNECT_URI);
}

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', userRoutes)

module.exports = app; 