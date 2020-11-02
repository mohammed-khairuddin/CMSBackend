'use strict'

module.exports = (sequelize, DataTypes) => {
  const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
  const otherDetails= sequelize.define('otherdetails', {   
     patientId: {
        type: DataTypes.INTEGER,
       required: true
    },    
    refferedby: {
        type: DataTypes.STRING,
       required: true
    }, 
    nameofclinic: {
        type: DataTypes.STRING,
       required: true
    }, 
    followup: {
        type: DataTypes.STRING,
       required: true
    }, 
    weightinkgs: {
        type: DataTypes.INTEGER,
       required: true
    },     
    heightincms: {
        type: DataTypes.INTEGER,
       required: true
    }, 
    bloodgroup: {
        type: DataTypes.STRING,
       required: true
    }, 
    hipdiameter: {
        type: DataTypes.STRING,
       required: true
    }, 
    waistdiameter: {
        type: DataTypes.STRING,
       required: true
    }, 
    bpsystolic: {
        type: DataTypes.STRING,
       required: true
    },
    bpdiastolic: {
      type: DataTypes.STRING,
     required: true
  },
    pulserate: {
        type: DataTypes.STRING,
       required: true
    }, 
    SPO2: {
        type: DataTypes.STRING,
       required: true
    },
    temperature: {
        type: DataTypes.STRING,
       required: true
    }, 
    bmi: {
        type: DataTypes.STRING,
       required: true
    },
    bsa: {
        type: DataTypes.STRING,
       required: true
    },
    });
  return otherDetails;
};