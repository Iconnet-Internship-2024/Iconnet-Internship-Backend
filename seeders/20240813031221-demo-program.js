"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "programs",
      [
        {
          name: "PKL",
          description:
            "Program praktik kerja lapangan yang ditujukan kepada siswa/i SMA/SMK.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Magang",
          description: "Program magang yang ditujukan kepada mahasiswa.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("programs", null, {});
  },
};
