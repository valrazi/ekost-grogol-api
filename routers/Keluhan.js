const express = require('express');
const router = express.Router();
const Controller = require('../controllers/KeluhanController.js')

router.get('/booking/:booking_id', Controller.findByBooking)
router.get('/', Controller.findAll)
router.post('/', Controller.create)
router.put('/respond/:id', Controller.respond)
router.put('/hide/:id', Controller.hide)
// router.delete('/:id', Controller.delete)

module.exports = router