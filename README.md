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
├── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── scripts/
│ └── app.js
├── .env
├── package.json

## 🚀 Instalación y Ejecución

1. Clona el repositorio:

```bash
git clone https://github.com/Sebastian-Luciano/proyecto-incidencias-backend.git
cd proyecto-incidencias-backend

2. Instala las dependencias:
npm install

3. Crea un archivo .env en la raíz del proyecto con la siguiente variable:
VITE_API_URL=http://localhost:3000/api

4. Ejecuta el proyecto:
npm run dev
