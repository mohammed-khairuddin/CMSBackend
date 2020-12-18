'use strict'

module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const syrupMaster= sequelize.define('syrupMaster', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }       
      });
    return syrupMaster; 
  };