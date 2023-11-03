require('dotenv').config();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const Clientes = require('../models/cliente.model');

const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const seedUsuarios = async() => {
    try {
        await sequelize.authenticate();

        await Clientes.sync({ force: true });

        const usuariosDePrueba = [{
                nombre: 'juan',
                apellido: 'peres',
                usuario: 'juan12',
                password: await bcrypt.hash('1253', saltosBcrypt),
                createdBy: 'Seeder',
            },
            {
                nombre: 'pedro',
                apellido: 'gomez',
                usuario: 'pedro2',
                password: await bcrypt.hash('3528', saltosBcrypt),
                createdBy: 'Seeder',
            },
            {
                nombre: 'mateo',
                apellido: 'Apellido3',
                usuario: 'mate3',
                password: await bcrypt.hash('0945', saltosBcrypt),
                createdBy: 'Seeder',
            },
            {
                nombre: 'marcos',
                apellido: 'lopez',
                usuario: 'marc4',
                password: await bcrypt.hash('1256', saltosBcrypt),
                createdBy: 'Seeder',
            },
            {
                nombre: 'carlos',
                apellido: 'morales',
                usuario: 'carl7',
                password: await bcrypt.hash('3829', saltosBcrypt),
                createdBy: 'Seeder',
            },
            {
                nombre: 'mario',
                apellido: 'lopez',
                usuario: 'mar12',
                password: await bcrypt.hash('0935', saltosBcrypt),
                createdBy: 'Seeder',
            },
        ];


        await Clientes.bulkCreate(usuariosDePrueba);

        console.log('los clientes de prueba fueron insertados correctamente');
        sequelize.close();
    } catch (error) {
        console.log('hubo un error al insertar los clientes de pruebas', error);
    }

};


seedUsuarios();