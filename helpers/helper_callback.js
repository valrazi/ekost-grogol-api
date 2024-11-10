const pjson = require("../package.json")
const logger = require("./logger")
const moment = require("moment")
const httpContext = require("express-http-context")
const err_msg = require("./error_messages")

class callback {
    static send(error, result, response){
        let benchmark = moment().diff(httpContext.get("timestamp"), "ms")
        if(error && error.code >= 400){
            let r_data = { error: { code: error.code, title: error.message, message: err_msg[error.message] }, data: error.data, meta: { version: pjson.version } }
            logger.responseOut(r_data, benchmark)
            response.status(error.code >= 1000 ? 400 : error.code).send(r_data)
        } else {
            let r = this.success(result || {}),
                r_data = { data: r.data, meta: { version: pjson.version } }
            logger.responseOut(r_data, benchmark)
            response.status(r.code).send(r_data)
        }
    }

    static obj(code, message, data = {}){
        return { code, message, version: pjson.version, data }
    }

    static success(data){
        return this.obj(200, "success", data)
    }

    static unauth(){
        return this.obj(401, "unauthorized")
    }

    static forbidden(){
        return this.obj(403, "forbidden")
    }

    static general_error(data){
        return this.obj(500, "general_error", data)
    }
    
    static dynamic_medusa_error(data) {
        return this.obj(1001, `${data.message}`, null)
    }

    static not_found(data){
        return this.obj(404, "not_found", data)
    }

    static bad_request(data, message = "bad_request"){
        return this.obj(400, message, data)
    }

    static invalid_parameter(data){
        return this.obj(1001, "invalid_parameter", data)
    }

    static invalid_account(){
        return this.obj(1002, "invalid_account")
    }

    static invalid_credentials(){
        return this.obj(1003, "invalid_credentials")
    }

    static no_data() {
        return this.obj(1004, "no_data")
    }

    static registered() {
        return this.obj(1005, "registered")
    }

    static account_exist() {
        return this.obj(1006, "account_exist")
    }

    static mismatch_password_confirm() {
        return this.obj(1011, "mismatch_password_confirm")
    }

    static incorrect_password() {
        return this.obj(1012, "incorrect_password")
    }

}

module.exports = callback