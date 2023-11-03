const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller');
const authMiddleware = require('../middlewares/auth.middleware');



router.post('/', authMiddleware.verificarJwt, clientesController.create);
router.delete('/:id', authMiddleware.verificarJwt, clientesController.deletelogico);
router.get('/', authMiddleware.verificarJwt, clientesController.obtener);
router.get('/:id', authMiddleware.verificarJwt, clientesController.obtenerId);
router.put('/:id', authMiddleware.verificarJwt, clientesController.actualizar);

module.exports = router;