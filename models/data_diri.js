'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class data_diri extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
    }
  }
  data_diri.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    nama: DataTypes.STRING,
    kota_kelahiran: DataTypes.STRING,
    tgl_lahir: DataTypes.DATE,
    jenis_kelamin: {
      type: DataTypes.ENUM('Laki-Laki', 'Perempuan')
    },
    no_hp: DataTypes.STRING,
    domisili: DataTypes.TEXT,
    alamat: DataTypes.TEXT,
    agama: { 
      type: DataTypes.ENUM('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Lainnya')
    },
    tingkat_pendidikan: { 
      type: DataTypes.ENUM('SMA', 'SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3')
    },
    nomor_induk: DataTypes.INTEGER,
    intansi: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    fakultas: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'data_diri',
    tableName: 'data_diri'
  });
  return data_diri;
};