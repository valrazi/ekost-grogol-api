const callback = require("../helpers/Callback");
const Images = require("../models/Images");
const Room = require("../models/Room");
const RoomType = require("../models/RoomType");

class PublicController {
    static async roomTypeAll(req, res) {
        try {
            const data = await RoomType.findAll({
                include: [
                    {
                        model: Room,
                        where: {
                            status: 'available',
                        },
                        required: false
                    },
                    {
                        model: Images
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            const total = await RoomType.count()
    
            const response = {
                rows: data,
                total
            }
            return callback.send(null,  callback.success(response), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(),  null, res)
        }
    }
}

module.exports = PublicController