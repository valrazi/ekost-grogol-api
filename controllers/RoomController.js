const callback = require("../helpers/Callback")
const Room = require("../models/Room")
const RoomType = require("../models/RoomType")

class RoomController {
    static async create(req, res) {
        const {nomorKamar, lantai, roomTypeId, status} = req.body
        try {
            const roomType = await RoomType.findOne({
                where: {
                    id: roomTypeId
                }
            })
            if(!roomType) {
                return callback.send(callback.no_data(), null, res)
            }
            const data = await Room.create({
                nomorKamar,
                lantai,
                room_type_id: roomType.id,
                status
            })
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(), null, res)
        }
    }

    static async findAll(req, res) {
        const {query} = req, {limit} = query
        try {
            const data = await Room.findAll({
                limit: limit ? Number(limit) : 10,
                order: [['created_at', 'DESC']],
                include: [RoomType]
            })
            const total = await Room.count()
            const meta = {
                limit: limit ?? 10,
                total
            }
            const response = {
                rows: data,
                meta
            }
            return callback.send(null, callback.success(response), res)
        } catch (error) {
            return callback.send(callback.general_error(error), null, res)
        }
    }

    static async findOne(req, res) {
        const { params } = req, { id } = params
        try {
            const found = await Room.findOne({
                where: {
                    id
                },
                include: [RoomType]
            })
            if (!found) {
                return callback.send(callback.no_data(), null, res)
            }
            const data = await Room.findOne({
                where: {
                    id
                },
                include: [RoomType]
            })
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            return callback.send(callback.general_error(error), null, res)
        }
    }

    static async update(req, res) {
        const {nomorKamar, lantai, roomTypeId, status} = req.body
        const {id} = req.params
        try {
            const found = await Room.findOne({
                where: {
                    id
                }
            })
            if(!found) {
                return callback.send(callback.no_data(), null, res)
            }
            const roomType = await RoomType.findOne({
                where: {
                    id: roomTypeId
                }
            })
            if(!roomType) {
                return callback.send(callback.no_data(), null, res)
            }

            await Room.update({
                nomorKamar,
                lantai,
                room_type_id: roomType.id,
                status
            }, {
                where: {
                    id
                }
            })

            const data = await Room.findOne({
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

    static async delete(req, res) {
        const { params } = req, { id } = params
        try {
            const found = await Room.findOne({
                where: {
                    id
                }
            })
            if (!found) {
                return callback.send(callback.no_data(), null, res)
            }
            await Room.destroy({
                where: {
                    id
                }
            })
            return callback.send(null, callback.success(), res)
        } catch (error) {
            return callback.send(callback.general_error(error), null, res)
        }
    }
}

module.exports = RoomController