const express = require("express")
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { authMiddleware, adminOnly, signToken } = require("../middlewares/auth");

const projectRouter = express.Router();

// Protects all rotes in this router
projectRouter.use(authMiddleware);

projectRouter.get("/", getAllProjects);

projectRouter.get("/:projectId", getProjectById);

projectRouter.post("/", createProject);

projectRouter.put("/:projectId", updateProject);

projectRouter.delete("/:projectId", deleteProject);

module.exports = projectRouter;
