const passwordValidator = require('password-validator');

// Schéma de mot de passe plus sécure
const passwordSchema = new passwordValidator();

// Contraintes du mot de passe
passwordSchema
// longueur mini 8
.is().min(8)
// a une majuscule
.has().uppercase()
// a une minuscule
.has().lowercase()
// a un chiffre
.has().digits()
// n'a pas d'espace
.has().not().spaces()
// mdps exclus
.is().not().oneOf(['Password123', 'Azerty123']);

module.exports = passwordSchema;
