const express = require('express');
let { verificaToken, verificarAminRole } = require('../middlewares/autentificacion');
let app = express();
let Categoria = require('../models/categoria');
const usuario = require('../models/usuario');
const categoria = require('../models/categoria');
const _ = require('underscore');

// Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoria) => {
            if (err) return res.status(400).json({ ok: false, err });
            Categoria.countDocuments({}, (err, conteo) => {
                if (err) return res.status(400).json({ ok: false, err });
                res.json({ ok: true, categoria, conteo });
            });
        });
});

// Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findByID();
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!categoria) return res.status(400).json({ ok: false, err: { message: 'El id no existe'}});
        res.json({ ok: true, categoria });
    });
});

// Crear nueva categotia
app.post('/categoria', verificaToken, (req, res) => {
    // Regresa la nueva categoria
    // req.usuario._id
    let body = req.body;
    let usuario = req.usuario._id; // Viene de verificarToken
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario
    });
    categoria.save((err, categoriaDB) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!categoriaDB) return res.status(400).json({ ok: false, err });
        res.json({ ok: true, categoria: categoriaDB });
    });
});

// Actualizar categoria (nombre de la categoria)
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = { descripcion: body.descripcion }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true }, (err, categoria) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!categoria) return res.status(400).json({ ok: false, err });
        res.json({ ok: true, categoria });
    });
});

// Borrar categoria
app.delete('/categoria/:id', [verificaToken, verificarAminRole], (req, res) => {
    // Solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaRemovida) => {
        if (err) return res.status(400).json({ ok: false, err });
        if (!categoria) return res.status(400).json({ ok: false, err: { message: 'El id no existe'}});
        res.json({ ok: true, message:'Categoria borrada' });
    });
});

module.exports = app;

