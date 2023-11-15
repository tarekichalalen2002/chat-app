const express = require('express');
const searchRouter = express.Router();
const {searchUser} = require('../controllers/serach');

searchRouter.get('/:username', searchUser)


module.exports = searchRouter;