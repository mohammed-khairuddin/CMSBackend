'use strict'

module.exports = (sequelize, DataTypes) => {
  const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
  const services= sequelize.define('services', {   
            itemName: {
            type: DataTypes.STRING,
            required: true
            },   
            clinicId: {
            type: DataTypes.INTEGER,
            required: true
            }, 
            itemid: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
            },
            id:{
            type:DataTypes.INTEGER
            }
    });
  return services;
};