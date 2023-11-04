// src/routes/administrador.js
const express = require('express');
const router = express.Router();
const {
  createAdministrador,
  getAdministrador,
  getAdministradores,
  updateAdministrador,
  deleteAdministrador,
  loginAdministrador,
} = require('../controllers/administrador');
const auth = require('../middlewares/auth');

router.post('/', createAdministrador);
router.get('/:id', auth, getAdministrador);
router.get('/', auth, getAdministradores);
router.put('/:id', auth, updateAdministrador);
router.delete('/:id', auth, deleteAdministrador);
router.post('/login', loginAdministrador);

module.exports = router;
