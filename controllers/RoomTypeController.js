const callback = require('../helpers/helper_callback')
const Images = require('../models/Images')
const roomType = require('../models/RoomType')
const r2Bucket = require("../helpers/storage");
const Room = require('../models/Room');
class RoomTypeController {
    static async create(req, res) {
        const { nama, harga, panjang, lebar, fasilitas, images } = req.body
        try {
            let data = await roomType.create({
                nama,
                harga,
                panjang,
                lebar,
                fasilitas
            })
            if (images && Array.isArray(images)) {
                const imageId = await Images.count()
                await Promise.all(
                    images.map((el, i) => {
                        let id = imageId + (i + 1)
                        id = `IMG${id.toString().padStart(3, '0')}`
                        Images.create({
                            id,
                            room_type_id: data.id,
                            url: el.url,
                            objectKey: el.objectKey
                        })
                    })
                );
            }
            data = await roomType.findOne({
                where: {
                    id: data.id
                },
                include: Images
            })
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            return callback.send(callback.general_error(error), null, res)
        }
    }

    static async findAll(req, res) {
        const { query } = req, { limit } = query
        try {
            const data = await roomType.findAll({
                limit: limit ? Number(limit) : 10,
                order: [
                    ['created_at', 'DESC']
                ],
                include: [Images, Room]
            })
            const total = await roomType.count()
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
            console.log(error)
            return callback.send(callback.general_error(error), null, res)
        }
    }

    static async findOne(req, res) {
        const { params } = req, { id } = params
        try {
            const found = await roomType.findOne({
                where: {
                    id
                }
            })
            if (!found) {
                return callback.send(callback.no_data(), null, res)
            }
            const data = await roomType.findOne({
                where: {
                    id
                },
                include: [Images, Room]
            })
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            return callback.send(callback.general_error(error), null, res)
        }
    }

    static async update(req, res) {
        const { nama, harga, panjang, lebar, fasilitas, images } = req.body,
            { params } = req, { id } = params
        try {
            const found = await roomType.findOne({
                where: {
                    id
                }
            })
            if (!found) {
                return callback.send(callback.no_data(), null, res)
            }
            await roomType.update(
                {
                    nama,
                    harga,
                    panjang,
                    lebar,
                    fasilitas
                },
                {
                    where: {
                        id
                    }
                }
            )
            const imageList = await Images.findAll({
                where: {
                    room_type_id: id
                }
            })
            if (imageList.length) {
                imageList.forEach(async (el) => {
                    await r2Bucket.deleteObject(el.objectKey)
                });
                await Images.destroy({
                    where: {
                        room_type_id: id
                    }
                })
            }
            if (images && Array.isArray(images)) {
                const imageId = await Images.count()
                await Promise.all(
                    images.map((el, i) => {
                        let id = imageId + (i + 1)
                        id = `IMG${id.toString().padStart(3, '0')}`
                        Images.create({
                            id,
                            room_type_id: data.id,
                            url: el.url,
                            objectKey: el.objectKey
                        })
                    })
                );
            }
            const data = await roomType.findOne({
                where: {
                    id
                },
                include: Images
            })
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            return callback.send(callback.general_error(error), null, res)
        }
    }

    static async delete(req, res) {
        const { params } = req, { id } = params
        try {
            const found = await roomType.findOne({
                where: {
                    id
                }
            })
            if (!found) {
                return callback.send(callback.no_data(), null, res)
            }
            await roomType.destroy({
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

module.exports = RoomTypeController