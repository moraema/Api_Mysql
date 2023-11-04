// src/controllers/administrador.js
const db = require('../configs/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../configs/jwt');

const createAdministrador = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    const sql = 'SELECT * FROM administrador WHERE usuario = ?';

    db.query(sql, [usuario], async (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al crear administrador',
          error: error.message,
        });
      }

      if (result.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'El usuario ya existe',
        });
      }

      const hashedPassword = await bcrypt.hash(contraseña, 10);

      const newAdministrador = {
        usuario,
        contraseña: hashedPassword,
      };

      const sql = 'INSERT INTO administrador SET ?';

      db.query(sql, newAdministrador, (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Error al crear administrador',
            error: error.message,
          });
        }

        res.status(201).json({
          success: true,
          message: 'Administrador creado con éxito',
          data: { id: result.insertId, ...newAdministrador },
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear administrador',
      error: error.message,
    });
  }
};

const getAdministrador = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'SELECT * FROM administrador WHERE id_administrador = ? AND deletedAt IS NULL';

    db.query(sql, [id], (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al obtener administrador',
          error: error.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró el administrador',
        });
      }

      const administrador = result[0];

      res.status(200).json({
        success: true,
        message: 'Administrador encontrado',
        data: administrador,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener administrador',
      error: error.message,
    });
  }
};

const getAdministradores = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt' } = req.query;

    const skip = (page - 1) * limit;

    const sql = `SELECT * FROM administrador WHERE deletedAt IS NULL ORDER BY ${sort} LIMIT ${skip}, ${limit}`;

    db.query(sql, (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al obtener administradores',
          error: error.message,
        });
      }

      const administradores = result;

      const sql = 'SELECT COUNT(*) AS total FROM administrador WHERE deletedAt IS NULL';

      db.query(sql, (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Error al obtener administradores',
            error: error.message,
          });
        }

        const total = result[0].total;

        res.status(200).json({
          success: true,
          message: 'Administradores encontrados',
          data: administradores,
          meta: {
            page,
            limit,
            sort,
            total,
            pages: Math.ceil(total / limit),
          },
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener administradores',
      error: error.message,
    });
  }
};

const updateAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, contraseña } = req.body;

    const sql = 'SELECT * FROM administrador WHERE id_administrador = ? AND deletedAt IS NULL';

    db.query(sql, [id], async (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al actualizar administrador',
          error: error.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró el administrador',
        });
      }

      const administrador = result[0];

      if (usuario) {
        administrador.usuario = usuario;
      }

      if (contraseña) {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        administrador.contraseña = hashedPassword;
      }

      administrador.updatedAt = new Date();

      const sql = 'UPDATE administrador SET ? WHERE id_administrador = ?';

      db.query(sql, [administrador, id], (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Error al actualizar administrador',
            error: error.message,
          });
        }

        res.status(200).json({
          success: true,
          message: 'Administrador actualizado con éxito',
          data: administrador,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar administrador',
      error: error.message,
    });
  }
};

const deleteAdministrador = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = 'SELECT * FROM administrador WHERE id_administrador = ? AND deletedAt IS NULL';

    db.query(sql, [id], (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al eliminar administrador',
          error: error.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró el administrador',
        });
      }

      const administrador = result[0];

      administrador.deletedAt = new Date();

      const sql = 'UPDATE administrador SET ? WHERE id_administrador = ?';

      db.query(sql, [administrador, id], (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Error al eliminar administrador',
            error: error.message,
          });
        }

        res.status(200).json({
          success: true,
          message: 'Administrador eliminado con éxito',
          data: administrador,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar administrador',
      error: error.message,
    });
  }
};

const loginAdministrador = async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;

    const sql = 'SELECT * FROM administrador WHERE usuario = ? AND deletedAt IS NULL';

    db.query(sql, [usuario], async (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al iniciar sesión',
          error: error.message,
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Usuario o contraseña incorrectos',
        });
      }

      const administrador = result[0];

      const match = await bcrypt.compare(contraseña, administrador.contraseña);

      if (!match) {
        return res.status(401).json({
          success: false,
          message: 'Usuario o contraseña incorrectos',
        });
      }

      const token = generateToken({ id: administrador.id_administrador });

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: administrador,
        token,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
};

module.exports = {
  createAdministrador,
  getAdministrador,
  getAdministradores,
  updateAdministrador,
  deleteAdministrador,
  loginAdministrador,
};
