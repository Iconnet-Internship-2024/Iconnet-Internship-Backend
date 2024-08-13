"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class program extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.submission, {
        foreignKey: "program_id",
      });
    }
  }
  program.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "program",
    }
  );
  return program;
};
