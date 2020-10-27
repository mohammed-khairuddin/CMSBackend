'use strict'

module.exports = (sequelize, DataTypes) => {
  const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
  const generalClinicManagement = sequelize.define('generalclinicmanagement', {
    // id: {
    //   type: DataTypes.UUID,
    //   primaryKey: true,
    //   defaultValue: DataTypes.UUIDV4,
    //   allowNull: false
    // },
    name: {
      type: DataTypes.STRING,
      required: true
    },
    address: {
      type: DataTypes.STRING,
      required: true
    },
    role: {
      type: DataTypes.STRING,
      required: true
    },
    
    email: {
      type: DataTypes.STRING,
      required: true
    },
    mobNo: {
      type: DataTypes.STRING,
      required: true
    },
    username: {
      type: DataTypes.STRING,
      required: true
    },
    password: {
      type: DataTypes.STRING,
     required: true

    },
    country: {
      type: DataTypes.STRING,
     required: true

    },
    state: {
      type: DataTypes.STRING,
     required: true

    },
    city: {
      type: DataTypes.STRING,
     required: true

    },
    type: { 
      type: DataTypes.STRING,
      required: true
    },
speciality: { 
  type: DataTypes.STRING,
  required: true
},
clinictype: { 
  type: DataTypes.STRING,
  required: true
},
phonenumber : { 
  type: DataTypes.STRING,
  required: true
},
emergencynumber : { 
  type: DataTypes.STRING,
  required: true
},
emergencymobnumber : { 
  type: DataTypes.STRING,
  required: true
},
whatsappno : { 
  type: DataTypes.STRING,
  required: true
},

district : { 
  type: DataTypes.STRING,
  required: true
},
citycode : { 
  type: DataTypes.STRING,
  required: true
},
pincode: { 
  type: DataTypes.STRING,
  required: true
},
otherdetails: { 
  type: DataTypes.STRING,
  required: true
},
url : { 
  type: DataTypes.STRING,
  required: true
},
ambulance : { 
  type: DataTypes.STRING,
  required: true
},
ambulancephno: { 
  type: DataTypes.STRING,
  required: true
},
googlemaplocation: { 
  type: DataTypes.STRING,
  required: true
},
profileImagesId:{
  type: DataTypes.STRING,
  required:true
},
logoImagesId:{
type: DataTypes.STRING,
required:true
},
    
   }, 
  {
    underscored: true
  });
  return generalClinicManagement;
};