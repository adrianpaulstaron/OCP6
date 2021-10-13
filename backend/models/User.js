const mongoose = require ('mongoose')
// ce plugin sert à remonter des erreurs claires de la bdd en cas de violation d'une règle d'unicité, on l'applique donc à l'email.
const uniqueValidator = require('mongoose-unique-validator');

// on déclare un schéma pour les users
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);