'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('data_diri', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      kota_kelahiran: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tgl_lahir: {
        type: Sequelize.DATE,
        allowNull: false
      },
      jenis_kelamin: {
        type: Sequelize.ENUM('Laki-Laki', 'Perempuan'),
        allowNull: false
      },
      no_hp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      domisili: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      alamat: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      agama: {
        type: Sequelize.ENUM('Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Lainnya'),
        allowNull: false
      },
      kategori: {
        type: Sequelize.ENUM('Pelajar', 'Mahasiswa'),
        allowNull: false
      },
      tingkat_pendidikan: {
        type: Sequelize.ENUM('SMA', 'SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'),
        allowNull: false
      },
      nomor_induk: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      intansi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      jurusan: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fakultas: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('data_diri');
  }
};