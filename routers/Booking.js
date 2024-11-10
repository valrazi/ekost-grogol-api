const express = require('express');
const router = express.Router();
const Controller = require('../controllers/BookingController.js');
const { jwt_validation, admin_jwt_validation } = require('../helpers/auth.js');

router.get('/', Controller.findAll)
router.get('/export', Controller.export)
router.get('/user', jwt_validation, Controller.findByCustomer)
router.get('/:id', Controller.findOne)
router.post('/', jwt_validation ,Controller.create)
router.put('/verify/:id', Controller.verifyPayment)
// router.delete('/:id', Controller.delete)

module.exports = router