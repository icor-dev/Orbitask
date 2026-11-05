const jwt = require('jsonwebtoken');

// Decodifica el JWT de la cookie y expone el usuario en res.locals (vistas incluidas)
function cookieJwt(req, res, next) {
  res.locals.usuario = null;
  const token = req.cookies && req.cookies.token;
  if (!token) return next();
  try {
    res.locals.usuario = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.clearCookie('token');
  }
  next();
}

// Middleware de protección para rutas privadas
function requireAuth(req, res, next) {
  if (!res.locals.usuario) return res.redirect('/login');
  next();
}

module.exports = { cookieJwt, requireAuth };
