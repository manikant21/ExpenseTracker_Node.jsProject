import { sequelize } from "../config/db.config.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";

export const Order = sequelize.define("Order", {
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  paymentStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "PENDING" // Other values: "PAID", "FAILED"
  }
});

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });
