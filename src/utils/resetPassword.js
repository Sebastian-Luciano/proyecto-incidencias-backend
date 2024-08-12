import db from '../utils/database.js';

const updatePassword = async () => {
  const newHash = '$2b$10$JGdUwjCC6JJHv.xzbvUWxehxHepj7lEjMdWdDYlDq/6ji4BdJ3PVq';
  const email = 'admin@example.com';

  try {
    await db.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [newHash, email]
    );
    console.log('Contraseña actualizada con éxito');
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
  }
};

updatePassword();


//ejecútalo con Node.js