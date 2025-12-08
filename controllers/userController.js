const User = require("../models/User");
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const expiration = '24h'; // Token will be valid for 24 hours

async function getAllUsers(req, res) {
  console.log(req.user);

  if (!req.user) {
    return res.status(401).json({ message: 'You must be logged in to see this!' });
  }
  
  const users = await User.find({});
  res.json(users);
}

function getUserById(req, res) {
  res.send(`Data for user: ${req.params.id}`);
}

async function registerUser(req, res) {
  try {
    // check if user exists
    const dbUser = await User.findOne({ email: req.body.email });

    if (dbUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Create new user
    const user = await User.create(req.body);
    console.log(user);

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check if user doesn't exist
    const dbUser = await User.findOne({ email: email });

    if (!dbUser) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    const passwordMatched = await dbUser.isCorrectPassword(password);

    if (!passwordMatched) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    // Create Payload
    const payload = {
      _id: dbUser._id,
      username: dbUser.username,
      email: dbUser.email,
      role: dbUser.role
    }

    // Create Token
    const token = jwt.sign({data: payload}, secret, {expiresIn: expiration});

    res.json({token, user: dbUser});

  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
};
