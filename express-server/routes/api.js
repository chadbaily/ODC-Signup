// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://database/mean-docker';

// Connect to mongodb
mongoose.connect(dbHost);

const Membership = new mongoose.Schema({
  type: String,
  pricePaid: Number
});

// create mongoose schema
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  gender: String,
  birthDate: Date,
  uvaStudent: Boolean,
  addrStreet: String,
  addrCity: String,
  addrZip: Number,
  phoneNumber: String,
  hasAgreedToWaiver: Boolean,
  agreedToWaiverTime: Date,
  membershipType: Membership
});

// create mongoose model
const User = mongoose.model('User', userSchema);

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');

  User.find({}, (err, users) => {
    if (err) res.status(500).send(error);

    res.status(200).json(users);
  });
});

/* GET all users. */
router.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) res.status(500).send(error);

    res.status(200).json(users);
  });
});

/* GET one users. */
router.get('/users/:id', (req, res) => {
  User.findById(req.param.id, (err, users) => {
    if (err) res.status(500).send(error);

    res.status(200).json(users);
  });
});

/* Create a user. */
router.post('/users', (req, res) => {
  let user = new User({
    email: req.email,
    password: req.password,
    firstName: req.firstName,
    lastName: req.lastName,
    gender: req.gender,
    birthDate: req.birthDate,
    uvaStudent: req.uvaStudent,
    addrStreet: req.addrStreet,
    addrCity: req.addrCity,
    addrZip: req.addrZip,
    phoneNumber: req.phoneNumber,
    hasAgreedToWaiver: req.hasAgreedToWaiver,
    agreedToWaiverTime: req.agreedToWaiverTime,
    membershipType: req.membershipType
  });

  user.save(error => {
    if (error) res.status(500).send(error);

    res.status(201).json({
      message: 'User created successfully'
    });
  });
});

module.exports = router;
