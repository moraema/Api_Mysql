const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const op = require('sequelize');
const Clientes = require('../models/cliente.model');

const login = async(req, res) => {
    try {
        const { usuario, password } = req.body;

        const ClienteEncontrado = await Clientes.findOne({
            where: {
                usuario: usuario,
                deleted: false,
            },
        });

        if (!ClienteEncontrado) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos',
            });
        }

        const passwordEncontrado = bcrypt.compareSync(password, ClienteEncontrado.password);

        if (!passwordEncontrado) {
            return res.status(400).json({
                message: 'Usuario o contraseña incorrectos',
            });
        }

        const payload = {
            cliente: {
                id: ClienteEncontrado.id,
            },
        };

        const token = jwt.sign(payload, "eternamente-siempre", { expiresIn: '1h' });

        return res.status(200).json({
            message: 'El acceso fue correcto',
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Ocurrió un error al validar las credenciales',
            error: error.message,
        });
    }
};

module.exports = {
    login
};