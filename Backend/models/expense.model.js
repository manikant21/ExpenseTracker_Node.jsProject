import { sequelize } from "../config/db.config.js";
import { Sequelize, DataTypes } from "sequelize";

const Expense = sequelize.define('Expense', {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
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

export default Expense;