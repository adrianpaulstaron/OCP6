const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controller/sauces');

router.post('/', auth, multer, saucesCtrl.addsauce)
router.get('/', auth, saucesCtrl.getsauces)
router.get('/:id', auth, saucesCtrl.getsauce)
router.put('/:id', auth, saucesCtrl.updatesauce)
router.delete('/:id', auth, saucesCtrl.deletesauce)
router.post('/:id/like', auth, saucesCtrl.likesauce)


module.exports = router;