const express = require('express');
const router = express.Router();
const Controller = require('../controllers/RoomController.js')

router.get('/', Controller.findAll)
router.get('/:id', Controller.findOne)
router.post('/', Controller.create)
router.put('/:id', Controller.update)
router.delete('/:id', Controller.delete)

module.exports = router