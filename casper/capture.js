
// configuration of database ===========================================
var mongoose = require('mongoose'); // mongoose for mongodb
var database = require('./config/database'); // load the database config

mongoose.connect(process.env.MONGOLAB_SILVER_URI || database.localUrl); // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
mongoose.connection.on('error', console.error.bind(console, 'Mongo Error: '));

var casper = require('casper').create();

casper.start('http://www.outdoorsatuva.org/members/join/', function() {
  this.fillSelectors(
    '#theform',
    {
      'input[name="firstName"]': 'Chad',
      'input[name="lastName"]': 'Baily',
      'input[id="student1"]': '1',
      'input[id="dob"]': '1998-02-08',
      'input[id="emailAddress"]': 'test@test.com',
      'input[id="confirmEmailAddress"]': 'test@test.com',
      'input[id="password1"]': 'blah',
      'input[id="password2"]': 'blah'
    },
    true
  );
  this.capture('test.png');
});

casper.run();
