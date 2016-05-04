import passport from 'passport';
import { Strategy } from 'passport-github';
import User from './../models/user.js';
import { GITHUB_ID, GITHUB_SECRET } from './../GITHUBKEYS.js';
import bcrypt from 'bcrypt';

export default {
  handleLogin: passport.authenticate('github'),
  authenticateLogin: passport.authenticate('github', { failureRedirect: '/login' }),
};


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

passport.use(new Strategy({

  clientID: GITHUB_ID,
  clientSecret: GITHUB_SECRET,
  callbackURL: '/auth/github/callback',
  userAgent: 'localhost:8000',
  scope: 'user, public_repo, repo, admin:org',
  // userAgent: 'AppButler.io',
  passReqToCallback: true,
}, (req, accessToken, refreshToken, tokenDetails, profile, done) => {
  // refreshToken is not provided by GitHub
  console.log(`${profile.username}: login successful with access token:${accessToken}`);
  done(null, profile); // Reports a successful authentication to successfulRedirect

  User.findOne({ githubID: profile.username }, (err, existingUser) => {
    if (existingUser) {
      // Login the user
      console.log('User found, login user');
      done(null, existingUser);
    } else {
      // user not found, store to database
      const saltRounds = 10;
      bcrypt.hash(accessToken, saltRounds, (err2, hash) => {
        if (err2) {
          console.log(err2);
        } else {
          const newUser = new User({
            name: profile._json.name,
            id: profile._json.id, // ADD
            email: profile._json.email,
            githubID: profile.username,
            encryptedToken: hash,
          });
          newUser.save((err3, addedUser) => {
            if (err3) {
              return err3;
            }
            console.log(addedUser + ' has been saved');
          });
        }
      });
    }
  });
}));
