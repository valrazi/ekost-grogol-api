const { DataTypes } = require("sequelize");
const db = require("../db");
const User = require("./User");
const Room = require("./Room");
const Booking = db.define('booking', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date'
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_date'
    },
    totalPrice: {
        type: DataTypes.DOUBLE,
        field: 'total_price'
    },
    transferProof: {
        type: DataTypes.TEXT,
        field: 'transfer_proof'
    },
    paymentStatus: {
        type: DataTypes.BOOLEAN,
        field: 'payment_status'
    },
    expired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    user_id: {
        type: DataTypes.STRING,
        references: {
            model: 'users',
            key: 'id',
        },
        allowNull: true,
        onDelete: 'CASCADE'
    },
    room_id: {
        type: DataTypes.STRING,
        references: {
            model: 'room',
            key: 'id'
        },
        allowNull: true,
        onDelete: 'CASCADE'
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
    },
    deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
    },
}, { 
    timestamps: true, 
    freezeTableName: true, 
    hooks: {
        beforeCreate: async(booking) => {
            const lastData = await Booking.findAll({
                order:[['createdAt', 'DESC']]
            })

            const id = lastData.length == 0 ? 1 : lastData.length + 1
            booking.id = `TRX${id.toString().padStart(3, '0')}`
        }
    }
})

User.hasMany(Booking, {foreignKey: 'user_id'})
Booking.belongsTo(User, {foreignKey: 'user_id'})

Room.hasMany(Booking, {foreignKey: 'room_id'})
Booking.belongsTo(Room, {foreignKey: 'room_id'})

module.exports = Booking