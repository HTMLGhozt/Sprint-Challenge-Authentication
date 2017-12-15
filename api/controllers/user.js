const User = require('../models/userModels');
const bcrypt = require('bcrypt');

const createUser = (req, res) => {
  // there should be a user object set on req
  // use that req.user object to create a user and save it to our Mongo instance.
  const newUser = new User(req.user);

  newUser
    .save()
    .then((nUser) => {
      res.json(nUser)
    })
    .catch(err => res.status(500).json(err));
};

module.exports = {
  createUser
};
