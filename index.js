// index.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((error) => {
  if (error) {
    console.error('Error al conectar a la base de datos', error.message);
  } else {
    console.log('Conectado a la base de datos');
  }
});

const administradorRouter = require('./src/routes/administrador.route');

app.use('/api/administrador', administradorRouter);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
