const bcrypt = require('bcrypt');
const Cliente = require('../models/cliente.model');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

const create = async(req, res) => {
    try {
        const ClienteAutenticado = req.cliente.id;

        const { nombre, apellido, usuario, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltosBcrypt);

        const cliente = await Cliente.create({
            nombre: nombre,
            apellido: apellido,
            usuario: usuario,
            password: hashedPassword,
            createdBy: ClienteAutenticado,
        });

        await cliente.save();

        res.status(201).json({
            message: 'El cliente fue creado exitosamente',
        });
    } catch (error) {
        console.error('Error al crear el usuario', error);
        res.status(500).json({
            message: 'Hubo un error al crear al cliente',
            error: error.message,
        });
    }
};

const obtener = async(req, res) => {
    try {
        const { page, limit } = req.query;
        const offset = (page - 1) * limit;

        const clientes = await Cliente.findAndCountAll({
            where: { deleted: false },
            limit: parseInt(limit),
            offset: offset,
            order: [
                ['nombre', 'ASC']
            ]
        });

        let response = {
            message: "Se obtuvieron a los clientes correctamente",
            Data: clientes,
        }

        if (page && limit) {
            const totalCliente = await Cliente.count({ where: { deleted: false } });
            const totalpages = Math.ceil(totalCliente / parseInt(limit));
            const currentPage = parseInt(page);
            response = {
                ...response,
                total: totalCliente,
                totalpages,
                currentPage
            }
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Ocurrió un error al obtener a los clientes',
            error: error.message
        });
    }
};



const obtenerId = async(req, res) => {
    try {
        const { id } = req.params;

        const clienteBuscado = await Cliente.findOne({ where: { id: id } });

        if (!clienteBuscado) {
            res.status(404).json({
                messaje: 'el cliente no fue encontrado'
            });
            return;
        }
        res.status(200).json({
            messaje: 'el cliente fue encontrado',
            clienteBuscado
        });
    } catch (error) {
        res.status(500).json({
            messaje: 'hubo un error al buscar al cliente'
        })
    }
};


const deletelogico = async(req, res) => {
    try {
        const ClienteAutenticado = req.cliente.id;
        const { id } = req.params;

        const clienteEliminado = await Cliente.findOne({ where: { id: id, deleted: false } });

        if (!clienteEliminado) {
            res.status(401).json({
                messaje: 'el cliente no fue encontrado'
            });
            return;
        }

        clienteEliminado.deleted = true;
        clienteEliminado.deletedAt = new Date();
        clienteEliminado.deletedBy = ClienteAutenticado;

        await clienteEliminado.save();

        return res.status(200).json({
            messaje: 'el cliente fue eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            messaje: 'hubo un error al eliminar al usuario',
            error: error.message
        });
    }
};


const actualizar = async(req, res) => {
    try {
        const ClienteAutenticado = req.cliente.id;
        const { id } = req.params;
        const { nombre, apellido, usuario, password } = req.body;

        const clienteActualizado = await Cliente.findByPk(id);

        if (!clienteActualizado) {
            return res.status(404).json({
                message: "El cliente no fue encontrado"
            });
        }

        if (nombre) clienteActualizado.nombre = nombre;
        if (apellido) clienteActualizado.apellido = apellido;
        if (usuario) clienteActualizado.usuario = usuario;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltosBcrypt);
            clienteActualizado.password = hashedPassword;
        }

        clienteActualizado.updatedAt = new Date();
        clienteActualizado.updatedBy = ClienteAutenticado;
        await clienteActualizado.save();

        return res.status(200).json({
            message: "El cliente fue actualizado con éxito"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al editar el cliente",
            error: error.message
        });
    }
};


module.exports = {
    create,
    deletelogico,
    obtener,
    obtenerId,
    actualizar
}