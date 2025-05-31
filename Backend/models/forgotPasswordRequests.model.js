import { sequelize } from "../config/db.config.js";
import { Sequelize, DataTypes } from "sequelize";
import { User } from "./user.model.js";

export const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequests', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
})

User.hasMany(ForgotPasswordRequests, { foreignKey: "userId" });
ForgotPasswordRequests.belongsTo(User, { foreignKey: "userId" });