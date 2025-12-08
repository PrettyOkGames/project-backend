const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expiration = "24h";

function authMiddleware(req, res, next) {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.body?.token || req.query?.token || req.headers?.authorization;

  // We split the token string into an array and return actual token
  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  if (!token) {
    return res.status(403).json({message: "Please Login or Register" })
    // next();
  }

  // If token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch {
    console.log("Invalid token");
  }

  // Return the request object so it can be passed to the resolver as `context`
  //   return req;
  next();
}

function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
}

function signToken({ username, email, _id }) {
  const payload = { username, email, _id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

module.exports = {
  authMiddleware,
  adminOnly,
  signToken,
};
