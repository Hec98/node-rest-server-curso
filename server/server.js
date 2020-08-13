require('./config/config');
const port = process.env.PORT;
const express = require('express');
const mongoose = require('mongoose');
const colors = require('colors/safe');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

/* mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if (err) console.log(colors.red(err));
    console.log(colors.green('Base de datos ONLINE'));
}); */

mongoose.connect('mongodb://localhost:27017/cafe', {
  useNewUrlParser: true,
  useUnifiedTopology: true 
}, (err, res) => {
    if (err) console.log(colors.red(err));
    console.log(colors.green('Base de datos ONLINE'));
});

const hora = new Date().getHours();
const minutos = new Date().getMinutes();
const segundos = new Date().getSeconds(); 
app.listen(port, () => console.log(colors.green(`Escuchando peticiones en el puerto ${port} ${hora}:${minutos}:${segundos}`)));