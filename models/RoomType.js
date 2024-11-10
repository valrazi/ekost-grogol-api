const { DataTypes } = require('sequelize');
const db = require('../db');

const RoomType = db.define('room_type', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  nama: DataTypes.STRING,
  harga: DataTypes.DOUBLE,
  quantity: DataTypes.INTEGER,
  panjang: DataTypes.DOUBLE,
  lebar: DataTypes.DOUBLE,
  fasilitas: DataTypes.TEXT,
  isAc: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_ac',
  },
  isKulkas: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_kulkas',
  },
  isTv: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_tv',
  },
  kasur: DataTypes.STRING,
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
      beforeCreate: async (roomType) => {
          const lastData = await RoomType.findAll({
              order: [['createdAt', 'DESC']]
          })

          const id = lastData.length == 0 ? 1 : lastData.length + 1
          roomType.id = `RTD${id.toString().padStart(3, '0')}`
      }
  }
})

module.exports = RoomType;
