const logger = require('../logger');
const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');

const SQLConnection = require('../database');

function validateStudentNumber(studentNumber) {
    const lowerCase = studentNumber.toLowerCase();
    const startsWithS = lowerCase.startsWith('s');
    const correctLength = lowerCase.length == 9;

    if (startsWithS && correctLength) {
        return true;
    } else {
        return false;
    }
}

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/login.html'));
});

router.post('/auth', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
        const queryString = 'SELECT * FROM user WHERE name = ? AND password = ?';
		SQLConnection().query(queryString, [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/home');
			} else {
				logger.error('Incorrect username and/or password!');
			}			
			res.end();
        });
	} else {
		logger.info('Please enter username and password.');
		res.end();
	}
});

router.get('/home', function(req, res) {
	if (req.session.loggedin) {
		logger.info('User (' + req.session.username + ') successfully logged in!');
	} else {
		logger.error('User not logged in!');
	}
	res.end();
});