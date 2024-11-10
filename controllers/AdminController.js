const Admin = require('../models/Admin')
const AuthHelper = require('../helpers/auth')
const callback = require('../helpers/Callback')
const RoomController = require('./RoomController')
const Room = require('../models/Room')
const Reservation = require('../models/Reservation')
const Booking = require('../models/Booking')
class AdminController {
    static async login(req, res) {
        const {email, password} = req.body
        try {
            let found = await Admin.findOne({
                where: {
                    email
                }
            })
            if(!found) {
                return callback.send(callback.invalid_credentials(), null, res)
            }
            if(!AuthHelper.hash_verify(password, found.password)) {
                return callback.send(callback.invalid_credentials(), null, res)
            }
            const tokenPayload = AuthHelper.encrypt_token({
                id: found.id,
                username: found.username
            })
            found = found.toJSON()
            delete found.password
            const response = {
                admin: found,
                token: tokenPayload
            }
            return callback.send(null, callback.success(response), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(), null, res)
        }
    }

    static async analyticDashboard(req, res) {
        try {
            const room = await Room.count({
                where: {
                    status: 'available'
                }
            })

            const reservation = await Reservation.count({
                where: {
                    isAccepted: false
                }
            })

            const booking = await Booking.count({
                where: {
                    paymentStatus: false
                }
            })

            const response = {
                room,
                reservation,
                booking
            }
            return callback.send(null, callback.success(response), res)

        } catch (error) {
            return callback.send(callback.general_error(), null, res)

        }
    }
}

module.exports = AdminController