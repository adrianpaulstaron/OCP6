const Sauce = require('../models/Sauce');
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
    // pour l'url de l'image: on requiert d'abord le protocole (qui va être http), ensuite le host, on ajoute notre dossier /images/, puis on ajoute le filename
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
        usersDisliked: []
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
    // si on a une nouvelle image, on veut supprimer l'ancienne image
    // on vérifie donc si on a un fichier
    if(req.file){
        console.log("on a un file")
        // si on a un fichier, on récupère la sauce en bdd
        Sauce.findOne({ _id: req.params.id }).then(sauce => {
            // on récupère l'url de l'image dans notre sauce récupérée en bdd, qu'on split sur le dossier images afin d'obtenir son nom de
            const filename = sauce.imageUrl.split('/images/')[1];
            console.log("nom de la sauce => " + filename)
            // on supprime le fichier 
            fs.unlink(`images/${filename}`, () => {
                // on pointe vers la bonne sauce en bdd, puis on la met à jour avec la sauce de la requête. on le fait avec un spread operator (qui copie les champs qu'il y a dans SauceObject)
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
                .catch(error => res.status(400).json({error}));
            })
        })
    }else{
        // on pointe vers la bonne sauce en bdd, puis on la met à jour avec la sauce de la requête. on le fait avec un spread operator (qui copie les champs qu'il y a dans SauceObject)
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée'}))
        .catch(error => res.status(400).json({error}));
    }
       
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
    Sauce.findOne({ _id: req.params.id })
    // on attend d'avoir trouvé la sauce
    .then(sauce => {
        // on fait une comparaison pour trouver l'id de notre user dans un array
        let isMyUser = (element) => element == req.body.userId
        // on switche sur la valeur de like
        switch (req.body.like){
            case 1:
                // on push dans le tableau de notre variable l'userId que l'ont récupère dans le corps de notre requête
                sauce.usersLiked.push(req.body.userId)
                // on incrémente le nombre de likes de la sauce
                sauce.likes++
                // on met les valeurs modifiées en bdd
                Sauce.updateOne({ _id: req.params.id }, { 
                    likes: sauce.likes,
                    usersLiked: sauce.usersLiked,
                })
                .then(() => res.status(200).json({ message: 'Sauce likée'}))
                .catch(error => res.status(400).json({error}));
                break; 
            case 0:
                // on récupère l'index de l'utilisateur trouvé dans la liste des usersLiked
                let indexToSpliceInLikes = sauce.usersLiked.findIndex(isMyUser)
                // si jamais il est trouvé, on le splice et on décrémente le nombre de likes
                if(indexToSpliceInLikes != -1){
                    sauce.usersLiked.splice(indexToSpliceInLikes, 1)
                    sauce.likes--
                }
                // même logique pour les dislikes
                let indexToSpliceInDislikes = sauce.usersDisliked.findIndex(isMyUser)
                if(indexToSpliceInDislikes != -1){
                    sauce.usersDisliked.splice(indexToSpliceInDislikes, 1)
                    sauce.dislikes--
                }
                // on update notre sauce en base
                Sauce.updateOne({ _id: req.params.id }, { 
                    likes: sauce.likes,
                    dislikes: sauce.dislikes,
                    usersLiked: sauce.usersLiked,
                    usersDisliked: sauce.usersDisliked
                })                
                .then(() => res.status(200).json({ message: 'Sauce dé-likée'}))
                .catch(error => res.status(400).json({error}));
                break;
            case -1:
            sauce.usersDisliked.push(req.body.userId)
            sauce.dislikes++
            Sauce.updateOne({ _id: req.params.id }, { 
                dislikes: sauce.dislikes,
                usersDisliked: sauce.usersDisliked
            })
            .then(() => res.status(200).json({ message: 'Sauce dislikée'}))
            .catch(error => res.status(400).json({error}));
                break; 

        }
    })
    .catch(error => res.status(404).json({ error }));
}