const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    // lors d'une inscription, on commence par hacher le password envoyé dans le corps de la requête par le front, à l'aide de bcrypt
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // on crée un nouvel User à partir de notre modèle, avec en email l'email envoyé dans le corps de la requête, et en password notre password haché
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // on sauvegarde cet utilisateur en base
        user.save()
         .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
         .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};
exports.login = (req, res, next) => {
    // pour le login, on va chercher l'user à partir de l'email envoyé dans le corps de la requête
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user) {
            // s'il n'est pas trouvé, on renvoie une erreur adaptée
            return res.status(401).json({ error: 'Utilisateur non trouvé'});
        }
        // sinon, on utilise bcrypt pour comparer les mots de passe hachés respectivement entré par l'utilisateur et stocké en base
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // si le mot de passe est mauvais, on renvoie une erreur adaptée
            if(!valid) {
                return res.status(401).json({ error: 'Mot de passe erroné'});
            }
            res.status(200).json({
                // si le mot de passe est bon, on envoie un token d'identification au client grâce à jsonwebtoken, dans lequel on met l'user id
                userId: user._id,
                token: jwt.sign(
                    // le token contient l'user id, la clef (chaîne de caractères), et la durée avant expiration du token
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};