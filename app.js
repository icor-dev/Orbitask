const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const { conectarDB } = require('./config/db');
const flash = require('./middlewares/flash');
const { cookieJwt, requireAuth } = require('./middlewares/auth');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Motor de vistas y utilidades
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Orden: flash → JWT de cookie → rutas
app.use(flash);
app.use(cookieJwt);

// Rutas
app.get('/', (req, res) => res.redirect(res.locals.usuario ? '/tareas' : '/login'));
app.get('/salud', (req, res) => res.json({ estado: 'ok' }));
app.use('/', require('./routes/auth'));
app.use('/tareas', requireAuth, require('./routes/tareas'));

// Errores
app.use(notFound);
app.use(errorHandler);

// Arranque: solo escucha si hay conexión a MongoDB
conectarDB()
  .then(() => {
    const puerto = process.env.PORT || 3000;
    app.listen(puerto, () => console.log(`🪐 Orbitask en http://localhost:${puerto}`));
  })
  .catch((err) => {
    console.error('No se pudo conectar a MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;
