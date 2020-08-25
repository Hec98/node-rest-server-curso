// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token
process.env.CADUCIDAD_TOKEN = '48h';

// SEED de autentificación
process.env.SEED = process.env.SEED || '    -desarrollo';

// Base de datos
let urlDB;
if (process.env.NODE_ENV === 'dev') urlDB = 'mongodb://localhost:27017/cafe';
else urlDB = process.env.MONGO_URI;
process.env.URLDB = urlDB;

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '771728662805-n7jeeeq93r3nd4kchhortkk8nnp81a9f.apps.googleusercontent.com';