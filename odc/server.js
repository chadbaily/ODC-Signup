// set up ======================================================================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var port = process.env.PORT || 8080; // set the port
var database = require('./config/database'); // load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
const path = require('path');
const http = require('http');

// configuration ===============================================================
mongoose.connect(process.env.MONGOLAB_SILVER_URI || database.localUrl); // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
mongoose.connection.on('error', console.error.bind(console, 'Mongo Error: '));

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

// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/odc/index.html'));
});

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
