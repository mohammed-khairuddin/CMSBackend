module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const HospitalSpeciality= sequelize.define('hospitalSpeciality', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }       
      }); 
    return HospitalSpeciality;
  };