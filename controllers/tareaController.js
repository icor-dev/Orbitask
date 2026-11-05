const { mongoose } = require('../config/db');
const Tarea = require('../models/Tarea');

const ESTADOS = ['pendiente', 'en_progreso', 'completada'];

function esAdmin(usuario) {
  return usuario.rol === 'admin';
}

function noEncontrada(res) {
  res.status(404).render('error', {
    titulo: 'Tarea no encontrada',
    mensaje: 'La tarea no existe o no es tuya.',
  });
}

// user solo ve lo suyo; admin ve de todo
function filtroDelUsuario(usuario) {
  return esAdmin(usuario) ? {} : { propietario: usuario.sub };
}

exports.listar = async (req, res, next) => {
  try {
    const tareas = await Tarea.find(filtroDelUsuario(res.locals.usuario))
      .sort({ createdAt: -1 })
      .populate('propietario', 'email');
    res.render('tareas/index', {
      titulo: 'Mis tareas',
      tareas,
      esAdmin: esAdmin(res.locals.usuario),
    });
  } catch (err) {
    next(err);
  }
};

exports.detalle = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return noEncontrada(res);

    const tarea = await Tarea.findById(id).populate('propietario', 'email');
    const propietaria = tarea && tarea.propietario._id.toString() === res.locals.usuario.sub;
    if (!tarea || (!propietaria && !esAdmin(res.locals.usuario))) return noEncontrada(res);

    res.render('tareas/detalle', {
      titulo: tarea.titulo,
      tarea,
      esAdmin: esAdmin(res.locals.usuario),
      esPropietaria: propietaria,
    });
  } catch (err) {
    next(err);
  }
};

exports.formNueva = (req, res) => {
  res.render('tareas/formulario', { titulo: 'Nueva tarea', tarea: null, errores: {}, valores: {} });
};

// Valida y normaliza el formulario; de paso deja los valores para re-render
function validar(body) {
  const titulo = (body.titulo || '').trim();
  const descripcion = body.descripcion || '';
  const estado = body.estado || 'pendiente';

  const errores = {};
  if (!titulo) errores.titulo = 'El título es obligatorio.';
  if (!ESTADOS.includes(estado)) errores.estado = 'Estado no válido.';
  const fecha = body.fecha ? new Date(body.fecha) : undefined;
  if (body.fecha && Number.isNaN(fecha.getTime())) errores.fecha = 'Fecha no válida.';

  return {
    errores,
    datos: { titulo, descripcion, estado, ...(fecha ? { fecha } : {}) },
    valores: { titulo, descripcion, estado, fecha: body.fecha || '' },
  };
}

exports.crear = async (req, res, next) => {
  try {
    const { errores, datos, valores } = validar(req.body);
    if (Object.keys(errores).length) {
      return res
        .status(400)
        .render('tareas/formulario', { titulo: 'Nueva tarea', tarea: null, errores, valores });
    }
    await Tarea.create({ ...datos, propietario: res.locals.usuario.sub });
    res.setFlash('ok', 'Tarea creada. 🚀');
    res.redirect('/tareas');
  } catch (err) {
    next(err);
  }
};

exports.formEditar = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return noEncontrada(res);

    const tarea = await Tarea.findById(id);
    // solo el dueño edita su tarea (el admin ve/borra, no edita ajenas)
    if (!tarea || tarea.propietario.toString() !== res.locals.usuario.sub) return noEncontrada(res);

    res.render('tareas/formulario', { titulo: 'Editar tarea', tarea, errores: {}, valores: null });
  } catch (err) {
    next(err);
  }
};

exports.actualizar = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return noEncontrada(res);

    const tarea = await Tarea.findById(id);
    if (!tarea || tarea.propietario.toString() !== res.locals.usuario.sub) return noEncontrada(res);

    const { errores, datos, valores } = validar(req.body);
    if (Object.keys(errores).length) {
      return res
        .status(400)
        .render('tareas/formulario', { titulo: 'Editar tarea', tarea, errores, valores });
    }

    tarea.set(datos);
    await tarea.save();
    res.setFlash('ok', 'Tarea actualizada. ✅');
    res.redirect(`/tareas/${tarea._id}`);
  } catch (err) {
    next(err);
  }
};

exports.eliminar = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return noEncontrada(res);

    const tarea = await Tarea.findById(id);
    // admin puede borrar de cualquiera; user solo las suyas
    const permitido =
      tarea &&
      (tarea.propietario.toString() === res.locals.usuario.sub || esAdmin(res.locals.usuario));
    if (!permitido) return noEncontrada(res);

    await tarea.deleteOne();
    res.setFlash('ok', 'Tarea eliminada. 🗑️');
    res.redirect('/tareas');
  } catch (err) {
    next(err);
  }
};

module.exports.ESTADOS = ESTADOS;
