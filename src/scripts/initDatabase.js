import { sequelize, models } from '../models/model.index.js';
import bcrypt from 'bcrypt';

const { User } = models;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const initDatabase = async () => {
  try {
    // ✅ SIN alter ni force — para evitar errores con claves duplicadas
    await sequelize.sync();
    console.log('Base de datos sincronizada correctamente');

    // ✅ Validación de atributos (opcional, para seguridad)
    const userAttributes = await User.describe();
    if (!userAttributes.password) {
      console.error('El modelo User no tiene un campo de contraseña');
      process.exit(1);
    }

    // ✅ Crear usuario admin si no existe
    const adminExists = await User.findOne({ where: { isAdmin: true } });

    if (!adminExists) {
      const hashedPassword = await hashPassword('AdminPassword123!');
      const admin = await User.create({
        name: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        mobilePhone: '+1234567890',
        isAdmin: true
      });

      console.log('Usuario administrador creado:');
      console.log('Email:', admin.email);
      console.log('Password:', 'AdminPassword123!');
    } else {
      console.log('Ya existe un usuario administrador.');
    }

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
};

export default initDatabase;
