'use strict'

module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const RegimeMaster= sequelize.define('RegimeMaster', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }       
      });
    return RegimeMaster;
  };