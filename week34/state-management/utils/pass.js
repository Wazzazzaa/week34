'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

// fake database: ****************
const users = [
  {
    user_id: 1,
    name: 'Foo Bar',
    email: 'foo@bar.fi',
    password: 'foobar',
  },
  {
    user_id: 2,
    name: 'Bar Foo',
    email: 'bar@foo.fi',
    password: 'barfoo',
  },
];
// *******************

// fake database functions *********
const getUser = (id) => {
  const user = users.filter((usr) => {
    if (usr.user_id === id) {
      return usr;
    }
  });
  return user[0];
};

const getUserLogin = (email) => {
  const user = users.filter((usr) => {
    if (usr.email === email) {
      return usr;
    }
  });
  return user[0];
};
// *****************

// serialize: store user id in session
passport.serializeUser((id, done) => {
  console.log('serialize', id);
  done(null, user.id);
});

// deserialize: get user id from session and get all user data
passport.deserializeUser(async (id, done) => {
  getUser(id, function(err, user) {
  console.log('deserialize', user);
    done(err, user);
  });
});

passport.use(new Strategy(
    (username, password, done) => {
      getUserLogin({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user.user_id);
      });
    }
));
passport.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = passport;