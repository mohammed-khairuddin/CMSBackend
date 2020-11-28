'use strict'

module.exports = (sequelize, DataTypes) => {
  const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
  const lifeStyle= sequelize.define('lifeStyle', {
lifestyle:{
    type:DataTypes.JSON,
    required:true
}
});
  return lifeStyle;
};