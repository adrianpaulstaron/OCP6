const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    // // avant le signup, on regarde si l'utilisateur déjà en base ou non
    const userExists = await User.exists({ mail: req.body.email });
    if(!userExists){
        // avant le signup, on pose une condition sur le mdp
        // on déclare une const qui contient notre expression régulière. Celle-ci teste qu'on a un mdp d'au moins 8 caractères, avec au moins une lettre et un chiffre
        const pwdRegex = new RegExp(`^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$`)
        const mailRegex = new RegExp(`^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$`)
        // si le password est mauvais, on envoie directement une réponse
        if(pwdRegex.test(req.body.password)){
            if(mailRegex.test(req.body.email)){
                // on hache le password envoyé dans le corps de la requête par le front, à l'aide de bcrypt
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
            }else{
                res.status(400).json({ message: 'veuillez entrer une adresse email correcte'})
            }
            
        }else{
            res.status(400).json({ message: 'le mot de passe doit faire minimum 8 caractères et contenir au moins une lettre et un chiffre'})
        }
    }else{
        res.status(400).json({ message: 'cet email est déjà utilisé'})
    }
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
                    process.env.CRYPT_KEY,
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};