"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class applicant extends Model {
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
  applicant.init(
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
      photo: DataTypes.STRING,
      name: DataTypes.STRING,
      place_of_birth: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      gender: DataTypes.ENUM("male", "female"),
      phone_number: DataTypes.STRING,
      city: DataTypes.STRING,
      address: DataTypes.TEXT,
      religion: DataTypes.ENUM(
        "islam",
        "kristen",
        "katolik",
        "hindu",
        "buddha",
        "konghucu",
        "lainnya"
      ),
      education_degree: DataTypes.ENUM(
        "D1",
        "D2",
        "D3",
        "D4",
        "S1",
        "S2",
        "S3",
        "SMK",
        "SMA"
      ),
      student_id: DataTypes.STRING,
      education_institution: DataTypes.STRING,
      education_major: DataTypes.STRING,
      education_faculty: DataTypes.STRING,
      education_transcript: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "applicant",
    }
  );
  return applicant;
};
