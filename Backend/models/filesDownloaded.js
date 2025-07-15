import { sequelize } from "../config/db.config.js";
import { DataTypes } from "sequelize";
import {User} from "../models/user.model.js"

export const FilesDownloaded = sequelize.define('FilesDownloaded',{
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
    }
})


User.hasMany(FilesDownloaded, {foreignKey: "userId"});
FilesDownloaded.belongsTo(User, {foreignKey: "userId"});
