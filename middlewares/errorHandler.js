function notFound(req, res) {
  res.status(404).render('error', {
    titulo: 'Página no encontrada',
    mensaje: 'La página que buscas no existe.',
  });
}

// Middleware global de errores
function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== 'production') console.error(err);
  const status = err.status || 500;
  const mensaje = status < 500 ? err.message : 'Algo salió mal. Intenta de nuevo más tarde.';
  res.status(status).render('error', { titulo: 'Error', mensaje });
}

module.exports = { notFound, errorHandler };
