require('./config/config');
const port = process.env.PORT;
const url = process.env.URLDB;
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const colors = require('colors/safe');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuracion global de rutas
app.use(require('./routes/index'));

/* mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if (err) console.log(colors.red(err));
    console.log(colors.green('Base de datos ONLINE'));
}); */

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, (err, res) => {
  if (err) console.log(colors.red(err));
  console.log(colors.green('Base de datos ONLINE'));
});

const hora = new Date().getHours();
const minutos = new Date().getMinutes();
const segundos = new Date().getSeconds();
app.listen(port, () => console.log(colors.cyan(`Escuchando peticiones en el puerto ${port} ${hora}:${minutos}:${segundos}`)));