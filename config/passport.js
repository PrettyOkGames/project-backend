const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
 
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL, // e.g., 'http://localhost:3001/api/users/auth/github/callback'
    },
    // This is the "verify" callback
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        
        // The "profile" object contains the user's GitHub information
        const existingUser = await User.findOne({ githubId: profile.id });
 
        if (existingUser) {
          // If user already exists, pass them to the next middleware
          return done(null, existingUser);
        }
 
        // If it's a new user, create a record in our database
        const newUser = new User({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails ? profile.emails[0].value : 'test@mail.com', 
          // Some providers return an array of emails
          password: Math.random().toString(36).slice(-8)
        });

        console.log(newUser);
 
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);
 
// These functions are needed for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});
 
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});