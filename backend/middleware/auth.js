const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // on récupère le token dans le header authorization
        // on split sur un espace car on va récupérer "Bearer <le token>" et on récupère donc le deuxième élément du tableau récupéré
        const token = req.headers.authorization.split(' ')[1];
        // on veut vérifier le token ayant pour clef secrète 'RANDOM_TOKEN_SECRET'
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // on récupère le user id de notre token
        const userId = decodedToken.userId;
        // on vérifie si l'user id de notre requête existe et s'il est différent de celui qu'on vient d'extraire: si c'est le cas on renvoie une erreur adaptée
        if (req.body.userId && req.body.userId !== userId){
            throw 'User ID non valable';
        // sinon on appelle tout simplement next (le prochain middleware)
        } else {
            next();
        }
    } catch (error) {
        // si la requête n'est pas authentifié, on envoie une erreur adaptée
        res.status(401).json({ error: error | 'Requête non authentifiée !'})
    }
};