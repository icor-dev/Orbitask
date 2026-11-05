const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true, maxlength: 120 },
    descripcion: { type: String, default: '', maxlength: 2000 },
    estado: {
      type: String,
      enum: ['pendiente', 'en_progreso', 'completada'],
      default: 'pendiente',
    },
    fecha: { type: Date, default: Date.now },
    // Reglas de acceso: user gestiona solo sus tareas; admin ve/borra todas (control en controllers)
    propietario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tarea', tareaSchema);
