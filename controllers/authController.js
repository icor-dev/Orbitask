const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function darToken(res, usuario) {
  const token = jwt.sign(
    { sub: usuario._id.toString(), email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

exports.formRegistro = (req, res) => {
  res.render('auth/registro', { titulo: 'Crear cuenta', errores: {}, valores: {} });
};

exports.registrar = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const confirmacion = req.body.confirmacion || '';

    const errores = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errores.email = 'Escribe un email válido.';
    if (password.length < 8) errores.password = 'La contraseña debe tener al menos 8 caracteres.';
    if (password !== confirmacion) errores.confirmacion = 'Las contraseñas no coinciden.';
    if (!errores.email && (await User.exists({ email }))) {
      errores.email = 'Ese email ya tiene una cuenta.';
    }

    if (Object.keys(errores).length) {
      return res.status(400).render('auth/registro', {
        titulo: 'Crear cuenta',
        errores,
        valores: { email },
      });
    }

    // El primer usuario registrado queda como admin (bootstrap de la app).
    // El resto de admins se promueven editando su documento en la BD.
    const rol = (await User.countDocuments()) === 0 ? 'admin' : 'user';
    const usuario = await User.create({
      email,
      passwordHash: await bcrypt.hash(password, 10),
      rol,
    });

    darToken(res, usuario);
    res.setFlash('ok', 'Cuenta creada. ¡Bienvenido a Orbitask! 🪐');
    res.redirect('/tareas');
  } catch (err) {
    next(err);
  }
};

exports.formLogin = (req, res) => {
  res.render('auth/login', { titulo: 'Iniciar sesión', error: null, valores: {} });
};

exports.login = async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const usuario = email ? await User.findOne({ email }) : null;
    const ok = usuario && (await bcrypt.compare(req.body.password || '', usuario.passwordHash));

    if (!ok) {
      return res.status(401).render('auth/login', {
        titulo: 'Iniciar sesión',
        error: 'Email o contraseña incorrectos.',
        valores: { email },
      });
    }

    darToken(res, usuario);
    res.redirect('/tareas');
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.setFlash('ok', 'Sesión cerrada. ¡Hasta pronto!');
  res.redirect('/login');
};
