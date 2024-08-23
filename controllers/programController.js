const { program } = require("../models");

module.exports = {
  getAllPrograms: async (req, res) => {
    try {
      const programs = await program.findAll();
      res.status(200).json({
        message: "Get All Programs",
        data: programs,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getProgramById: async (req, res) => {
    try {
      const { id } = req.params;

      const programData = await program.findByPk(id);

      if (!programData) {
        return res.status(404).json({
          status: "failed",
          message: "Program not found",
        });
      }

      res.status(200).json({
        status: "Successfully get program data",
        data: programData,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  addProgram: async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      const newProgram = await program.create({
        name: name,
        description: description,
      });

      res.status(200).json({
        message: "Successfully added program",
        data: newProgram,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  updateProgram: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const existingProgram = await program.findByPk(id);

      if (!existingProgram) {
        return res.status(404).json({
          status: "failed",
          message: "Program not found",
        });
      }

      const [updated] = await program.update(
        {
          name: name || existingProgram.name,
          description: description || existingProgram.description,
        },
        { where: { id: id } }
      );

      if (updated === 0) {
        return res.status(404).json({
          status: "failed",
          message: "No changes made to program",
        });
      } else {
        const updatedProgram = await program.findByPk(id);
        res.status(200).json({
          message: "Successfully updated program",
          data: updatedProgram,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  deleteProgram: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      const existingProgram = await program.findByPk(id);

      if (!existingProgram) {
        return res.status(404).json({
          status: "failed",
          message: "Program not found",
        });
      }

      await program.destroy({ where: { id: id } });

      res.status(200).json({
        message: "Successfully deleted program",
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },
};
