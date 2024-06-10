'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pengajuan extends Model {
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
  pengajuan.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    divisi:  { 
      type: DataTypes.ENUM('Administrasi', 'Teknisi')
    },
    from: DataTypes.DATE,
    to: DataTypes.DATE,
    surat_pengantar: DataTypes.STRING,
    transkrip_nilai: DataTypes.STRING,
    proposal: DataTypes.STRING,
    foto: DataTypes.STRING,
    status:  { 
      type: DataTypes.ENUM('Sedang Diproses', 'Diterima', 'Ditolak')
    },
  }, {
    sequelize,
    modelName: 'pengajuan',
    tableName: 'pengajuan'
  });
  return pengajuan;
};