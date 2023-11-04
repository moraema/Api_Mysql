const bcrypt = require('bcrypt');
const Contacto = require('../models/contacto.model');
const saltosBcrypt = parseInt(process.env.SALTOS_BCRYPT);

const createContact = async(req, res) => {
    try {

        const ContactoAutenticado = req.contacto.id;

        const { correo, telefono } = req.body;
        const hashedTelefono = await bcrypt.hash(telefono, saltosBcrypt);

        const contacto = await Contacto.create({
            correo: correo,
            telefono: hashedTelefono,
            createdBy: ContactoAutenticado,
        });

        await contacto.save();

        res.status(201).json({
            message: 'El contacto fue creado exitosamente',
        });
    } catch (error) {
        console.error('Error al crear el contacto', error);
        res.status(500).json({
            message: 'Hubo un error al crear el contacto',
            error: error.message,
        });
    }
};

const getContacts = async(req, res) => {
    try {
        const { page, limit } = req.query;
        const offset = (page - 1) * limit;

        const contactos = await Contacto.findAndCountAll({
            where: { deleted: false },
            limit: parseInt(limit),
            offset: offset,
            order: [
                ['correo', 'ASC']
            ],
        });

        let response = {
            message: "Se obtuvieron a los contactos correctamente",
            Data: contactos,
        }

        if (page && limit) {
            const totalContacto = await Contacto.count({ where: { deleted: false } });
            const totalpages = Math.ceil(totalContacto / parseInt(limit));
            const currentPage = parseInt(page);
            response = {
                ...response,
                total: totalContacto,
                totalpages,
                currentPage
            }
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Ocurrió un error al obtener a los contactos',
            error: error.message
        });
    }
};

const getContactById = async(req, res) => {
    try {
        const { id } = req.params;

        const contactoBuscado = await Contacto.findOne({ where: { id: id } });

        if (!contactoBuscado) {
            res.status(404).json({
                message: 'El contacto no fue encontrado'
            });
            return;
        }
        res.status(200).json({
            message: 'El contacto fue encontrado',
            contactoBuscado
        });
    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al buscar al contacto'
        })
    }
};

const logicalDeleteContact = async(req, res) => {

    try {
        const ContactoAutenticado = req.contacto.id;
        const { id } = req.params;

        const contactoEliminado = await Contacto.findOne({ where: { id: id, deleted: false } });

        if (!contactoEliminado) {
            res.status(401).json({
                message: 'El contacto no fue encontrado'
            });
            return;
        }

        contactoEliminado.deleted = true;
        contactoEliminado.deletedAt = new Date();
        contactoEliminado.deletedBy = ContactoAutenticado;

        await contactoEliminado.save();

        return res.status(200).json({
            message: 'El contacto fue eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Hubo un error al eliminar el contacto',
            error: error.message
        });
    }
};

const updateContact = async(req, res) => {
    try {
        const ContactoAutenticado = req.contacto.id;

        const { id } = req.params;
        const { correo, telefono } = req.body;

        const contactoActualizado = await Contacto.findByPk(id);

        if (!contactoActualizado) {
            return res.status(404).json({
                message: "El contacto no fue encontrado"
            });
        }

        if (correo) contactoActualizado.correo = correo;
        if (telefono) {
            const hashedTelefono = await bcrypt.hash(telefono, saltosBcrypt);
            contactoActualizado.telefono = hashedTelefono;
        }

        contactoActualizado.updatedAt = new Date();
        contactoActualizado.updatedBy = ContactoAutenticado;
        await contactoActualizado.save();

        return res.status(200).json({
            message: "El contacto fue actualizado con éxito"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocurrió un error al editar el contacto",
            error: error.message
        });
    }
};

module.exports = {
    createContact,
    logicalDeleteContact,
    getContacts,
    getContactById,
    updateContact
};