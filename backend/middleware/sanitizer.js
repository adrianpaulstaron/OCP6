var json = require("body-parser").json;
var sanitize = require("mongo-sanitize");

// on crée un middleware pour nettoyer les requêtes envoyées par le front afin d'éviter les injections NoSQL
module.exports = (req, res, next) => {
    try{
        req.body = sanitize(req.body);
        req.params = sanitize(req.params);
        req.query = sanitize(req.query);
        next();
    }
    catch(error) {
        res.status(500).json({ error: error | 'Erreur pendant le nettoyage de la requête'})
    }
}