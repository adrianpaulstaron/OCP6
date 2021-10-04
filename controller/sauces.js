const Sauce = require('../models/Sauce');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.addsauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    var name = sauceObject.name
    var manufacturer = sauceObject.manufacturer
    var description = sauceObject.description
    var mainPepper = sauceObject.mainPepper
    var heat = sauceObject.heat
    var userId = sauceObject.userId
    var imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    const sauce = new Sauce({
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        heat: heat,
        userId: userId,
        imageUrl: imageUrl,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        userDisliked: []
    });
    console.log("la sauce:" + sauce)
    sauce.save()
     .then(() => res.status(201).json({ message: 'Sauce créée'}))
     .catch(error => res.status(400).json({error}));
};

exports.getsauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getsauce = (req, res, next) => {
    const id = parseInt(req.params.id)
    console.log("la sauce " + id)
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.updatesauce = (req, res, next) => {
    const sauceObject = req.file ?
        { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
        .catch(error => res.status(400).json({error}));
}

exports.deletesauce = (req, res, next) => {
    Sauce.findOne( { _id: req.params.id})
    .then(sauce => { 
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée'}))
            .catch(error => res.status(400).json({ error }))
        })
    })
    .catch(error => res.status(500).json({ error }));
}

exports.likesauce = (req, res, next) => {
    const id = parseInt(req.params.id)
    console.log("toggle like " + id)
}