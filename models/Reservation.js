const { DataTypes, Sequelize } = require('sequelize');
const db = require('../db');

const Reservation = db.define('reservation', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  nama: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  dateReservation: {
    type: DataTypes.DATE,
    field: 'date_reservation'
  },
  timeReservation: {
    type: DataTypes.TIME,
    field: 'time_reservation'
  },
  isAccepted: {
    type: DataTypes.BOOLEAN,
    field: 'is_accepted',
    defaultValue: false
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
  paranoid: true,
  hooks: {
      beforeCreate: async (reservation) => {
          const lastData = await Reservation.findAll({
              order: [['createdAt', 'DESC']]
          })

          const id = lastData.length == 0 ? 1 : lastData.length + 1
          reservation.id = `RSV${id.toString().padStart(3, '0')}`
      }
  }
})

module.exports = Reservation;
