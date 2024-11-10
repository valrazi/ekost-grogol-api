const callback = require("../helpers/helper_callback");
const r2Bucket = require("../helpers/storage");
const fs = require('fs');
require('dotenv').config()
const mime = require('mime-types'); // Import mime-types library

class CommonController {
    static async upMultiImage(req, res) {
        try {
            const uploadPromise = req.files.map(async (f) => {
                const objectName = `${Date.now()}-${f.originalname}`;
                const fileStream = fs.createReadStream(f.path);
                const mimeType = mime.lookup(f.originalname) || 'application/octet-stream';
                const uploaded = await r2Bucket.uploadStream(fileStream, objectName, undefined, mimeType)
                fs.unlinkSync(f.path)
                return uploaded
            })
            const imageUrls = await Promise.all(uploadPromise)
            return callback.send(null, callback.success(imageUrls), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(error), null, res)
        }
    }

    static async upSingleImage(req, res) {
        try {
            const f = req.file
            console.log({f})
            const objectName = `${Date.now()}-${f.originalname}`;
            const fileStream = fs.createReadStream(f.path);
            const mimeType = mime.lookup(f.originalname) || 'application/octet-stream';
            const uploaded = await r2Bucket.uploadStream(fileStream, objectName, undefined, mimeType)
            fs.unlinkSync(f.path)
            return callback.send(null, callback.success(uploaded), res)
        } catch (error) {
            console.log(error)
            return callback.send(callback.general_error(error), null, res)
        }
    }

}

module.exports = CommonController