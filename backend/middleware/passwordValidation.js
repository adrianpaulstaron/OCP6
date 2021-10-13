const passwordSchema = require('../models/password');

// vérifie que le mot de passe valide le schema décrit
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'le mot de passe doit faire minimum 8 caractères, contenir au moins une lettre et un chiffre, une majuscule, une minuscule et ne doit pas contenir un espace'})
    } else {
        next();
    }
};