const express = require("express")
const {
  getAllTaskss,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { authMiddleware, adminOnly, signToken } = require("../middlewares/auth")

const taskRouter = express.Router()

// Protects all rotes in this router
taskRouter.use(authMiddleware)

taskRouter.get("/", getAllTaskss)

taskRouter.get("/:projectId", getTaskById)

taskRouter.post("/", createTask)

taskRouter.put("/:projectId", updateTask)

taskRouter.delete("/:projectId", deleteTask)

module.exports = taskRouter
