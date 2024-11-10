const pjson = require('../package.json')
const moment = require('moment')
var httpContext = require('express-http-context')
var url = require('url');

class logger {
    static timenow(format = undefined){
        if(format){
            return moment().utcOffset(7).format(format)
        }
        return moment().utcOffset(7)
    }

    /**
     * @param {string} string to be replace
     * @param {*} index 
     * @param {*} replacement 
     * @returns string
     */
     static replaceAt(string, index, replacement) {
        if (index >= string.length) {
            return string.valueOf();
        }

        return string.substring(0, index) + replacement + string.substring(index + 1);
    }

    static mysql_log(sql, timing) {
        this.log(sql, `${timing}ms`)
    }

    static jsonString(object, limit = 10000){
        if(object == undefined){
            return "{}"
        }
        var str = JSON.stringify(object)
        if(str.length > limit){
            return `Content too long (${str.length} characters)`
        } else {
            return str
        }
    }

    static async log(type, ...any){
        let reqId = httpContext.get('reqId') || "[no session]"
        if(["info", "error"].indexOf(type) !== -1){
            if(type == "error"){
                console.log('[ERROR]', this.timenow().toString(), "-", `app=${pjson.name}[${pjson.version}]`, "-", `session=${reqId}`, "-", ...any)
            } else {
                console.log('[INFO]', this.timenow().toString(), "-", `app=${pjson.name}[${pjson.version}]`, "-", `session=${reqId}`, "-", ...any)
            }
        } else {
            console.log('[INFO]', this.timenow().toString(), "-", `app=${pjson.name}[${pjson.version}]`, "-", `session=${reqId}`, "-", type, ...any)
        }
    }

    static error(...any){
        this.log("error", ...any)
    }

    static requestIn(req, res, next){
        let fullpath = url.parse(req.originalUrl).path
        var str = `Incoming request host=${req.protocol}://${req.hostname}, path=${fullpath}, method=${req.method}, headers=${this.jsonString(req.headers)}, user=${this.jsonString(req.user)}, query=${this.jsonString(req.query)}, params=${this.jsonString(req.params)}, body=${this.jsonString(req.body)}, files=${this.jsonString(req.files || req.file)}`
        this.log("info", str)
        next()
    }

    static responseOut(payload, benchmark){
        var str = `Send response with http status=${payload.error && payload.error.code ? (payload.error.code > 500 ? 400 : payload.error.code) : 200}, payload=${this.jsonString(payload)} (elapsed=${parseFloat(benchmark/1000)}s)`
        this.log("info", str)
    }

    static requestOut(payload, session){
        let endpoint = payload.url
        if(payload?.baseURL) {
            endpoint = payload?.baseURL + payload?.url
            if(payload?.baseURL?.endsWith("/") && payload.url?.startsWith("/")) {
                endpoint = payload?.baseURL + this.replaceAt(payload?.url, 0, "")
            }
        }
        if(payload?.auth) {
            if(payload.headers == undefined) payload.headers = {}
            payload.headers['Authorization'] = "Basic " + Buffer.from(payload?.auth?.username + ":" + payload?.auth?.password).toString('base64')
        }
        var str = `Request out with reqSession=${session}, to=${endpoint}, method=${payload.method || "get"}, headers=${this.jsonString(payload.headers)}, params=${this.jsonString(payload.params)} body=${this.jsonString(payload.data)}`
        this.log("info", str)
    }

    static responseIn(type, response, session, elapsed){
        if(type == "success"){
            var str = `Get response from reqSession=${session}, elapsed=${elapsed} ms, headers=${this.jsonString(response.headers)}, data=${this.jsonString(response.data)}`
            this.log("info", str)
        } else {
            var { payload, message } = response, data = {}, responseData = "{}"
            if(payload){
                data = payload
            }
            if(response.response){
                if(response.response.data){
                    let rd = response.response.data
                    if(typeof rd == "object"){
                        responseData = this.jsonString(rd)
                    } else {
                        responseData = rd
                    }
                }
            }
            var str = `Error response in from reqSession=${session}, elapsed=${elapsed}, message=${message}, headers=${this.jsonString(response.headers)} response=${responseData}`
            this.log("info", str)
        }
    }
}

module.exports = logger