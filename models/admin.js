"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  admin.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      nama: DataTypes.STRING,
      no_hp: DataTypes.INTEGER,
      jabatan: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "admin",
      tableName: "admin",
    }
  );
  return admin;
};
