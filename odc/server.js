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
  execute(config, callback) {
    const database = new Database(config);
    return callback(database).then(
      result => database.close().then(() => result),
      err =>
        database.close().then(() => {
          throw err;
        })
    );
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

app.post('/api/activate', (req, res) => {
  var XHR = new XMLHttpRequest();
  const urlEncodedData = req.body.converted;
  /**
   * Adds a new user on the ODC website
   */
  // // Define what happens on successful data submission
  // XHR.addEventListener('load', function(event) {
  //   console.warn('Yeah! Data sent and response loaded.');
  // });

  // // Define what happens in case of error
  // XHR.addEventListener('error', function(event) {
  //   res.status(201).json({
  //     error: {
  //       status: 'w',
  //       message: 'Failed to activate'
  //     }
  //   });
  //   console.warn('Oops! Something went very wrong.');
  // });

  // // Set up our request
  // XHR.open('POST', 'http://www.outdoorsatuva.org/members/join');

  // // Add the required HTTP header for form data POST requests
  // XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // // Finally, send our data.
  // XHR.send(urlEncodedData);

  // mongoose.connection.db
  //   .collection('users')
  //   .find({ email: req.body.raw.email })
  //   .toArray(function(err, docs) {
  //     console.log('Found the following records');
  //     console.log(docs);
  //     // callback(docs);
  //   });
  // Connect to DB
  // host: process.env.MYSQLHOST || 'localhost' || '192.168.99.100',
  let mysqlDB = new Database({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASS || 'my-secret-pw',
    database: process.env.MYSQLDATABASE || 'main'
  });

  // Check if email is there
  const email = req.body.raw.email;
  c_uid = 0;

  // mysqlDB
  //   .execute(config, database =>
  //     database
  //       .query('SELECT c_uid FROM `m_member` WHERE c_email="' + email + '"')
  //       .then(rows => {
  //         console.log('1st query', rows);
  //         c_uid = rows[0].c_uid;
  //         return database.query(
  //           `SELECT * FROM m_membership where c_member = ${c_uid}`
  //         );
  //       })
  //       .then(rows => {
  //         otherRows = rows;
  //       })
  //   )
  //   .then(() => {
  //     // do something with someRows and otherRows
  //   })
  //   .catch(err => {
  //     // handle the error
  //   });

  mysqlDB
    .query('SELECT c_uid FROM `m_member` WHERE c_email="' + email + '"')
    .then(rows => {
      console.log('1st query', rows);
      c_uid = rows[0].c_uid;
      return mysqlDB.query(
        `SELECT * FROM m_membership where c_member = ${c_uid}`
      );
    })
    .then(
      rows => {
        console.log('2nd query', rows);
        return database.close();
      },
      err => {
        return database.close().then(() => {
          throw err;
        });
      }
    )
    .then(() => {
      // do something with someRows and otherRows
    })
    .catch(err => {
      // handle the error
      if (err) {
        // res.status(201).json({
        //   error: {
        //     status: 'w',
        //     message: 'Failed to activate'
        //   }
        // });
      }
    });

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
});
// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/odc/index.html'));
});

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
