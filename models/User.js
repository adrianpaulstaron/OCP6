const mongoose = require ('mongoose')
// const uniqueValidator = require('mongoose-unique-validator');

// on déclare un schéma pour les users
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true } 
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);