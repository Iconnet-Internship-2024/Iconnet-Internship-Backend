"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "admin1",
          email: "admin1@mail.com",
          password: "admin123",
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "user1",
          email: "user1@mail.com",
          password: "user123",
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
