require('dotenv').config()
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");
const callback = require('./Callback');
const User = require('../models/User');
const Admin = require('../models/Admin');
const srt = process.env.JWT_SECRET;

class AuthHelper {
    static hash_password(password) {
        return bcrypt.hashSync(password, 10);
    };

    static hash_verify(input, password) {
        return bcrypt.compareSync(input, password);
    };

    static encrypt_token(payload) {
        return jwt.encode(payload, srt);
    };

    static decrypt_token(token) {
        return jwt.decode(token, srt);
    };
    static async admin_jwt_validation(req, res, next) {
        try {
            const authHeader = req.header("Authorization");
            if (!authHeader) {
                return callback.send(callback.unauth(), null, res)
            }
            const [n, token] = authHeader.split(" ");
            console.log({authHeader})
            const decrypted_token = AuthHelper.decrypt_token(token);
            const { id, username } = decrypted_token
            const found = await Admin.findOne({
                where: {
                    id,
                    username
                }
            })
            if (!found) {
                return callback.send(callback.unauth(), null, res)
            }
            const admin = found.toJSON()
            delete admin.password
            req.user = admin
            next()
        } catch (error) {
            console.log(error);
            return callback.send(callback.general_error(error), null, res);
        }
    };
    static async jwt_validation(req, res, next) {
        try {
            const authHeader = req.header("Authorization");
            if (!authHeader) {
                return callback.send(callback.unauth(), null, res)
            }
            const [n, token] = authHeader.split(" ");
            console.log({authHeader})
            const decrypted_token = AuthHelper.decrypt_token(token);
            const { id, username } = decrypted_token
            const found = await User.findOne({
                where: {
                    id, username
                }
            })
            if (!found) {
                return callback.send(callback.unauth(), null, res)
            }
            const user = found.toJSON()
            delete user.password
            req.user = user
            next()
        } catch (error) {
            console.log(error);
            return callback.send(callback.general_error(error), null, res);
        }
    };
}

module.exports = AuthHelper