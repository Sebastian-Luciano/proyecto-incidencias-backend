import { models } from '../models/model.index.js';
import { sendEmail } from '../services/emailService.js';
import { sendSMS } from '../services/smsService.js';

const { Notification, User, Incidence } = models;

export const createNotification = async (req, res) => {
  try {
    const { message, userId, incidenceId, type } = req.body;
    const notification = await Notification.create({
      message,
      userId,
      incidenceId,
      type,
      status: 'pending',
      read: false
    });
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({ message: 'Error al crear notificación', error: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.findAll({ 
      where: { userId, type: 'system' },
      include: [
        { model: Incidence, as: 'incidence' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ message: 'Error al obtener notificaciones', error: error.message });
  }
};

export const sendNotification = async (incidenceId, action) => {
  try {
    const incidence = await Incidence.findByPk(incidenceId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!incidence) {
      throw new Error('Incidencia no encontrada');
    }

    const { user, subject, status } = incidence;
    let message = '';

    switch (action) {
      case 'created':
        message = `Nueva incidencia creada: ${subject}`;
        break;
      case 'in_progress':
        message = `Incidencia en proceso: ${subject}`;
        break;
      case 'resolved':
        message = `Incidencia resuelta: ${subject}`;
        break;
      default:
        message = `Actualización de incidencia: ${subject}`;
    }

    // Crear notificación en la base de datos (notificación del sistema)
    await Notification.create({
      message,
      userId: user.id,
      incidenceId,
      type: 'system',
      status: 'sent',
      read: false
    });

    // Enviar notificación por email
    try {
      await sendEmail(user.email, `Actualización de Incidencia: ${subject}`, message);
      await Notification.create({
        message,
        userId: user.id,
        incidenceId,
        type: 'email',
        status: 'sent',
        read: false
      });
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      await Notification.create({
        message,
        userId: user.id,
        incidenceId,
        type: 'email',
        status: 'failed',
        read: false
      });
    }

    // Enviar notificación por SMS
    if (user.mobilePhone) {
      try {
        await sendSMS(user.mobilePhone, message);
        await Notification.create({
          message,
          userId: user.id,
          incidenceId,
          type: 'sms',
          status: 'sent',
          read: false
        });
      } catch (smsError) {
        console.error('Error al enviar SMS:', smsError);
        await Notification.create({
          message,
          userId: user.id,
          incidenceId,
          type: 'sms',
          status: 'failed',
          read: false
        });
      }
    }

    console.log('Notificaciones enviadas con éxito');
  } catch (error) {
    console.error('Error al enviar notificaciones:', error);
    throw error;
  }
};