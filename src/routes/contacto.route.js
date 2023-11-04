const express = require('express');
const router = express.Router();
const contactosController = require('../controllers/contacto.controller');
const authMiddleware = require('../middlewares/auth.middlewares');



router.post('/', authMiddleware.verifyToken, contactosController.createContact);
router.delete('/:id', authMiddleware.verifyToken, contactosController.logicalDeleteContact);
router.get('/', authMiddleware.verifyToken, contactosController.getContacts);
router.get('/:id', authMiddleware.verifyToken, contactosController.getContactById);
router.put('/:id', authMiddleware.verifyToken, contactosController.updateContact);

module.exports = router;