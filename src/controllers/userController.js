import { sequelize } from '../config/database.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';


export const login = async (req, res) => {
  try {
/*     console.log('Password proporcionado:', password);
    console.log('Password almacenado (hash):', user.password);
    console.log('Resultado de la comparación:', isMatch); */
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const register = async (req, res) => {
  try {
    const { name, lastName, email, password, mobilePhone } = req.body;

    const user = await User.create({
      name,
      lastName,
      email,
      password,
      mobilePhone,
      isAdmin: false
    });

    res.status(201).json({ message: 'Usuario registrado con éxito', userId: user.id });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/* export const updateUser = async (req, res) => {
  try {

    console.log('Iniciando actualización de usuario');
    console.log('Datos recibidos:', req.body);
    console.log('Archivo recibido:', req.file);

    const { id } = req.params;
    const updateData = req.body;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (req.file) {
      console.log('Procesando nueva imagen');
      if (user.photo) {
        const oldPhotoPath = path.join(__dirname, '..', '..', 'uploads', user.photo);
        try {
          await fs.unlink(oldPhotoPath);
          console.log('Imagen anterior eliminada');
        } catch (error) {
          console.error('Error al eliminar la foto anterior:', error);
        }
      }
      updateData.photo = req.file.filename;
      console.log('Nueva imagen guardada:', updateData.photo);
    }

    console.log('Actualizando usuario con datos:', updateData);
    const updatedUser = await user.update(updateData);

    const userResponse = { ...updatedUser.toJSON() };
    delete userResponse.password;

    console.log('Usuario actualizado:', userResponse);
    res.json({ message: 'Perfil actualizado con éxito', user: userResponse });
  } catch (error) {
    console.error('Error en actualización de usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}; */


// src/controllers/userController.js



// Estas dos líneas recrean __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verificar si el usuario existe
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    let photoFilename = null;
    if (req.file) {
      // Procesar y guardar el archivo si se proporciona una nueva foto
      photoFilename = `user_${Date.now()}${path.extname(req.file.originalname)}`;
      const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'profiles', photoFilename);
      await fs.mkdir(path.dirname(uploadPath), { recursive: true });
      await fs.writeFile(uploadPath, req.file.buffer);

      // Eliminar la foto anterior si existe
      if (user.photo) {
        const oldPhotoPath = path.join(__dirname, '..', '..', 'uploads', 'profiles', user.photo);
        try {
          await fs.unlink(oldPhotoPath);
        } catch (error) {
          console.error('Error al eliminar la foto anterior:', error);
        }
      }
    }

    // Construir la consulta SQL
    const updateFields = ['name', 'lastName', 'email', 'mobilePhone'];
    const updateValues = [];
    const setStatements = [];

    updateFields.forEach(field => {
      if (updateData[field]) {
        setStatements.push(`${field} = ?`);
        updateValues.push(updateData[field]);
      }
    });

    if (photoFilename) {
      setStatements.push('photo = ?');
      updateValues.push(photoFilename);
    }

    setStatements.push('updatedAt = CURRENT_TIMESTAMP');

    const updateQuery = `UPDATE Users SET ${setStatements.join(', ')} WHERE id = ?`;
    updateValues.push(id);

    // Ejecutar la consulta SQL
    await sequelize.query(updateQuery, {
      replacements: updateValues,
      type: sequelize.QueryTypes.UPDATE
    });

    // Obtener el usuario actualizado
    const updatedUser = await User.findByPk(id);
    const userResponse = { ...updatedUser.toJSON() };
    delete userResponse.password;

    res.json({ message: 'Perfil actualizado con éxito', user: userResponse });
  } catch (error) {
    console.error('Error en actualización de usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // Primero, obtener el usuario y verificar la contraseña actual
    const [user] = await sequelize.query(
      'SELECT * FROM Users WHERE id = ?',
      {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos
    await sequelize.query(
      'UPDATE Users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      {
        replacements: [hashedPassword, id],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    // Generar un nuevo token
    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ message: 'Contraseña actualizada con éxito', token });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};