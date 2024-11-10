const { DataTypes } = require("sequelize");
const db = require("../db");

const Admin = db.define('admins', {
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
        beforeCreate: async(admin) => {
            const lastData = await Admin.findAll({
                order:[['createdAt', 'DESC']]
            })

            const id = lastData.length == 0 ? 1 : lastData.length + 1
            admin.id = `ADM${id.toString().padStart(3, '0')}`
        }
    }
})

module.exports = Admin