'use strict'

module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const ReligionMaster= sequelize.define('religionMaster', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }  
      });
    return ReligionMaster;
  };