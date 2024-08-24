"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("submissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      job_division_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "job_divisions",
          key: "id",
        },
      },
      program_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "programs",
          key: "id",
        },
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      cover_letter: {
        type: Sequelize.STRING,
      },
      proposal: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("pending", "in_process", "accepted", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("submissions");
  },
};
