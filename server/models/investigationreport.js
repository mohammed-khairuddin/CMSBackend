'use strict'

module.exports = (sequelize, DataTypes) => {
  const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
  const investigationReport= sequelize.define('investigationreport', {
investigationreport:{
    type:DataTypes.JSON,
    required:true
}
});
  return investigationReport;
}; 