"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "job_divisions",
      [
        {
          name: "Default",
          description: "A versatile division, open to participation across all teams.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Engineering",
          description: "Responsible for all technical aspects of the company.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Marketing",
          description: "Handles marketing strategies and customer outreach.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Human Resources",
          description: "Manages employee relations and company policies.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sales",
          description: "Focuses on client relationships and closing deals.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("job_divisions", null, {});
  },
};
