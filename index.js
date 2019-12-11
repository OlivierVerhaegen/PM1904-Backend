const http = require('http');
const https = require('https');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('./logger');

const routes = require('./routes');

const app = express();

const cors = require('cors');

// Adds request logging.
app.use(morgan('short'));
// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));
// Support parsing of application/json type post data
app.use(bodyParser.json());
// Support the usage of sessions.
app.use(session({
	secret: 'uf5he0zu7sq3UNny72dza30dgzy',
	resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));

// Setup orgin headers to allow all orgins.
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(cors({
    origin: ["https://ea-ict.be", "http://localhost:4200"],
    credentials: true
}));

// Register our routes.
app.use(routes);

// If user is not logged in, redirect to login page.
app.use((req, res, next) => {
    if (req.session.loggedin  && req.session.username) {
        next();
    } else {
        res.redirect('/login');
    }
});

// Serve public files.
app.use(express.static('public'))

// Start the server.
http.createServer(app).listen(9000, () => {
    logger.info("Server is up an listening on http://localhost:9000");
});

// https://stackoverflow.com/questions/11744975/enabling-https-on-express-js
// https.createServer(app).listen(9443, () => {
//     logger.log("Server is up an listening on http://localhost:9000");
// });

// Export the server for testing.
module.exports = app;