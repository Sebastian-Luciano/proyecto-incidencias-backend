import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar que email y password existan
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    // Eliminar espacios en blanco
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Buscar el usuario por email
    const user = await User.findOne({ where: { email: trimmedEmail } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar la contraseña
    const isMatch = await user.validatePassword(trimmedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
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
        isAdmin: user.isAdmin,
        passwordChangeRequired: user.passwordChangeRequired
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      mobilePhone,
      isAdmin: false
    });
    res.status(201).json({ message: 'Usuario registrado con éxito', userId: user.id });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastName, mobilePhone } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await user.update({ name, lastName, mobilePhone });
    res.json({ message: 'Perfil actualizado con éxito' });
  } catch (error) {
    console.error('Error en actualización de usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastName, mobilePhone, photo } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update({ name, lastName, mobilePhone, photo });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error en Actualiar:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}

export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await user.update({ password: hashedPassword });
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Password change failed', error: error.message });
    console.error('Error en el cambio de password:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}

