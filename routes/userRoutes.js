const express = require("express");
const {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
} = require("../controllers/userController");

const { authMiddleware,  adminOnly, signToken} = require("../middlewares/auth");
const passport = require('passport');

const userRouter = express.Router();

userRouter.get("/", authMiddleware, adminOnly, getAllUsers);

userRouter.get("/:id", getUserById);

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);


// Route to start the OAuth flow
// When a user visits this URL, they will be redirected to GitHub to log in.
userRouter.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }) // Request email scope
);


// The callback route that GitHub will redirect to after the user approves.
userRouter.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login', // Where to redirect if user denies
    session: false // We are using tokens, not sessions
  }),
  (req, res) => {
    // At this point, `req.user` is the user profile returned from the verify callback.
    // We can now issue our own JWT to the user.
    const token = signToken(req.user);
    // Redirect the user to the frontend with the token, or send it in the response
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

module.exports = userRouter;
