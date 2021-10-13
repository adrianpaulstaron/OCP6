// Pour valider les inputs lors de la création de sauce, on appelle un plugin adapté
const validate = require('mongoose-validator');

// on check chaque élément de la sauce

exports.nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [1, 50],
    message: 'Le nom de la sauce doit faire entre 2 et 50 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i,
    message: "Veuillez n'utiliser que des chiffres et des lettres pour nommer la sauce",
  }),
];

exports.manufacturerValidator = [
  validate({
    validator: 'isLength',
    arguments: [1, 50],
    message: 'Le nom du fabricant doit faire entre 2 et 50 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i, 
    message: "Veuillez n'utiliser que des chiffres et des lettres pour nommer le fabricant",
  }),
];

exports.descriptionValidator = [
  validate({
    validator: 'isLength',
    arguments: [1, 100],
    message: 'La description doit faire entre 2 et 100 caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i,
    message: "Veuillez n'utiliser que des chiffres et des lettres pour décrire la sauce",
  }),
];

exports.pepperValidator = [
  validate({
    validator: 'isLength',
    arguments: [1, 20],
    message: 'Le nom du piment doit faire entre 2 et 20 caractères',
  }),
  validate({
    validator: 'isAlphanumeric',
    message: "Veuillez n'utiliser que des chiffres et des lettres pour nommer le piment",
  }),
];
