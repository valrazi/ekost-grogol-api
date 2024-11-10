const express = require('express');
const router = express.Router();
const Controller = require('../controllers/UserController.js')

router.post('/login', Controller.login)
router.post('/register', Controller.register)
router.get('/booking', Controller.findUserByBooking)

module.exports = router