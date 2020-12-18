'use strict'

module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const OccupationMaster= sequelize.define('occupationMaster', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }  
      });
    return OccupationMaster;
  };