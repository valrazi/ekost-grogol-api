const { Op } = require("sequelize")
const AuthHelper = require("../helpers/auth")
const callback = require("../helpers/helper_callback")
const User = require("../models/User")
const Booking = require("../models/Booking")
const Room = require("../models/Room")

class UserController {
    static async register(req, res) {
        const { email, username, password, nama, whatsappNumber, jenisKelamin, pekerjaan } = req.body
        try {
            const found = await User.findOne({
                where: {
                    [Op.or] : [{email}, {username}]
                }
            })
            if(found) {
                return callback.send(callback.account_exist(), null, res)
            }
            let data = await User.create({
                email,
                username,
                password: AuthHelper.hash_password(password),
                nama,
                whatsappNumber,
                jenisKelamin,
                pekerjaan
            })
            data = data.toJSON()
            delete data.password
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(error), null, res)
        }
    }

    static async login(req, res) {
        const { username, password } = req.body
        try {
            let user = await User.findOne({
                where: {
                    username
                }
            })
            if (!user || !AuthHelper.hash_verify(password, user.password)) {
                return callback.send(callback.invalid_credentials(), null, res)
            }
            const tokenPayload = AuthHelper.encrypt_token({
                id: user.id,
                username: user.username
            })
            user = user.toJSON()
            delete user.password
            const response = {
                user,
                token: tokenPayload
            }
            return callback.send(null, callback.success(response), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(error), null, res)
        }
    }

    static async findUserByBooking(req, res) {
        try {
            let data = await User.findAll({
                include: [
                    {
                        model: Booking,
                        order: [['createdAt', 'DESC']],
                        include: [
                            {
                                model: Room
                            }
                        ]
                    }
                ],
                attributes: ['id', 'email', 'username', 'nama', 'jenisKelamin', 'pekerjaan', 'whatsappNumber', 'createdAt', 'updatedAt', 'deletedAt']
            })
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(error), null, res)
        }
    }
}

module.exports = UserController