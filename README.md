<div align="center">

# 🪐 Orbitask

**Organiza tu día. Mantén tus tareas en órbita.**

Aplicación web full-stack con Node.js, Express y MongoDB: gestor de tareas con autenticación JWT, roles (user/admin) y vistas dinámicas.

[![Producción](https://img.shields.io/badge/Demo%20en%20producci%C3%B3n-4f46e5?style=flat-square&logo=link&logoColor=white)](https://orbitask-y787.onrender.com)
![Licencia](https://img.shields.io/badge/Licencia-MIT-181717?style=flat-square&logo=github&logoColor=white)
![Enunciado](https://img.shields.io/badge/Proyecto%20Final%20Optativo%20Node.js%E2%80%94UCI-181717?style=flat-square&logo=school&logoColor=white)

### 🧰 Tecnologías

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4170E?style=flat-square&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white)
![Render](https://img.shields.io/badge/Render-46A399?style=flat-square&logo=render&logoColor=white)

</div>

---

## ✨ Funcionalidades

- **Registro y login** de usuarios con JWT (cookie `httpOnly`) y contraseñas hasheadas con `bcryptjs`
- **CRUD completo de tareas** (crear, listar con detalle, editar, eliminar) sobre MongoDB
- **Dos roles**: `user` gestiona únicamente sus tareas; `admin` ve y elimina las de todos
- **Primer usuario registrado se convierte en `admin`** automáticamente
- Mensajes **flash**, middleware de protección de rutas y manejo global de errores
- Desplegada en producción con **HTTPS** automático (Render)

## 🚀 Demo en producción

➡️ [**https://orbitask-y787.onrender.com**](https://orbitask-y787.onrender.com)

> La instancia es gratis (plan Free de Render): si estuvo inactiva, tarda ~1 minuto en responder (arranque en frío).

## 🛠️ Instalación local

1. Clona el repo e instala dependencias:

   ```bash
   git clone https://github.com/icor-dev/Orbitask.git
   cd Orbitask
   npm install
   ```

2. Crea tu base de datos gratis en [MongoDB Atlas](https://www.mongodb.com/atlas) y copia tu cadena de conexión (reemplaza `<contraseña>` y agrega el nombre de la base, por ejemplo `/orbitask`)
3. Crea un archivo `.env` (partiendo de `.env.example`) con:

   ```env
   MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/orbitask
   JWT_SECRET=una-frase-larga-y-aleatoria
   ```

4. Levanta la app:

   ```bash
   npm run dev
   ```

   Se abre en `http://localhost:3000`.

> 🔑 El **primer usuario registrado se convierte en admin** automáticamente. Los otros admins se promueven editando directamente el documento en la base de datos.

## 📂 Estructura (MVC)

```
config/        Conexión a la base de datos
controllers/   authController, tareaController
middlewares/   Protección JWT, flash, manejo de errores
models/        User, Tarea (Mongoose)
public/        CSS y estáticos
routes/        auth.js, tareas.js
views/         Vistas EJS (partials + páginas)
```

## 🧪 Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Redirige al login / tareas |
| `GET` + `POST` | `/registro` · `/login` | Autenticación |
| `POST` | `/logout` | Cerrar sesión |
| `GET` | `/tareas` | Lista (todas si eres admin) |
| `GET` + `POST` | `/tareas/nueva` | Crear tarea |
| `GET` | `/tareas/:id` | Detalle |
| `GET` + `POST` | `/tareas/:id/editar` | Editar (solo dueño) |
| `POST` | `/tareas/:id/eliminar` | Eliminar (dueño o admin) |
| `GET` | `/salud` | Health check |

---

<div align="center">

Hecho con 🪐 por [@icor-dev](https://github.com/icor-dev) · Proyecto Final de Optativo de Node.js (Temas 10) · UCI

</div>
