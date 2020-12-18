'use strict'

module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const DurationMaster= sequelize.define('DurationMaster', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }       
      });
    return DurationMaster;
  };