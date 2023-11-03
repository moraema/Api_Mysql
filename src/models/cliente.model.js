const Sequelize = require('sequelize');
const sequelize = require('../configs/db.configs');

const Cliente = sequelize.define('Clientes', {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    apellido: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    usuario: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
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


Cliente.sync()
    .then(() => {
        console.log('Tabla Cliente creada.');
    })
    .catch(err => {
        console.error('Error al crear la tabla Cliente:', err);
    });

module.exports = Cliente;