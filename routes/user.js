const logger = require('../logger');
const express = require('express');
const router = express.Router();
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

// login
router.post('/auth', function(req, res) {
	var username = req.body.username;
    var password = req.body.password;
    console.log(req.body.username);
	if (username && password) {
        const queryString = 'SELECT * FROM user WHERE name = ? AND password = ?';
		SQLConnection().query(queryString, [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
                logger.info('User logged in.');
                res.redirect('/?status=success-login');
			} else {
                logger.error('Incorrect username and/or password!');
                res.redirect('../login.html?status=error-login');
			}			
			res.end();
        });
	} else {
        logger.info('Please enter username and password.');
        res.redirect('../login.html?status=error-empty-login');
		res.end();
	}
});

// logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });

// after login page (temporary)
router.get('/home', function(req, res) {
	if (req.session.loggedin) {
		logger.info('User (' + req.session.username + ') successfully logged in!');
	} else {
		logger.error('User not logged in!');
	}
	res.end();
});



//--------------------------------------------------------------------------------------
//                                         POST REQUESTS
//-------------------------------------------------------------


router.post('/create', (req, res) => {
    logger.info('Creating user ' + req.body.userName);

    const queryString = 'INSERT INTO user (name, id, password, studentNumber) VALUES (?, ?, ?, ?)';
    SQLConnection().query(
        queryString,
        [   req.body.userName,
            req.body.userId,
            req.body.password,
            req.body.studentNumber
            
        ], (err, result, fields) => {
            if (err) {
                logger.error('Failed to insert new user: ' + err);
                res.status(500).redirect('/?status=error');
                return;
            } 

            logger.success('Inserted new user with id: ' + result.insertId)
            res.status(201).redirect('/?status=success');
        }
    );

});
//--------------------------------------------------------------------------------------
//                                         UPDATE REQUESTS
//--------------------------------------------------------------------------------------
router.patch('/:id', (req, res) => {
    logger.log('Updating user with id: ' + req.params.userId);

    const queryString = 'UPDATE user SET studentNumber = ?, userName = ?, password = ? WHERE userId = ?';
    SQLConnection().query(
      queryString,
      [
          req.body.userId,
          req.body.userName,
          req.body.password,
          req.body.studentNumber
          
      ],
      (err, result, fields) => {
          if (err) {
              logger.error('Failed to update user with id: ' + req.params.UserId)
              res.status(500).redirect('/?status=error');
              return;
          }

          logger.success('Updated user with id: ' + req.params.userId);
          res.status(200).redirect('/?status=success');
      }
    );
});

//--------------------------------------------------------------------------------------
//                                         DELETE REQUESTS
//--------------------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
    logger.log('Deleting user with id: ' + req.params.userId);

    const queryString = 'DELETE FROM user WHERE userId = ?';
    SQLConnection().query(queryString, [req.params.userId], (err, reslut, fields) => {
        if (err) {
            logger.error('Failed to delete user with id: ' + req.params.userId);
            res.status(500).redirect('/?status=error');
            return;
        }

        logger.success('Deleted user with id: ' + req.params.userId);
        res.status(200).redirect('/?status=success');
    });
});






module.exports = router;
