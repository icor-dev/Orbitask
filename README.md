# 🪐 Orbitask

**Organiza tu día. Mantén tus tareas en órbita.**

Aplicación web full-stack con Node.js, Express y MongoDB: gestor de tareas con autenticación JWT, roles (user/admin) y vistas dinámicas.

## Funcionalidades

- Registro y login de usuarios con JWT (cookie httpOnly) y contraseñas hasheadas con bcrypt
- CRUD completo de tareas (crear, ver lista y detalle, editar, eliminar) sobre MongoDB
- Roles: `user` gestiona únicamente sus tareas; `admin` ve y elimina las de todos
- Mensajes flash, middelware de protección de rutas y manejo global de errores
- Desplegada en producción (Render + HTTPS automático)

## Tecnologías

- Node.js 22+
- Express (servidor y rutas)
- EJS (vistas dinámicas: layout + partials)
- Mongoose + MongoDB Atlas (base de datos)
- JSON Web Tokens (jsonwebtoken) + bcryptjs
- cookie-parser
- Despliegue: Render

## Enlace en producción

_(se publica al desplegar en Render — aparecerá aquí como `https://orbitask-xxxx.onrender.com`)_

## Instalación local

1. Clona el repo y instala dependencias: `npm install` (o `pnpm install`)
2. Crea tu base de datos gratis en [MongoDB Atlas](https://www.mongodb.com/atlas) y copia la cadena de conexión
3. Crea un archivo `.env` (puedes partir de `.env.example`) con:

   ```
   MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/orbitask
   JWT_SECRET=una-frase-larga-y-aleatoria
   ```

4. Levanta la app: `npm run dev` (o `npm start`)

> El **primer usuario registrado se convierte en admin** automáticamente. Los demás admins se promueven editando su documento en la base de datos.

## Estructura (MVC)

```
config/        Conexión a la base de datos
controllers/   authController, tareaController
middlewares/   Protección JWT, flash, manejo de errores
models/        User, Tarea (Mongoose)
public/        CSS y estáticos
routes/        auth.js, tareas.js
views/         Vistas EJS (layout + partials + páginas)
```
