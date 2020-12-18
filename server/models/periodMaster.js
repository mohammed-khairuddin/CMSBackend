'use strict'

module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const PeriodMaster= sequelize.define('PeriodMaster', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }       
      });
    return PeriodMaster;
  };