module.exports = (sequelize, DataTypes) => {
  const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
  const HospitalType= sequelize.define('hospitalType', {   
    itemName: {
      type: DataTypes.STRING,
     required: true
      }       
    }); 
  return HospitalType;
};