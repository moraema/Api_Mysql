// src/seeders/administrador.js
const db = require('../configs/db');
const bcrypt = require('bcrypt');

const administradores = [
  {
    usuario: 'admin1',
    contraseña: 'admin123',
  },
  {
    usuario: 'admin2',
    contraseña: 'admin456',
  },
  {
    usuario: 'admin3',
    contraseña: 'admin789',
  },
];

const seedAdministradores = async () => {
  try {
    const sql = 'DELETE FROM administrador';

    db.query(sql, async (error, result) => {
      if (error) {
        return console.error('Error al eliminar administradores', error.message);
      }

      for (const administrador of administradores) {
        const hashedPassword = await bcrypt.hash(administrador.contraseña, 10);
        const newAdministrador = {
          usuario: administrador.usuario,
          contraseña: hashedPassword,
        };

        const sql = 'INSERT INTO administrador SET ?';

        db.query(sql, newAdministrador, (error, result) => {
          if (error) {
            return console.error('Error al insertar administrador', error.message);
          }
        });
      }

      console.log('Administradores insertados con éxito');
    });
  } catch (error) {
    console.error('Error al insertar administradores', error.message);
  }
};

module.exports = seedAdministradores;
