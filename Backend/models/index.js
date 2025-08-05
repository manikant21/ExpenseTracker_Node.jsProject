// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;


// import fs from 'fs';
// import path from 'path';
// import { Sequelize, DataTypes } from 'sequelize';
// import { fileURLToPath } from 'url';
// import configFile from '../config/config.json' assert { type: 'json' };

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = configFile[env];

// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// const modelFiles = fs
//   .readdirSync(__dirname)
//   .filter(file =>
//     file.endsWith('.js') &&
//     file !== basename &&
//     !file.endsWith('.test.js')
//   );

// for (const file of modelFiles) {
//   const modelModule = await import(path.join(__dirname, file));
//   const model = modelModule.default(sequelize, DataTypes);
//   db[model.name] = model;
// }

// for (const modelName of Object.keys(db)) {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// }

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// export default db;
