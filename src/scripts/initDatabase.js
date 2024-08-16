/* import { sequelize, models } from '../models/model.index.js';
import bcrypt from 'bcrypt';

const { User, Incidence, Notification } = models;

const initDatabase = async () => {
  try {
    // Sincronizar sin alterar las tablas existentes
    await sequelize.sync({ alter: true });

    console.log('Base de datos sincronizada');

    // Eliminar todos los índices de email excepto el PRIMARY y uno único
    const [indexes] = await sequelize.query("SHOW INDEX FROM Users WHERE Column_name = 'email'");
    for (const index of indexes) {
      if (index.Key_name !== 'PRIMARY' && index.Key_name !== 'unique_email') {
        await sequelize.query(`DROP INDEX ${index.Key_name} ON Users`);
        console.log(`Índice ${index.Key_name} eliminado`);
      }
    }

     // Asegurar que exista un único índice para email
//    await sequelize.query(`ALTER TABLE Users ADD UNIQUE INDEX IF NOT EXISTS unique_email (email)`);
//    console.log('Índice único para email verificado'); 

    // Verificar si existe un admin
    const adminExists = await User.findOne({ where: { isAdmin: true } });

    if (!adminExists) {
      const adminPassword = 'AdminPassword123!';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const admin = await User.create({
        name: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        mobilePhone: '+1234567890',
        isAdmin: true
      });

      console.log('Admin user created:');
      console.log('Email:', admin.email);
      console.log('Password:', adminPassword);
    } else {
      console.log('Admin user already exists.');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initDatabase; */

import { sequelize, models } from '../models/model.index.js';
import bcrypt from 'bcrypt';

const { User, Incidence, Notification } = models;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};



const initDatabase = async () => {
  try {
    // Sincronizar sin alterar las tablas existentes
    await sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada');

    // Eliminar todos los índices de email excepto el PRIMARY y uno único
    const [indexes] = await sequelize.query("SHOW INDEX FROM Users WHERE Column_name = 'email'");
    for (const index of indexes) {
      if (index.Key_name !== 'PRIMARY' && index.Key_name !== 'unique_email') {
        await sequelize.query(`DROP INDEX ${index.Key_name} ON Users`);
        console.log(`Índice ${index.Key_name} eliminado`);
      }
    }

     // Asegurar que exista un único índice para email
//    await sequelize.query(`ALTER TABLE Users ADD UNIQUE INDEX IF NOT EXISTS unique_email (email)`);
//    console.log('Índice único para email verificado'); 


const userAttributes = await User.describe();
if (!userAttributes.password) {
  console.error('El modelo User no tiene un campo de contraseña');
  process.exit(1);
}

    // Verificar si existe un admin
    const adminExists = await User.findOne({ where: { isAdmin: true } });

    

    if (!adminExists) {
      const adminPassword = 'AdminPassword123!';
      /* const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt); */
      const hashedPassword = await hashPassword(adminPassword);

      const admin = await User.create({
        name: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: hashedPassword,
        mobilePhone: '+1234567890',
        isAdmin: true
      });

      console.log('Admin user created:');
      console.log('Email:', admin.email);
      console.log('Password:', adminPassword);
    } else {
      console.log('Admin user already exists.');
    }

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initDatabase;

