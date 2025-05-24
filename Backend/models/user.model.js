import { sequelize } from "../config/db.config.js";
import { Sequelize, DataTypes } from "sequelize";


const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default User;