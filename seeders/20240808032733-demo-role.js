"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "siswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "mahasiswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  },
};
