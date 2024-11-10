const { DataTypes } = require("sequelize");
const db = require("../db");
const Booking = require("./Booking");

const Keluhan = db.define('keluhan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    responded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    show: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    reply: {
        type: DataTypes.STRING
    },
    respondedAt: {
        type: DataTypes.DATE,
        field: 'responded_at',
    },
    booking_id: {
        type: DataTypes.STRING,
        references: {
            model: 'booking',
            key: 'id'
        },
        allowNull: false,
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
        beforeCreate: async (keluhan) => {
            const lastData = await Keluhan.findAll({
                order: [['createdAt', 'DESC']]
            })

            const id = lastData.length == 0 ? 1 : lastData.length + 1
            keluhan.id = `ISU${id.toString().padStart(3, '0')}`
        }
    }
})

Booking.hasMany(Keluhan, { foreignKey: 'booking_id' })
Keluhan.belongsTo(Booking, { foreignKey: 'booking_id' })

module.exports = Keluhan