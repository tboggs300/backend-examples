const express = require('express');
const router = express.Router();
const { AuthService } = require('../services/auth');
const { response } = require( '..' );


router.post('/login', (req, res) => {
  const params = req.body;
  AuthService.loginUser(...params).then(response => {
    const { statusCode , ...rest } = response;
    res.status(statusCode);
    res.type('application/json');
    res.send({ ...rest });
  });

});

router.post('/register'), (req, res) => {
  const params = req.body;
  AuthService.registerUser(params).then(response => {
    const { statusCode , ...rest } = response;
    res.status(statusCode);
    res.type('application/json');
    res.send({ ...rest });
  })
}

module.exports.AuthRouter = router;