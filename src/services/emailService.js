import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
  } else if (process.env.EMAIL_SERVICE === 'outlook') {
    return nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASS
      }
    });
  }
};

export const sendEmail = async (to, subject, text) => {
  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text
    });
    console.log('Email enviado con éxito');
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw error;
  }
};
