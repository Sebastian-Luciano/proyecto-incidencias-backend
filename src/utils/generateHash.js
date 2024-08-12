import bcrypt from 'bcrypt';

const password = 'Cl@ve321'; // La nueva contraseña que quieres usar

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
  } else {
    console.log('Nuevo hash de contraseña:', hash);
  }
});


// para ejecutar
// node generateHash.js

//++ Ejecuta una consulta SQL+++
//UPDATE users 
//SET password = 'el_nuevo_hash_que_generaste'
//WHERE email = 'admin@example.com';