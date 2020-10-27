'use strict'
module.exports = (sequelize, DataTypes) => {
  const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
  const generalDoctorManagement = sequelize.define('generaldoctormanagement', {
      name: { 
      type: DataTypes.STRING,
      required: true
    },
    middlename: { 
      type: DataTypes.STRING,
      required: true
    },
    lastname: { 
      type: DataTypes.STRING,
      required: true
    },
    salutation: { 
      type: DataTypes.STRING,
      required: true
    },
    branch: { 
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
    phonenumber: {
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
  address: {
    type: DataTypes.STRING,
    required: true
  },
  otherdetails: {
    type: DataTypes.STRING,
    required: true
  },
  clinicId: {
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
qualification : {
  type: DataTypes.STRING,
 required: true

},
specialitydoctor: {
  type: DataTypes.STRING,
 required: true

},

pincode: {
  type: DataTypes.STRING,
 required: true

},
degreedoctor: {
  type: DataTypes.STRING,
 required: true

},
branch: {
  type: DataTypes.STRING,
 required: true

},
timingsdays: {
  type: DataTypes.STRING,
 required: true

},
timingshours: {
  type: DataTypes.STRING,
 required: true

},
googlemaplocation: { 
  type: DataTypes.STRING,
  required: true
},

   }, 
  {
    underscored: true
  });
  return generalDoctorManagement;
};