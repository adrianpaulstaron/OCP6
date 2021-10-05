const Sauce = require('../models/Sauce');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.addsauce = (req, res, next) => {
    // pour ajouter une sauce, on parse le corps de la requête envoyée par le front
    const sauceObject = JSON.parse(req.body.sauce)
    // on met tout en variable
    var name = sauceObject.name
    var manufacturer = sauceObject.manufacturer
    var description = sauceObject.description
    var mainPepper = sauceObject.mainPepper
    var heat = sauceObject.heat
    var userId = sauceObject.userId
    var imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // on crée une nouvelle sauce à partir de notre modèle
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
    // on sauvegarde cette sauce
    sauce.save()
     .then(() => res.status(201).json({ message: 'Sauce créée'}))
     .catch(error => res.status(400).json({error}));
};

exports.getsauces = (req, res, next) => {
    // pour obtenir les sauces en base, on fait simplement un find
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getsauce = (req, res, next) => {
    // pour obtenir une sauce en base, on fait un findOne en indiquant qu'on veut une correspondance entre l' _id et l'id qu'on a en paramètre de la requête
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.updatesauce = (req, res, next) => {
    const sauceObject = req.file ?
    // s'il y a un file, on le rajoute en imageUrl avec le reste de la sauce parsé depuis le corps de la requête
        { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        // s'il n'y a pas de file, on ne prend que le corps de la requête pour mettre à jour la sauce
        } : { ...req.body };
        // on pointe vers la bonne sauce en bdd, puis on la met à jour avec la sauce de la requête
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
        .catch(error => res.status(400).json({error}));
}

exports.deletesauce = (req, res, next) => {
    Sauce.findOne( { _id: req.params.id})
    .then(sauce => { 
        // pour supprimer une sauce, on veut aussi supprimer son image, on prend donc l'url de l'image stocké en base que l'on split sur le dossier /images/. On obtient donc un tableau dont l'index 0 est le chemin moins /images/, et l'index 1 est le nom de l'image
        const filename = sauce.imageUrl.split('/images/')[1];
        // on supprime donc l'image dont on a obtenu le nom de fichier ainsi
        fs.unlink(`images/${filename}`, () => {
            // puis on supprime la sauce de la base
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée'}))
            .catch(error => res.status(400).json({ error }))
        })
    })
    .catch(error => res.status(500).json({ error }));
}

exports.likesauce = (req, res, next) => {
    console.log(req.params.id)
    Sauce.findOne({ _id: req.params.id })
    // on attend d'avoir trouvé la sauce
    .then(sauce => {
        console.log("variable sauce 1 : " + JSON.stringify(sauce))

        // on fait une comparaison pour trouver l'id de notre user dans un array
        let isMyUser = (element) => element == req.body.userId


        // on switche sur la valeur de like
        switch (req.body.like){
            case -1:
                // Contrairement aux likes, l'application n'affiche pas le bouton dislike en rouge lorsque l'utilisateur a disliké précédemment la sauce.
                // Or, pour passer dans le case 0 (=> sauce ni likée ni dislikée), on a besoin d'avoir cet état afin de supprimer notre dislike. On ne peut donc pas supprimer un dislike si on a disliké puis quitté la page.
                // Pour limiter la casse, on va faire en sorte d'empecher l'utilisateur de disliker deux fois la même sauce.
                let indexToMatchInDislikes = sauce.userDisliked.findIndex(isMyUser)
                if(indexToMatchInDislikes == -1){
                    sauce.userDisliked.push(req.body.userId)
                    sauce.dislikes++
                }
                Sauce.updateOne({ _id: req.params.id }, { 
                    dislikes: sauce.dislikes,
                    userDisliked: sauce.userDisliked
                })
                .then(() => res.status(200).json({ message: 'Sauce dislikée'}))
                .catch(error => res.status(400).json({error}));
                break; 
            case 0:
                console.log("je suis dans le case 0")
                // on récupère l'index de l'utilisateur trouvé dans la liste des usersLiked
                let indexToSpliceInLikes = sauce.usersLiked.findIndex(isMyUser)
                // si jamais il est trouvé, on le splice et on décrémente le nombre de likes
                if(indexToSpliceInLikes != -1){
                    console.log("je suis dans la condition où j'ai trouvé dans les likes")
                    sauce.usersLiked.splice(indexToSpliceInLikes, 1)
                    sauce.likes--
                }
                let indexToSpliceInDislikes = sauce.userDisliked.findIndex(isMyUser)
                if(indexToSpliceInDislikes != -1){
                    sauce.userDisliked.splice(indexToSpliceInDislikes, 1)
                    sauce.dislikes--
                }
                Sauce.updateOne({ _id: req.params.id }, { 
                    likes: sauce.likes,
                    dislikes: sauce.dislikes,
                    usersLiked: sauce.usersLiked,
                    userDisliked: sauce.userDisliked
                })                
                .then(() => res.status(200).json({ message: 'Sauce dé-likée'}))
                .catch(error => res.status(400).json({error}));
                break;
            case 1:
                // on push dans le tableau de notre variable l'userId que l'ont récupère dans le corps de notre requête
                sauce.usersLiked.push(req.body.userId)
                // on incrémente le nombre de likes de la sauce
                sauce.likes++

                // Comme expliqué précédemment, l'application n'affiche pas le bouton dislike en rouge lorsque l'utilisateur a disliké précédemment la sauce.
                // Cela suppose qu'une sauce pourrait être dans un état où elle est simultanément likée et dislikée par un même utilisateur, ce qui n'a pas de sens.
                // On va donc faire en sorte qu'un like annule un dislike.
                let indexToMatchInDislikes2 = sauce.userDisliked.findIndex(isMyUser)
                if(indexToMatchInDislikes2 != -1){
                    sauce.userDisliked.splice(indexToMatchInDislikes2, 1)
                    sauce.dislikes--
                }
                // on met les valeurs modifiées en bdd
                Sauce.updateOne({ _id: req.params.id }, { 
                    likes: sauce.likes,
                    dislikes: sauce.dislikes,
                    usersLiked: sauce.usersLiked,
                    userDisliked: sauce.userDisliked
                })
                .then(() => res.status(200).json({ message: 'Sauce likée'}))
                .catch(error => res.status(400).json({error}));
                break; 

                // Sauce.updateOne({ _id: req.params.id }, { 
                //     likes: sauce.likes,
                //     dislikes: sauce.dislikes,
                //     userDisliked: sauce.userDisliked,
                //     usersLiked: sauce.usersLiked
                // })
                //     .then(() => res.status(200).json({ message: 'Sauce dislikée'}))
                //     .catch(error => res.status(400).json({error}));
                //     break; 
        }
    })
    .catch(error => res.status(404).json({ error }));
}