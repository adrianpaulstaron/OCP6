const multer = require ('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

// on crée un objet de configuration multer
const storage = multer.diskStorage({
    // on donne la destination où enregistrer les images
    destination: (req, file, callback) => {
        // on donne le nom du dossier en deuxième argument
        callback(null, 'images')
    },
    // on va donner un nom au fichier
    filename: (req, file, callback) => {
        // on part du nom d'origine du fichier
        // on remplace les espace par des underscore (on split autour des espaces plus on join le tableau obtenu avec des underscores)
        const name = file.originalname.split(' ').join('_');
        // on donne une extension à partir de son MIME_TYPE
        const extension = MIME_TYPES[file.mimetype];
        // on appelle le callback pour créer le filename complet, auquel on ajoute un timestamp afin d'avoir un nom de fichier unique
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');