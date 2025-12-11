const express = require("express")
const {
  getAllUsers,
  getUserById,//
  registerUser,
  loginUser,
} = require("../controllers/userController");
const { authMiddleware, adminOnly, signToken} = require("../middlewares/auth")

const userRouter = express.Router()

userRouter.get("/", authMiddleware, adminOnly, getAllUsers)

userRouter.get("/:id", getUserById)

userRouter.post("/register", registerUser)

userRouter.post("/login", loginUser)

module.exports = userRouter
