const http = require('http');
const https = require('https');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const logger = require('./logger');

const routes = require('./routes');

const app = express();

app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(routes);
// Serve public files
app.use(express.static('public'))

http.createServer(app).listen(9000, () => {
    logger.info("Server is up an listening on http://localhost:9000");
});

// https://stackoverflow.com/questions/11744975/enabling-https-on-express-js
// https.createServer(app).listen(9443, () => {
//     logger.log("Server is up an listening on http://localhost:9000");
// });