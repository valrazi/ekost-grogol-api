const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define('users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jenisKelamin: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'jenis_kelamin'
    },
    pekerjaan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    whatsappNumber: {
        type: DataTypes.STRING,
        allowNull: false
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
        beforeCreate: async (user) => {
          const lastData = await User.findAll({
            order: [['createdAt', 'DESC']],
            limit: 1
          });
          const lastId = lastData.length > 0 ? parseInt(lastData[0].id.slice(3), 10) : 0;
          const id = lastId + 1;
          user.id = `USR${id.toString().padStart(3, '0')}`;
        }
      }
})

module.exports = User