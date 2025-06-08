import { sequelize } from "../config/db.config.js";
import { Sequelize, DataTypes } from "sequelize";
import {User} from "./user.model.js";

export const Expense = sequelize.define('Expense', {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    note: {  
        type: DataTypes.STRING,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }

})

User.hasMany(Expense, {foreignKey: "userId"});
Expense.belongsTo(User, {foreignKey: "userId"});

