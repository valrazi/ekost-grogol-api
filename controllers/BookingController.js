const db = require("../db")
const callback = require("../helpers/Callback")
const Booking = require("../models/Booking")
const Room = require("../models/Room")
const RoomType = require("../models/RoomType")
const moment = require('moment')
const User = require("../models/User")
const { Op, fn, col, where } = require("sequelize")
const { Workbook } = require('exceljs')
class BookingController {
    static async create(req, res) {
        const { startDate, endDate, roomId, transferProof } = req.body
        const { user } = req
        const transaction = await db.transaction()
        try {
            const room = await Room.findOne({
                where: {
                    id: roomId
                },
                include: [RoomType]
            })
            if (!room) {
                return callback.send(callback.no_data(), null, res)
            }
            if (room.status.toUpperCase() != 'AVAILABLE') {
                return callback.send(callback.forbidden(), null, res)
            }
            const roomType = await RoomType.findOne({
                where: {
                    id: room.room_type.id
                }
            })

            const start = moment(startDate)
            const end = moment(endDate)
            const diff = Math.ceil(end.diff(start, 'weeks'))
            let totalPrice = 0
            if (diff < 4) {
                totalPrice = !diff ? (roomType.harga / 4) * 1 : (roomType.harga / 4) * diff
            } else {
                const diffMonth = Math.ceil(end.diff(start, 'months'))
                totalPrice = roomType.harga = diffMonth
            }



            const booking = await Booking.create({
                startDate: start.toDate(),
                endDate: end.toDate(),
                totalPrice,
                transferProof,
                paymentStatus: false,
                room_id: room.id,
                user_id: user.id
            }, { transaction })

            await Room.update({
                status: 'booked'
            }, {
                where: {
                    id: room.id
                },
                transaction
            })
            await transaction.commit()
            return callback.send(null, callback.success(booking), res)
        } catch (error) {
            console.log(error)
            await transaction.rollback()
            return callback.send(callback.general_error(error), null, res)
        }
    }
    static async findAll(req, res) {
        const { limit, status, month_count } = req.query
        try {
            const whereQuery = {}
            if (status) {
                switch (status) {
                    case 'paid':
                        whereQuery.paymentStatus = true
                        break
                    case 'not_paid':
                        whereQuery.paymentStatus = false
                        break;
                }
            }
            if (month_count && Number(month_count) > 0) {
                whereQuery.createdAt = where(fn('MONTH', col('booking.created_at')), month_count);
            }
            const data = await Booking.findAll({
                where: whereQuery,
                limit: limit ? Number(limit) : 10,
                include: [{
                    model: User,
                    attributes: ['id', 'email', 'username', 'nama', 'jenisKelamin', 'pekerjaan', 'whatsappNumber']
                },
                {
                    model: Room
                }
                ]
            })
            const total = await Booking.count({
                where: whereQuery
            })

            const response = {
                rows: data,
                total
            }

            return callback.send(null, callback.success(response), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(), null, res)
        }
    }
    static async findOne(req, res) {
        const { id } = req.params
        try {
            const booking = await Booking.findOne({
                where: {
                    id
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'email', 'username', 'nama', 'jenisKelamin', 'pekerjaan', 'whatsappNumber']
                    },
                    {
                        model: Room
                    }
                ]
            })
            if (!booking) {
                return callback.send(callback.no_data(), null, res)
            }
            return callback.send(null, callback.success(booking), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(), null, res)
        }
    }
    static async findByCustomer(req, res) {
        const { user } = req
        console.log({ tes: 'aaaaa' })
        try {
            console.log({ user })
            const data = await Booking.findOne({
                where: {
                    user_id: user.id,
                    endDate: {
                        [Op.gte]: moment().subtract(1, 'days')
                    },
                },
                include: [
                    {
                        model: Room,
                        include: [RoomType]
                    }
                ],
                order: [
                    ['endDate', 'DESC']
                ]
            })
            if (!data) {
                return callback.send(callback.no_data(), null, res)
            }
            return callback.send(null, callback.success(data), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(), null, res)
        }
    }

    static async verifyPayment(req, res) {
        const { id } = req.params
        try {
            await Booking.update({
                paymentStatus: true
            }, {
                where: {
                    id
                }
            })
            return callback.send(null, callback.success(), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(), null, res)
        }
    }

    static async export(req, res) {
        const { limit, status, month_count } = req.query
        try {
            const whereQuery = {}
            if (status) {
                switch (status) {
                    case 'paid':
                        whereQuery.paymentStatus = true
                        break
                    case 'not_paid':
                        whereQuery.paymentStatus = false
                        break;
                }
            }
            if (month_count && Number(month_count) > 0) {
                whereQuery.createdAt = where(fn('MONTH', col('booking.created_at')), month_count);
            }
            const data = await Booking.findAll({
                where: whereQuery,
                include: [{
                    model: User,
                    attributes: ['id', 'email', 'username', 'nama', 'jenisKelamin', 'pekerjaan', 'whatsappNumber']
                },
                {
                    model: Room
                }
                ]
            })

            const workbook = new Workbook
            const worksheet = workbook.addWorksheet('booking-' + moment().format('YYYY-MM-DD'))
            worksheet.columns = [
                { header: 'No', key: 'no' },
                { header: 'Nama', key: 'nama' },
                { header: 'Nomor kamar', key: 'number_kamar' },
                { header: 'Durasi', key: 'durasi' },
                { header: 'Pekerjaan', key: 'pekerjaan' },
                { header: 'Kontak', key: 'kontak' },
                { header: 'Pembayaran', key: 'pembayaran' },
            ]

            data.forEach((d, i) => {
                const excelData = {
                    no: i + 1,
                    nama: d.user.nama,
                    number_kamar: `${d.room.lantai}:${d.room.nomorKamar}`,
                    durasi: `${moment(d.startDate).format('DD MMM YYYY')} - ${moment(d.endDate).format('DD MMM YYYY')}`,
                    pekerjaan: d.user.pekerjaan,
                    kontak: d.user.whatsappNumber,
                    pembayaran: d.paymentStatus ? 'Verified' : 'Not Verified'
                }
                worksheet.addRow(excelData)
            })

            const buffer = await workbook.xlsx.writeBuffer()
            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.header('Content-Disposition', `attachment; filename=booking-${Date.now()}.xlsx`);
            return res.send(buffer)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(), null, res)
        }
    }
}

module.exports = BookingController