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
      this.hasOne(models.data_diri, {
        foreignKey: 'user_id',
      });
      this.hasOne(models.admin, {
        foreignKey: 'user_id',
      });
      this.hasMany(models.pengajuan, {
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
      defaulValue: 'user',
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};