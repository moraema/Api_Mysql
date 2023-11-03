const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    define: {
        timestamps: false,
    }
});

sequelize.authenticate()
    .then(() => {
        console.log("La conexión a MySQL fue exitosa");
    })
    .catch((error) => {
        console.log("Hubo un error al conectarse a MySQL: ", error);
    });

module.exports = sequelize;