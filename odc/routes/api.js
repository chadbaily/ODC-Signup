// Import dependencies
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

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
  membershipType: Membership,
  isActiveOnWeb: Boolean
});

// create mongoose model
const User = mongoose.model("User", userSchema);

/* GET api listing. */
router.get("/", (req, res) => {
  res.send("api works");
});

/* GET all users. */
router.get("/users", (req, res) => {
  User.find({}, (err, users) => {
    if (err) res.status(500).send(error);

    res.status(200).json(users);
  });
});

/* GET one users. */
router.get("/users/:id", (req, res) => {
  User.findById(req.param.id, (err, users) => {
    if (err) res.status(500).send(error);

    res.status(200).json(users);
  });
});

/* Create a user. */
router.post("/users", (req, res) => {
  let user = new User({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    birthDate: req.body.birthDate,
    uvaStudent: req.body.uvaStudent,
    addrStreet: req.body.addrStreet,
    addrCity: req.body.addrCity,
    addrZip: req.body.addrZip,
    phoneNumber: req.body.phoneNumber,
    hasAgreedToWaiver: req.body.hasAgreedToWaiver,
    agreedToWaiverTime: req.body.agreedToWaiverTime,
    membershipType: req.body.membershipType,
    isActiveOnWeb: req.body.isActiveOnWeb
  });

  user.save(error => {
    if (error) res.status(500).send(error);

    res.status(201).json({
      message: "User created successfully"
    });
  });
});

/* Delete a user from the DB */
router.post("/deleteUser", (req, res) => {
  User.deleteOne(
    {
      email: req.body.email,
      password: req.body.password,
      birthDate: req.body.birthDate
    },
    (err, obj) => {
      if (err) obj.status(500).send(error);

      res.status(201).json({
        message: "User deleted successfully"
      });
    }
  );
});

module.exports = router;
