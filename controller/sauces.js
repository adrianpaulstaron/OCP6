const Sauce = require('../models/Sauce');
const jwt = require('jsonwebtoken');


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

    // res.status(200).json("route post /sauces")
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
    const id = parseInt(req.params.id)
    console.log("on put la sauce " + id)
    console.log("le corps de la requête est " + req.body)
    // let sauce = sauces.find(sauce => sauce.id === id)
    res.status(200).json("route put /sauces/:id")
}

exports.deletesauce = (req, res, next) => {
    const id = parseInt(req.params.id)
    console.log("j'efface la sauce " + id)
    res.status(200).json("route delete " + id)
}

exports.likesauce = (req, res, next) => {
    const id = parseInt(req.params.id)
    console.log("toggle like " + id)
}