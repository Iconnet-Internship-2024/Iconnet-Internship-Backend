'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.admin, { foreignKey: 'user_id', as: 'admin' });
      User.hasOne(models.data_diri, { foreignKey: 'user_id', as: 'data_diri' });
      User.hasMany(models.pengajuan, { foreignKey: 'user_id', as: 'pengajuan' });
      User.hasMany(models.riwayat_log, { foreignKey: 'user_id', as: 'riwayat_logs' });

      this.hasOne(models.data_diri, {
        foreignKey: 'user_id',
      });
      this.hasOne(models.admin, {
        foreignKey: 'user_id',
      });
      this.hasOne(models.pengajuan, {
        foreignKey: 'user_id',
      });
      this.hasMany(models.riwayat_log, {
        foreignKey: 'user_id',
      });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin','user'),
      defaultValue: 'user',
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};