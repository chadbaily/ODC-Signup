// // configuration of database ===========================================
// var mongoose = require('mongoose'); // mongoose for mongodb
// var database = require('./config/database'); // load the database config

// mongoose.connect(process.env.MONGOLAB_SILVER_URI || database.localUrl); // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
// mongoose.connection.on('error', console.error.bind(console, 'Mongo Error: '));

var casper = require('casper').create();
/**
 * gender = male
 * gender2 = female
 *
 * student1 = yes
 * student0 = no
 */

casper.selectOptionByValue = function(selector, valueToMatch) {
  this.evaluate(
    function(selector, valueToMatch) {
      var select = document.querySelector(selector),
        found = false;
      Array.prototype.forEach.call(select.children, function(opt, i) {
        if (!found && opt.value.indexOf(valueToMatch) !== -1) {
          select.selectedIndex = i;
          found = true;
        }
      });
      // dispatch change event in case there is some kind of validation
      var evt = document.createEvent('UIEvents'); // or "HTMLEvents"
      evt.initUIEvent('change', true, true);
      select.dispatchEvent(evt);
    },
    selector,
    valueToMatch
  );
};

/**
 * Fill in the user data based on what is sent over
 */
var path = '.';
var xpath = require('casper').selectXPath;
casper.start('http://www.outdoorsatuva.org/members/join/', function() {
  this.fillSelectors(
    '#theform',
    {
      'input[name="firstName"]': 'Chad',
      'input[name="lastName"]': 'Baily',
      'input[id="gender2"]': 'f',
      'input[id="student1"]': '2',
      'input[id="dob"]': '1998-02-08',
      'input[id="emailAddress"]': 'test@test.com',
      'input[id="confirmEmailAddress"]': 'test@test.com',
      'input[id="password1"]': 'blah',
      'input[id="password2"]': 'blah',
      'input[id="street"]': 'some street',
      'input[id="city"]': 'mechanicsville',
      'input[id="state"]': 'VA',
      // 'input[id="zip"]': '23116',
      'input[id="areaCode"]': '804',
      'input[id="exchange"]': '317',
      'input[id="number"]': '1638',
      // 'input[id="phoneNumberType"]': '1'
      'input[id="membership-plan18"]': '18'
    },
    false
  );
  this.selectOptionByValue('select#phoneNumberType', '1');

  console.log('Logging In...');
  // this.click('#theform input[type="submit"]');
  // this.sendKeys('#theform', casper.page.event.key.Enter, {
  //   keepFocus: true
  // });
  this.click(xpath('(//input[@value="Proceed to Next Step"])'));
  this.wait(5000, function() {
    console.log('Waiting...');
  });
  this.capture('test.png');
});

casper.run();
