require("dotenv").config();
require("./src/configs/db.configs");

const express = require('express');
const app = express();
const clientesRouter = require('./src/routes/clientes.router');
const authRouter = require('./src/routes/auth.route');


app.use(express.json());


app.use('/clientes', clientesRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.error("El api fue escuchado en el puerto: " + PORT);
});