// src/models/administrador.js
const db = require('../configs/db');

const Administrador = function (administrador) {
  this.usuario = administrador.usuario;
  this.contraseña = administrador.contraseña;
  this.createdAt = administrador.createdAt;
  this.updatedAt = administrador.updatedAt;
  this.deletedAt = administrador.deletedAt;
};

module.exports = Administrador;
