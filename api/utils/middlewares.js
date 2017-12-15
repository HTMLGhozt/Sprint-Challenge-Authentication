const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/userModels');
const { mysecret } = require('../../config');
const SaltRounds = 11;

const authenticate = (req, res, next) => {
  const token = req.get('Authorization');
  console.log(token, mysecret);
  if (token) {
    console.log(jwt.decode(token, {complete:true}));
    jwt.verify(token, mysecret, (err, decoded) => {
      if (err) return res.status(422).json(err);
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).json({
      error: 'No token provided, must be set on the Authorization Header'
    });
  }
};

const encryptUserPW = (req, res, next) => {
  const { username, password } = req.body;
  // https://github.com/kelektiv/node.bcrypt.js#usage
  // TODO: Fill this middleware in with the Proper password encrypting, bcrypt.hash()
  // Once the password is encrypted using bcrypt, you'll need to save the user the DB.
  // Once the user is set, take the savedUser and set the returned document from Mongo on req.user
  // call next to head back into the route handler for encryptUserPW
  if (!password) return res.status(500).json(err);

  bcrypt
    .hash(password, SaltRounds)
    .then((pass) => {
      const newUser = new User({ username, password: pass });
      req.user = { username, password: pass };
      next();
    })
    .catch(err => res.status(422).json(err));

};

const compareUserPW = (req, res, next) => {
  const { username, password } = req.body;
  // https://github.com/kelektiv/node.bcrypt.js#usage
  // TODO: Fill this middleware in with the Proper password comparing, bcrypt.compare()
  // You'll need to find the user in your DB
  // Once you have the user, you'll need to pass the encrypted pw and the plaintext pw to the compare function
  // If the passwords match set the username on `req` ==> req.username = user.username; and call next();
  User
    .findOne({ username })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (!result) throw new Error;
          req.username = user.username;
          next();
        })
        .catch(err => res.status(422).json(err));
    })
    .catch(err => res.status(422).json(err))
};

module.exports = {
  authenticate,
  encryptUserPW,
  compareUserPW
};
