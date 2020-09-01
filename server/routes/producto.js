const express = require('express');
const { verificaToken, verificarAminRole } = require('../middlewares/autentificacion');
let app = express();
let Producto = require('../models/producto');
const usuario = require('../models/usuario');

// Obtener productos
app.get('/productos', verificaToken, (req, res) => {
    // Trae todos los productos
    // populate: usuario y categoria
    // paginado
    Producto.find({disponible: true})
        .exec((err, productoDB) => {
            if (err) return res.status(500).json({ ok: false, err });
            Producto.countDocuments({disponible: true})
                .exec((err, conteo) => {
                    if (err) return res.status(500).json({ ok: false, err });
                    if (!productoDB) res.status(404).json({ ok: false, err: { message: 'Producto no encontrado' } });
                    res.status(201).json({ ok: true, productoDB, conteo });
                });
        });
});

// Obtener un producto
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario y categoria
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!productoDB) res.status(404).json({ ok: false, err: { message: 'Producto no encontrado' } });
        res.status(201).json({ ok: true, productoDB });
    });
});

// Crear un producto
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) return res.status(500).json({ ok: false, err });
        res.status(201).json({ ok: true, productoDB });
    });
});

// Actualizar un producto
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let newProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        categoria: body.categoria,
        disponible: body.disponible,
        descripcion: body.descripcion
    };
    Producto.findByIdAndUpdate(id, newProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!productoDB) res.status(404).json({ ok: false, err: { message: 'Producto no encontrado' } });
        res.status(201).json({ ok: true, productoActualizado: productoDB });        
    });

});

// Borrar un producto
app.delete('/productos/:id', [verificaToken, verificarAminRole], (req, res) => {
    let id = req.params.id;
    Producto.findOneAndUpdate(id, { disponible: false }, {new: true}, (err, productoDB) => {
        if (err) return res.status(500).json({ ok: false, err });
        if (!productoDB) res.status(404).json({ ok: false, err: { message: 'Producto no encontrado' } });
        res.status(201).json({ ok: true, productoActualizado: productoDB });
    });

});

module.exports = app;
