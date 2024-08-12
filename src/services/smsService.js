// Aquí puedes usar un servicio real de SMS como Twilio, o simular el envío
export const sendSMS = async (to, body) => {
  // Simulación de envío de SMS
  console.log(`Simulando envío de SMS a ${to}: ${body}`);
  
  // Descomenta el siguiente bloque si usas Twilio
  /*
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    console.log('SMS enviado con éxito:', message.sid);
  } catch (error) {
    console.error('Error al enviar SMS:', error);
    throw error;
  }
  */
};