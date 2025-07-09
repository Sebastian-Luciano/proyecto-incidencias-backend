# Backend - Proyecto de Gestión de Incidencias 🚨

Este repositorio contiene el backend del sistema de gestión de incidencias desarrollado como parte de los proyectos del curso Full Stack de FUNVAL.

## 🛠 Tecnologías Utilizadas

- **Node.js**
- **Express**
- **Sequelize ORM**
- **MySQL**
- **JWT** para autenticación
- **bcrypt** para encriptación de contraseñas
- **Dotenv** para variables de entorno

## 📁 Estructura de Carpetas

```
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── scripts/
│   └── app.js
├── .env
├── package.json
```

## 🚀 Instalación y Ejecución

### 1. Clona el repositorio:
```bash
git clone https://github.com/Sebastian-Luciano/proyecto-incidencias-backend.git
cd proyecto-incidencias-backend
```

### 2. Instala las dependencias:
```bash
npm install
```

### 3. Configura las variables de entorno en un archivo `.env`:
```env
PORT=3000
DB_NAME=incidencias_db
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
JWT_SECRET=supersecreto123
```

### 4. Ejecuta el proyecto:
```bash
npm run dev
```

## 🔑 Usuario Administrador por Defecto

⚠️ **Importante**: Se creará automáticamente un usuario administrador:
- **Email**: `admin@example.com`
- **Contraseña**: `AdminPassword123!`

## 🧩 Funcionalidades Principales

- Registro y autenticación de usuarios (JWT)
- Roles diferenciados: administrador y usuario
- Gestión CRUD de incidencias
- Sistema de notificaciones
- Middleware de validación y autorización

## 🗃️ Base de Datos

El proyecto utiliza MySQL con Sequelize ORM. La base de datos se configurará automáticamente al ejecutar el proyecto por primera vez.

## 👤 Autor

**Sebastián Javier Luciano Marceliano**  
🔗 [GitHub](https://github.com/Sebastian-Luciano)  
✉️ [sebastianperu7@gmail.com](mailto:sebastianperu7@gmail.com)

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos como parte del curso de Full Stack Developer en FUNVAL.