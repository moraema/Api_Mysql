const Sequelize = require('sequelize');
const sequelize = require('../configs/db.confings');

const Contacto = sequelize.define('Contactos', {
    correo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    telefono: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.fn('now'),
    },
    createdBy: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
    },
    updatedBy: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
    },
    deletedBy: {
        type: Sequelize.STRING,
        defaultValue: null,
    },
});

Contacto.sync()
    .then(() => {
        console.log('Tabla Contacto creada.');
    })
    .catch(err => {
        console.error('Error al crear la tabla Contacto:', err);
    });

module.exports = Contacto;