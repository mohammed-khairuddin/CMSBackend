'use strict'

module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const TabletsMaster= sequelize.define('TabletsMaster', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }       
      });
    return TabletsMaster;
  };