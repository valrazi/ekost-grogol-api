const callback = require("../helpers/Callback")
const Booking = require("../models/Booking")
const Keluhan = require("../models/Keluhan")
const Room = require("../models/Room")
const moment = require('moment')
const User = require("../models/User")
class KeluhanController {
    static async create(req, res) {
        const { message, bookingId } = req.body
        try {
            const data = await Keluhan.create({
                message,
                booking_id: bookingId
            })
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            return callback.send(callback.general_error(), null, res)
        }
    }
    static async findByBooking(req, res) {
        const { booking_id } = req.params
        try {
            const data = await Keluhan.findAll({
                where: {
                    booking_id
                },
                include: [
                    {
                        model: Booking,
                        include: [
                            {
                                model: Room
                            }
                        ]
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            return callback.send(callback.general_error(), null, res)
        }
    }
    static async findAll(req, res) {
        const { from_admin } = req.query
        console.log({q:req.query})
        try {
            const whereQuery = {}
            if (from_admin) {
                whereQuery.show = true
            }
            const data = await Keluhan.findAll({
                where: whereQuery,
                include: [
                    {
                        model: Booking,
                        include: [
                            {
                                model: Room
                            },
                            {
                                model: User,
                            }
                        ]
                    }
                ]
            })
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            return callback.send(callback.general_error(), null, res)
        }
    }

    static async respond(req, res) {
        const {id} = req.params,
        {reply} = req.body
        try {
            const keluhan = await Keluhan.findOne({
                where: {
                    id
                }
            })
            if(!keluhan) {
                return callback.send(callback.no_data(), null, res)
            }
            await Keluhan.update({
                responded: true,
                reply: reply ?? '-',
                respondedAt: moment()
            }, {
                where: {
                    id: keluhan.id
                }
            })
            const data = await Keluhan.findOne({
                where: {
                    id
                }
            })
            return callback.send(null, callback.success(data), res)            
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(), null, res)
        }
    }

    static async hide(req, res) {
        const {id} = req.params
        try {
            const keluhan = await Keluhan.findOne({
                where: {
                    id
                }
            })
            if(!keluhan) {
                return callback.send(callback.no_data(), null, res)
            }
            await Keluhan.update({
                show:false
            }, {
                where: {
                    id: keluhan.id
                }
            })
            const data = await Keluhan.findOne({
                where: {
                    id
                }
            })
            return callback.send(null, callback.success(data), res)            
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(), null, res)
        }
    }
}

module.exports = KeluhanController