const http = require('http');
const https = require('https');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const logger = require('./logger');

const routes = require('./routes');

const app = express();

// Adds request logging.
app.use(morgan('short'));
// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));
// Support parsing of application/json type post data
app.use(bodyParser.json());

app.use(session({
	secret: 'uf5he0zu7sq3UNny72dza30dgzy',
	resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.use(routes);

// If user is not logged in, redirect to login page.
app.use((req, res, next) => {
    if (req.session.loggedin  && req.session.username) {
        next();
    } else {
        res.redirect('/login');
    }
});

// Serve public files
app.use(express.static('public'))

http.createServer(app).listen(9000, () => {
    logger.info("Server is up an listening on http://localhost:9000");
});

// https://stackoverflow.com/questions/11744975/enabling-https-on-express-js
// https.createServer(app).listen(9443, () => {
//     logger.log("Server is up an listening on http://localhost:9000");
// });