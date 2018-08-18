// set up ======================================================================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var port = process.env.PORT || 4200; // set the port
var database = require('./config/database'); // load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
const path = require('path');
const http = require('http');
var mysql = require('mysql');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// configuration ===============================================================
mongoose.connect(process.env.MONGOLAB_SILVER_URI || database.localUrl),
  { useNewUrlParser: true }; // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
mongoose.connection.on('error', console.error.bind(console, 'Mongo Error: '));

/* Set up the database class */
class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

class XMLPost {
  constructor(name) {
    this.appName = `${name}`;
    this.XHR = new XMLHttpRequest();
  }
  post(data, url, res) {
    return new Promise((resolve, reject) => {
      XHR = this.XHR;
      this.XHR.onreadystatechange = function(event) {
        if (this.XHR.readyState === 4) {
          if (this.XHR.status === 200) {
            console.log('Post Success to ', url);
            resolve();
          } else {
            res.status(201).json({
              error: {
                status: 'w',
                message: `Failed post at ${url}`
              }
            });
            console.log('Error', this.XHR.statusText);
            reject(event);
          }
        }
      };

      // Set up our request
      this.XHR.open('POST', url);
      // Add the required HTTP header for form data POST requests
      this.XHR.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );
      // Finally, send our data.
      this.XHR.send(data);
    });
  }
}

// app.use(express.static("./public")); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// API file for interacting with MongoDB
const api = require('./routes/api');

// Angular DIST output folder
app.use(express.static(path.join(__dirname, '/dist/odc')));

// API location
app.use('/api', api);

// Check if email is already in use
app.post('/api/check-email', (req, res) => {
  // Connect to DB
  // host: process.env.MYSQLHOST || 'localhost' || '192.168.99.100',
  let mysqlDB = mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASS || 'my-secret-pw',
    database: process.env.MYSQLDATABASE || 'main'
  });
  mysqlDB.connect(function(err) {
    if (err) console.error.bind(console, 'MySql Error: ', err);
    // console.log('MySql Connected!');
  });
  // Check if email is there
  const email = req.body.email;
  // console.log('Email is: ', email);
  mysqlDB.query(
    'SELECT * FROM m_member WHERE c_email="' + email + '"',
    function(err, result, fields) {
      if (err) console.error('ERROR: ', err);
      // Check to see if the email matches
      if (result) {
        if (result.length === 0) {
          res.status(201).json({
            message: 'Email not found'
          });
        } else {
          res.status(201).json({
            error: {
              status: 'w',
              message: 'Email already in use, please enter another'
            }
          });
        }
      } else {
        res.status(500).json({
          message: 'Error Connecting to Database'
        });
      }
    }
  );
  mysqlDB.end();
});

app.post('/api/activate/subscribe', (req, res) => {
  addNewUserToEmailList(req, res)
    .then(() => addODCUserOnSite(req, res))
    .catch(err => console.log('ERROR IN POST', err));
});

app.post('/api/activate', (req, res) => {
  console.log('Hit activate');
  // Check if email is there
  const email = req.body.raw.email;
  c_uid = 0;
  var mysqlDB = new Database({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASS || 'my-secret-pw',
    database: process.env.MYSQLDATABASE || 'main'
  });
  mysqlDB
    .query('SELECT c_uid FROM `m_member` WHERE c_email="' + email + '"')
    .then(rows => {
      console.log('1st query', rows);
      c_uid = rows[0].c_uid;
      return mysqlDB.query(
        `UPDATE m_membership SET c_status = 4 WHERE c_member = ${c_uid}`
      );
    })
    .then(
      rows => {
        console.log('2nd query', rows);
        return mysqlDB.close();
      },
      err => {
        return mysqlDB.close().then(() => {
          throw err;
        });
      }
    )
    .then(() => {
      // What happens with the local variables we made
      /**
       * Finds a user based on email and sets their status to active on the odc site
       */
      mongoose.connection.db.collection('users').updateOne(
        { email: req.body.raw.email },
        { $set: { isActiveOnWeb: true } },
        function(err, result) {
          if (err) {
            console.error(err);
          }
          console.log('Updated the document with the field');
        },
        { upsert: true }
      );

      res.status(201).json({
        message: 'User added on ODC and status updated'
        // data: jsonToURI(user)
      });
    })
    .catch(err => {
      // handle the error
      if (err) {
        console.warn(err);
        // TODO: Add some logging here
      }
    });
});
// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/odc/index.html'));
});

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));

/**
 * Adds a new user to ODC via post
 * @param {*} req
 * @param {*} res
 */
function addODCUserOnSite(req, res) {
  return new Promise((resolve, reject) => {
    var XHR = new XMLHttpRequest();
    const urlEncodedData = req.body.converted;
    /**
     * Adds a new user on the ODC website
     */
    // Define what happens on successful data submission
    XHR.addEventListener('load', function(event) {
      console.warn('Data send to ODC site for adding user');
    });
    // Define what happens in case of error
    XHR.addEventListener('error', function(event) {
      res.status(201).json({
        error: {
          status: 'w',
          message: 'Failed to add user on odc site'
        }
      });
      console.warn('Failed to add user on odc site');
    });
    // Set up our request
    XHR.open('POST', 'http://www.outdoorsatuva.org/members/join', false);
    // Add the required HTTP header for form data POST requests
    XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // Callback function
    XHR.onreadystatechange = function(event) {
      if (XHR.readyState === 4) {
        if (XHR.status === 200) {
          console.log('Added user on odc site');
          resolve();
        } else {
          reject(event);
          console.log('Error', XHR.statusText);
        }
      }
    };
    // Finally, send our data.
    XHR.send(urlEncodedData);
  });
}

/**
 * Adds a new user to the email list via post
 * @param {*} req
 * @param {*} res
 */
function addNewUserToEmailList(req, res) {
  return new Promise((resolve, reject) => {
    var XHR = new XMLHttpRequest();
    const email = req.body.raw.email;
    /**
     * Adds a new user on the ODC website
     */
    // Define what happens on successful data transmission
    XHR.addEventListener('load', function(event) {
      console.warn('Data send to add user to pair list');
    });
    // Define what happens in case of error
    XHR.addEventListener('error', function(event) {
      res.status(201).json({
        error: {
          status: 'w',
          message: 'Failed to add user to email list'
        }
      });
      console.warn('Failed to add user to email list');
    });
    // Set up our request
    XHR.open(
      'POST',
      'https://pairlist10.pair.net/mailman/subscribe/outdoors',
      false
    );
    // Add the required HTTP header for form data POST requests
    XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // Finally, send our data.
    const emailPayload = `digest=0&email=${email}&email-button=Subscribe`;
    // Callback function
    XHR.onreadystatechange = function(event) {
      if (XHR.readyState === 4) {
        if (XHR.status === 200) {
          resolve();
          console.log('Subscribed user to mass email');
        } else {
          reject(event);
          console.log('Error', XHR.statusText);
        }
      }
    };
    XHR.send(emailPayload);
  });
}
