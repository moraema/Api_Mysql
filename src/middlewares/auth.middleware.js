const jwt = require('jsonwebtoken');
const newJwtSecret = 'clave-secreta';

const verifyToken = (req, res, next) => {
    const token = req.get('Authorization');

    jwt.verify(token, newJwtSecret, (err, decode) => {
        if (err) {
            return res.status(401).send({
                message: 'Hubo un error al validar el token',
                error: err.message
            });
        }
        // Agrega un registro para verificar req.contacto
        console.log('req.contacto:', req.contacto);
        req.contacto = decode.contacto;
        next();
    });
};


module.exports = {
    verifyToken
};