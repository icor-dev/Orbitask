// Mensajes flash sin dependencias extra: viajan una vez en una cookie
// httpOnly y se borran al leerse.
function flash(req, res, next) {
  let mensaje = null;
  if (req.cookies && req.cookies.flash) {
    try {
      mensaje = JSON.parse(req.cookies.flash);
    } catch {
      // cookie corrupta: se ignora y se limpia
    }
    res.clearCookie('flash');
  }
  res.locals.flash = mensaje;
  res.setFlash = (tipo, texto) => {
    res.cookie('flash', JSON.stringify({ tipo, texto }), { httpOnly: true, sameSite: 'lax' });
  };
  next();
}

module.exports = flash;
