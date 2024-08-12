import { DataTypes, Model } from "sequelize";

class Incidence extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('maintenance', 'security', 'cleaning'),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'resolved'),
        defaultValue: 'pending',
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    }, {
      sequelize,
      modelName: 'Incidence',
      timestamps: true,
      paranoid: true,
    });
  }

  static associate(models) {
    Incidence.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'user'
    });
  }
}

export default Incidence;