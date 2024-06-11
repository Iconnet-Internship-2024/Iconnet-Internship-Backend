"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "pengajuan",
      [
        {
          user_id: 1,
          divisi: "Administrasi",
          from: new Date("2024-06-01"),
          to: new Date("2024-07-01"),
          surat_pengantar: "surat_pengantar_1.pdf",
          transkrip_nilai: "transkrip_nilai_1.pdf",
          proposal: "proposal_1.pdf",
          foto: "foto_1.jpg",
          status: "Sedang Diproses",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          divisi: "Teknisi",
          from: new Date("2024-06-15"),
          to: new Date("2024-07-15"),
          surat_pengantar: "surat_pengantar_2.pdf",
          transkrip_nilai: "transkrip_nilai_2.pdf",
          proposal: "proposal_2.pdf",
          foto: "foto_2.jpg",
          status: "Diterima",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 1,
          divisi: "Administrasi",
          from: new Date("2024-07-01"),
          to: new Date("2024-08-01"),
          surat_pengantar: "surat_pengantar_3.pdf",
          transkrip_nilai: "transkrip_nilai_3.pdf",
          proposal: "proposal_3.pdf",
          foto: "foto_3.jpg",
          status: "Ditolak",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("pengajuan", null, {});
  },
};
