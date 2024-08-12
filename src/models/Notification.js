import { DataTypes, Model } from "sequelize";

class Notification extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      incidenceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Incidences',
          key: 'id'
        }
      },
      type: {
        type: DataTypes.ENUM('email', 'sms', 'system'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'sent', 'failed'),
        defaultValue: 'pending',
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    }, {
      sequelize,
      modelName: 'Notification',
      tableName: 'Notifications',
      timestamps: true,
    });
  }

  static associate(models) {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Notification.belongsTo(models.Incidence, {
      foreignKey: 'incidenceId',
      as: 'incidence'
    });
  }
}

export default Notification;