const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controller/sauces');
const sanitizer = require('../middleware/sanitizer')

// on ajoute notre middleware d'authentification sur chaque route afin de la sécuriser
// la route d'ajout de sauce se voit ajouté un middleware en plus, qui sert à gérer les fichiers (l'utilisateur téléverse une image de sauce lors de sa création)
router.post('/', auth, sanitizer, multer, saucesCtrl.addsauce)
router.get('/', auth, saucesCtrl.getsauces)
router.get('/:id', auth, saucesCtrl.getsauce)
router.put('/:id', auth, sanitizer, multer, saucesCtrl.updatesauce)
router.delete('/:id', auth, saucesCtrl.deletesauce)
router.post('/:id/like', auth, sanitizer, saucesCtrl.likesauce)

module.exports = router;