'use strict'

module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const DiagnosisMaster= sequelize.define('diagnosisMaster', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }  
      });
    return DiagnosisMaster;
  };