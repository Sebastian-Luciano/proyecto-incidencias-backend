import { models } from '../models/model.index.js';
import fs from 'fs';
import path from 'path';

const { Incidence, User } = models;

export const createIncidence = async (req, res) => {
  try {
    console.log('Cuerpo de la solicitud:', req.body);
    console.log('Archivo:', req.file);

    const { subject, type, description, latitude, longitude } = req.body;
    const image = req.file ? req.file.filename : null;


    const safeJSONParse = (jsonString) => {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.error(`Error parsing JSON: ${jsonString}`, error);
        return jsonString;
      }
    };

    const parsedSubject = safeJSONParse(subject);
    const parsedType = safeJSONParse(type);
    const parsedDescription = safeJSONParse(description);
    const parsedLatitude = latitude ? parseFloat(safeJSONParse(latitude)) : null;
    const parsedLongitude = longitude ? parseFloat(safeJSONParse(longitude)) : null;

    console.log('Datos parseados:', { parsedSubject, parsedType, parsedDescription, parsedLatitude, parsedLongitude });

    if (!parsedSubject || !parsedType || !parsedDescription) {
      return res.status(400).json({ error: 'Datos de incidencia incompletos o inválidos' });
    }

    const incidence = await Incidence.create({
      subject: parsedSubject,
      type: parsedType,
      description: parsedDescription,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      image,
      UserId: req.user.id,
    });

    console.log('Incidencia creada:', incidence);

    // Enviar notificación
    try {
      await sendNotification('Nueva incidencia creada', req.user.id);
      console.log('Notificación enviada con éxito');
    } catch (notificationError) {
      console.error('Error al enviar notificación:', notificationError);
    }

    res.status(201).json(incidence);
  } catch (error) {
    console.error('Error al crear la incidencia:', error);
    res.status(500).json({
      error: 'Ocurrió un error al crear la incidencia',
      details: error.message,
      stack: error.stack
    });
  }
};

export const getIncidences = async (req, res) => {
  try {
    const incidences = await Incidence.findAll({
      where: req.user.isAdmin ? {} : { UserId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'lastName', 'photo']
      }]
    });
    res.json(incidences);
  } catch (error) {
    console.error('Error al obtener incidencias:', error);
    res.status(500).json({ message: 'Error al obtener incidencias', error: error.message });
  }
};

export const updateIncidence = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, type, description, status, latitude, longitude } = req.body;
    const incidence = await Incidence.findByPk(id);
    if (!incidence) {
      return res.status(404).json({ message: 'Incidence not found' });
    }
    if (!req.user.isAdmin && incidence.UserId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await incidence.update({ subject, type, description, status, latitude, longitude });
    res.json(incidence);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update incidence', error: error.message });
  }
};

export const deleteIncidence = async (req, res) => {
  try {
    const { id } = req.params;
    const incidence = await Incidence.findByPk(id);
    if (!incidence) {
      return res.status(404).json({ message: 'Incidence not found' });
    }
    if (!req.user.isAdmin && incidence.UserId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (incidence.image) {
      await fs.unlink(`uploads/${incidence.image}`, (err) => {
        if (err) {
          console.error('Error eliminando el archivo:', err);
        }
      });
    }
    await incidence.destroy();
    res.json({ message: 'Incidence deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete incidence', error: error.message });
  }
};