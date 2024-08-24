"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class submission extends Model {
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
      this.belongsTo(models.job_division, {
        foreignKey: "job_division_id",
      });
      this.belongsTo(models.program, {
        foreignKey: "program_id",
      });
    }
  }
  submission.init(
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
      job_division_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "job_divisions",
          key: "id",
        },
      },
      program_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "programs",
          key: "id",
        },
      },
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      cover_letter: DataTypes.STRING,
      proposal: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("pending", "in_process", "accepted", "rejected"),
        defaultValue: "pending",
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "submission",
      paranoid: true,
      timestamps: true,
    }
  );
  return submission;
};
