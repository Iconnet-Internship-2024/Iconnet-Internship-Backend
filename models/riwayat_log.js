"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class riwayat_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  riwayat_log.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      admin_name: DataTypes.STRING,
      judul: DataTypes.STRING,
      deskripsi: DataTypes.TEXT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "riwayat_log",
      tableName: "riwayat_logs",
    }
  );
  return riwayat_log;
};
