'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pengajuan', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references : {
          model: 'users',
          key : 'id'
        }
      },
      kategori: {
        type: Sequelize.ENUM('Pelajar', 'Mahasiswa'),
        allowNull: false
      },
      divisi: {
        type: Sequelize.ENUM('Administrasi', 'Teknisi'),
        allowNull: false
      },
      from: {
        type: Sequelize.DATE,
        allowNull: false
      },
      to: {
        type: Sequelize.DATE,
        allowNull: false
      },
      surat_pengantar: {
        type: Sequelize.STRING,
        allowNull: false
      },
      transkrip_nilai: {
        type: Sequelize.STRING,
        allowNull: false
      },
      proposal: {
        type: Sequelize.STRING,
        allowNull: false
      },
      foto: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Sedang Diproses', 'Diterima', 'Ditolak'),
        allowNull: false
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
    await queryInterface.dropTable('pengajuan');
  }
};