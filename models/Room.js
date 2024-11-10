const { DataTypes } = require("sequelize");
const db = require("../db");
const RoomType = require("./RoomType");

const Room = db.define('room', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
    nomorKamar: {
        type: DataTypes.INTEGER,
        field: 'nomor_kamar'
    },
    lantai: DataTypes.INTEGER,
    room_type_id: {
        type: DataTypes.STRING,
        references: {
            model: 'room_type',
            key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
    },
   status: DataTypes.STRING,
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
      beforeCreate: async (room) => {
          const lastData = await Room.findAll({
              order: [['createdAt', 'DESC']]
          })

          const id = lastData.length == 0 ? 1 : lastData.length + 1
          room.id = `RDL${id.toString().padStart(3, '0')}`
      }
  }
})

RoomType.hasMany(Room, {foreignKey: 'room_type_id'})
Room.belongsTo(RoomType, {foreignKey: 'room_type_id'})

module.exports = Room
