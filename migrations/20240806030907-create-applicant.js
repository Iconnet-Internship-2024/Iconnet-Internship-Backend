"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("applicants", {
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
      photo: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      place_of_birth: {
        type: Sequelize.STRING,
      },
      date_of_birth: {
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.ENUM("male", "female"),
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      religion: {
        type: Sequelize.ENUM(
          "islam",
          "kristen",
          "katolik",
          "hindu",
          "buddha",
          "konghucu",
          "lainnya"
        ),
      },
      education_degree: {
        type: Sequelize.ENUM(
          "D1",
          "D2",
          "D3",
          "D4",
          "S1",
          "S2",
          "S3",
          "SMK",
          "SMA"
        ),
      },
      student_id: {
        type: Sequelize.STRING,
      },
      education_institution: {
        type: Sequelize.STRING,
      },
      education_major: {
        type: Sequelize.STRING,
      },
      education_faculty: {
        type: Sequelize.STRING,
      },
      education_transcript: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("applicants");
  },
};
