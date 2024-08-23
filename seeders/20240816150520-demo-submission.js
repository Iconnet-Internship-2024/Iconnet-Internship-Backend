'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("submissions", [
      {
        user_id: 1,
        job_division_id: 1,
        program_id: 1,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        cover_letter: "cover_letter_1.pdf",
        proposal: "proposal_1.pdf",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        user_id: 2,
        job_division_id: 2,
        program_id: 1,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 2)),
        cover_letter: "cover_letter_2.pdf",
        proposal: "proposal_2.pdf",
        status: "in_process",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        user_id: 3,
        job_division_id: 3,
        program_id: 1,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        cover_letter: "cover_letter_3.pdf",
        proposal: "proposal_3.pdf",
        status: "accepted",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        user_id: 4,
        job_division_id: 4,
        program_id: 1,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 4)),
        cover_letter: "cover_letter_4.pdf",
        proposal: "proposal_4.pdf",
        status: "rejected",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        user_id: 5,
        job_division_id: 5,
        program_id: 1,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 5)),
        cover_letter: "cover_letter_5.pdf",
        proposal: "proposal_5.pdf",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        user_id: 6,
        job_division_id: 1,
        program_id: 2,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        cover_letter: "cover_letter_6.pdf",
        proposal: "proposal_6.pdf",
        status: "in_process",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        user_id: 7,
        job_division_id: 2,
        program_id: 2,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 2)),
        cover_letter: "cover_letter_7.pdf",
        proposal: "proposal_7.pdf",
        status: "accepted",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        user_id: 8,
        job_division_id: 3,
        program_id: 2,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 4)),
        cover_letter: "cover_letter_8.pdf",
        proposal: "proposal_8.pdf",
        status: "rejected",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        user_id: 9,
        job_division_id: 4,
        program_id: 2,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        cover_letter: "cover_letter_9.pdf",
        proposal: "proposal_9.pdf",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        user_id: 10,
        job_division_id: 5,
        program_id: 2,
        start_date: new Date(),
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        cover_letter: "cover_letter_10.pdf",
        proposal: "proposal_10.pdf",
        status: "accepted",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("submissions", null, {});
  }
};
