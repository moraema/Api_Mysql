// src/middlewares/auth.js
const { verifyToken } = require('../configs/jwt');

const auth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó el token',
      });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó el token',
      });
    }

    const payload = verifyToken(token);

    req.administrador = payload;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido',
      error: error.message,
    });
  }
};

module.exports = auth;