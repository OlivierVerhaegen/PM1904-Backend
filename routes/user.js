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
                res.redirect(401, '../login.html?status=error-login');
			}			
			res.end();
        });
	} else {
        logger.info('Please enter username and password.');
        res.redirect(401, '../login.html?status=error-empty-login');
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
    const userName = req.body.userName;
    const password = req.body.password;
    const studentNumber = req.body.studentNumber;

    if (!userName || !password) {
        res.redirect(500, '/?status=error');
        logger.error('Failed to instert new user: some fields where empty.');
        res.end();
        return;
    }

    logger.info('Creating user ' + req.body.userName);

    const queryString = 'INSERT INTO user (name, password, studentNumber) VALUES (?, ?, ?)';
    SQLConnection().query(
        queryString,
        [   
            userName,
            password,
            studentNumber
        ], (err, result, fields) => {
            if (err) {
                logger.error('Failed to insert new user: ' + err);
                res.redirect(500, '/?status=error');
                res.end();
                return;
            } 

            logger.success('Inserted new user with id: ' + result.insertId)
            res.redirect(201, '/?status=success');
        }
    );

});
//--------------------------------------------------------------------------------------
//                                         UPDATE REQUESTS
//--------------------------------------------------------------------------------------
router.patch('/:id', (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;
    const studentNumber = req.body.studentNumber;

    if (!userName || !password) {
        res.redirect(500, '/?status=error');
        logger.error('Failed to instert new user: some fields where empty.');
        res.end();
        return;
    }

    logger.info('Updating user with id: ' + req.params.id);

    const queryString = 'UPDATE user SET name = ?, password = ?, studentNumber = ? WHERE id = ?';
    SQLConnection().query(
      queryString,
      [
          userName, 
          password,
          studentNumber,
          req.params.id         
      ],
      (err, result, fields) => {
          if (err) {
              logger.error('Failed to update user with id: ' + req.params.id)
              res.redirect(500, '/?status=error');
              res.end();
              return;
          }

          logger.success('Updated user with id: ' + req.params.id);
          res.redirect(201, '/?status=success');
      }
    );
});

//--------------------------------------------------------------------------------------
//                                         DELETE REQUESTS
//--------------------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
    logger.info('Deleting user with id: ' + req.params.id);

    const queryString = 'DELETE FROM user WHERE id = ?';
    SQLConnection().query(queryString, [req.params.id], (err, reslut, fields) => {
        if (err) {
            logger.error('Failed to delete user with id: ' + req.params.id);
            res.redirect(500, '/?status=error');
            return;
        }

        logger.success('Deleted user with id: ' + req.params.id);
        res.redirect(200, '/?status=success');
    });
});

//--------------------------------------------------------------------------------------
//                                         GET REQUESTS
//--------------------------------------------------------------------------------------
router.get('/', (req, res) => {
    if (req.session.loggedin) {
        logger.info('Getting users from database...');

        const queryString = 'SELECT * FROM user';
        SQLConnection().query(queryString, (err, rows, fields) => {
            if (err) {
                logger.error('Failed to get user from database. ' + err);
                res.json({
                    error: 'Failed to get user from database. ' + err
                });
            }
    
            res.json(rows);
        });
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access users.'
        });
        res.end();
    }
});

router.get('/:id', (req, res) => {
    if (req.session.loggedin) {
        logger.info(`Getting user ${req.params.id} from database...`);

        const queryString = 'SELECT * FROM user WHERE id = ?';
        SQLConnection().query(queryString, [req.params.id], (err, rows, fields) => {
            if (err) {
                logger.error('Failed to get user with id: ' + req.params.id + ' from database.');
                res.json({
                    error: 'Failed to get user with id: ' + req.params.id + ' from database.'
                });
            }
    
            res.json(rows);
        });
    }
    else {
        logger.error('User is not logged in!');
        res.status(401).json({
            error: 'You need to be logged in to access products.'
        });
        res.end();
    }
});






module.exports = router;
