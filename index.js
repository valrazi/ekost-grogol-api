require('dotenv').config()
const db = require('./db')
const multer = require('multer')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const pjson = require('./package.json')
const moment = require('moment')
const roomTypeRoutes = require('./routers/RoomTypeRoutes')
const roomRoutes = require('./routers/Room')
const userRoutes = require('./routers/User')
const bookingRoutes = require('./routers/Booking')
const keluhanRoutes = require('./routers/Keluhan')
const AdminController = require('./controllers/AdminController')
var rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8')
    }
}
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json({ limit: '20mb', verify: rawBodySaver }))
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }))
var httpContext = require('express-http-context');
const CommonController = require('./controllers/CommonController')
const callback = require('./helpers/helper_callback')
const PublicController = require('./controllers/PublicController')
const ReservationController = require('./controllers/ReservationController')
app.use(httpContext.middleware);

app.use(cors())
app.disable('etag')
app.get('/api/public/room-type', PublicController.roomTypeAll)
app.post('/api/public/reservation', ReservationController.create)
app.get('/api/reservation', ReservationController.findAll)
app.put('/api/reservation/accept/:id', ReservationController.accept)
app.use('/api/room-type', roomTypeRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/user', userRoutes)
app.post('/api/admin/login', AdminController.login)
app.get('/api/admin/analytics', AdminController.analyticDashboard)
app.use('/api/booking', bookingRoutes)
app.use('/api/keluhan', keluhanRoutes)
app.post('/api/media-multi', upload.array('images', 10) , CommonController.upMultiImage)
app.post('/api/media-single', upload.single('images') , CommonController.upSingleImage)
app.get('*', (req, res) => {
    callback.send(callback.not_found(), null, res)
})

app.post('*', (req, res) => {
    callback.send(callback.not_found(), null, res)
})

app.patch('*', (req, res) => {
    callback.send(callback.not_found(), null, res)
})

app.delete('*', (req, res) => {
    callback.send(callback.not_found(), null, res)
})

app.put('*', (req, res) => {
    callback.send(callback.not_found(), null, res)
})

var server = require('http').createServer(app)
const PORT = process.env.PORT
db.sync()
    .then(() => {
        console.log(`DB Started Successfully`)

        server.listen(PORT, () => {
            console.log('Server Running on PORT: ' + PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })

