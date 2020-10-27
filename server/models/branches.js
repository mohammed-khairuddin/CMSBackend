'use strict'

module.exports = (sequelize, DataTypes) => {
  const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
  const branch= sequelize.define('branch', {   
            itemName: {
            type: DataTypes.STRING,
            required: true
            },   
            docId: {
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
  return branch;
}