const { DataTypes } = require('sequelize');
const db = require('../db');
const RoomType = require('./RoomType'); // Import RoomType model

const Images = db.define('images', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  room_type_id: {
    type: DataTypes.STRING,
    references: {
      model: 'room_type',
      key: 'id'
    },
    allowNull: false,
    onDelete: 'CASCADE'
  },
  url: DataTypes.TEXT,
  objectKey: {
    type: DataTypes.TEXT,
    field: 'object_key'
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
    beforeCreate: async (image) => {
      const lastData = await Images.findAll({
        order: [['createdAt', 'DESC']]
      })

      const id = lastData.length == 0 ? 1 : lastData.length + 1
      image.id = `IMG${id.toString().padStart(3, '0')}`
    }
  }
})

// Set the foreign key relationship between Images and RoomType
RoomType.hasMany(Images, { foreignKey: 'room_type_id' })
Images.belongsTo(RoomType, { foreignKey: 'room_type_id' })


module.exports = Images;
