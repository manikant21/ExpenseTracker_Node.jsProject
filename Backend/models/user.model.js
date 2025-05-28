import { sequelize } from "../config/db.config.js";
import { Sequelize, DataTypes } from "sequelize";


export const User = sequelize.define('User', {
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
    },

    isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  totalExpenses: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
})

