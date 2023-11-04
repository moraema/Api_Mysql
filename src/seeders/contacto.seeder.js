require('dotenv').config();
const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const Contactos = require('../models/contacto.model');

const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

const seedContactos = async() => {
    try {
        await sequelize.authenticate();

        await Contactos.sync({ force: true });

        const contactosDePrueba = [{
                correo: 'juan@example.com',
                telefono: await bcrypt.hash('1234567890', saltosBcrypt), // Cifrar el número de teléfono
            },
            {
                correo: 'pedro@example.com',
                telefono: await bcrypt.hash('9876543210', saltosBcrypt),
            },
            {
                correo: 'mateo@example.com',
                telefono: await bcrypt.hash('5555555555', saltosBcrypt),
            },
        ];

        await Contactos.bulkCreate(contactosDePrueba);

        console.log('Los contactos de prueba fueron insertados correctamente');
        sequelize.close();
    } catch (error) {
        console.log('Hubo un error al insertar los contactos de prueba', error);
    }
};

seedContactos();