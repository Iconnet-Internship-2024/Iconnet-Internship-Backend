"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class job_division extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.submission, {
        foreignKey: "job_division_id",
      });
    }
  }
  job_division.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "job_division",
    }
  );
  return job_division;
};
