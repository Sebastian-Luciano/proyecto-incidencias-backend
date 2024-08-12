import { sequelize } from '../config/database.js';
import User from './User.js';
import Incidence from './Incidence.js';
import Notification from './Notification.js';

const models = {
  User: User.init(sequelize),
  Incidence: Incidence.init(sequelize),
  Notification: Notification.init(sequelize)
};

Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

export { sequelize, models };