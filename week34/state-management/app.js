'use strict';
const express = require('express');
const app = express();
const port = 3000;
const username = 'foo';
const password = 'bar';
const passport = require('./utils/pass');
const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};

app.set('views', './views');
app.set('view engine', 'pug');
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/form', (req, res) => {
  res.render('views/form.pug');
});
app.get('/secret', loggedIn, (req, res) => {
  res.render('secret');
});

/*app.get('/secret', (req, res) => {
  res.render('views/secret.pug');
});*/

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
      console.log('success');
      res.redirect('/secret');
    });

/*app.post('/login', (req, res) => {
  if(req.body(username,password,{ signed: true })){
 res.redirect('/secret')
  }else{
res.redirect('/form')}
});*/

app.get('/setCookie', (req, res) => {
  res.cookie('clr',{domain:'color' });
});
app.get('/deleteCookie', (req, res) => {
  res.clearCookie('clr', { });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
