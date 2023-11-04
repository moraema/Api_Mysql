const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const Contactos = require('../models/contacto.model');

const loginByEmail = async (req, res) => {
    try {
        const { correo } = req.body;

        const ContactoEncontrado = await Contactos.findOne({
            where: {
                correo: correo,
                deleted: false,
            },
        });

        if (!ContactoEncontrado) {
            return res.status(400).json({
                message: 'Correo incorrecto',
            });
        }

        const payload = {
            contacto: {
                id: ContactoEncontrado.id,
            },
        };

        const token = jwt.sign(payload, 'clave-secreta', { expiresIn: '1h' });

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
    loginByEmail,
};