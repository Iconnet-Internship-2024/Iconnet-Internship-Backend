"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reset_token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  reset_token.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        unique: true,
      },
      token: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "reset_token",
    }
  );
  return reset_token;
};
