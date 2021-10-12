const mongoose = require ('mongoose');
const sauceValidator = require('../middleware/sauceValidation')


// on déclare un schéma pour les sauces
const sauceSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true, validate: sauceValidator.nameValidator },
    manufacturer: { type: String, required: true, validate: sauceValidator.manufacturerValidator },
    description: { type: String, required: true, validate: sauceValidator.descriptionValidator },
    mainPepper: { type: String, required: true, validate: sauceValidator.pepperValidator },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, required: true },
    usersDisliked: { type: Array, required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);