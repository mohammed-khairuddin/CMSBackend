module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const TabletsMaster= sequelize.define('tabletsMaster', {   
        key: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        value: {
          type: DataTypes.STRING,
         required: true
          },     
      });
    return TabletsMaster;
  };