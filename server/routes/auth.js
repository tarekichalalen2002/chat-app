const express = require('express');
const authenticationController  = require('../controllers/auth.js');
const authRouter = express.Router();


authRouter.post('/', authenticationController)

module.exports = authRouter;