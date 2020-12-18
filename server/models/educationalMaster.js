'use strict'

module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const EducationalMaster= sequelize.define('educationalMaster', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }  
      });
    return EducationalMaster;
  };