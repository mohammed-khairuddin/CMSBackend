module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const Family= sequelize.define('family', {   
        patientno: {
          type: DataTypes.STRING,
        required:true
        },
        diabetic: {
          type: DataTypes.STRING,
         required: true
          },   
          detectiondate: {
            type: DataTypes.STRING,
           required: true
            },  
            diabetictype: {
                type: DataTypes.STRING,
               required: true
                },
               yearsofdiabetic: {
                    type: DataTypes.STRING,
                   required: true
          },
          diabeticcoma: {
            type: DataTypes.STRING,
           required: true
            },   
            gangreon: {
                type: DataTypes.STRING,
               required: true
                },
        diabeticcomplication: {
                type: DataTypes.STRING,
               required: true
            }, 
            period: {
                type: DataTypes.STRING,
               required: true
            },
            familydiabetic: {
                type: DataTypes.STRING,
               required: true
            },
            fatherdiabetc: {
                type: DataTypes.STRING,
               required: true
            }, 
            familydiabetictype: {
                type: DataTypes.STRING,
               required: true
            }, 
            motherdiabetic: {
                type: DataTypes.STRING,
               required: true
            },
            motherdiabetictype: {
                type: DataTypes.STRING,
               required: true
            },
            siblingdiabetic: {
                type: DataTypes.STRING,
               required: true
            },  
            siblingdiabetictype: {
                type: DataTypes.STRING,
               required: true
            }, 
            cardiachistory: {
                type: DataTypes.STRING,
               required: true
            }, 
            cardiacdeath: {
                type: DataTypes.STRING,
               required: true
            }, 
            relationship : {
                type: DataTypes.STRING,
               required: true
            },
            Hypertension  : {
                type: DataTypes.STRING,
               required: true
            },
            Hypertensiondeath  : {
                type: DataTypes.STRING,
               required: true
            },
            relationshipwithpatient  : {
                type: DataTypes.STRING,
               required: true
            },
            kidneyproblem  : {
                type: DataTypes.STRING,
               required: true
            },
            kidneyproblemdeath  : {
                type: DataTypes.STRING,
               required: true
            },  
            kidneyproblemdeathinfamily  : {
                type: DataTypes.STRING,
               required: true
            },
            kidneyproblemdeathinfamilyrelation  : {
                type: DataTypes.STRING,
               required: true
            },        
            liverfailureinfamily  : {
                type: DataTypes.STRING,
               required: true
            }, 
            liverfailuredeath  : {
                type: DataTypes.STRING,
               required: true
            },
            liverfailuredeathrelation : {
                type: DataTypes.STRING,
               required: true
            },  
            thyroidhistory : {
                type: DataTypes.STRING,
               required: true
            },   
            thyroidhistorydeath  : {
                type: DataTypes.STRING,
               required: true
            },      
            thyroidhistorydeathrelation  : {
                type: DataTypes.STRING,
               required: true
            }, 
            strokehistory : {
                type: DataTypes.STRING,
               required: true
            },    
            strokehistorydeath  : {
                type: DataTypes.STRING,
               required: true
            },       
            strokehistorydeathrelation  : {
                type: DataTypes.STRING,
               required: true
            },
            cancerhistory  : {
                type: DataTypes.STRING,
               required: true
            },
            cancerhistorydeath  : {
                type: DataTypes.STRING,
               required: true
            },
            cancerhistorydeathrelation  : {
                type: DataTypes.STRING,
               required: true
            },
            mentaldisorderhistory  : {
                type: DataTypes.STRING,
               required: true
            },
            mentaldisorderhistorydeath  : {
                type: DataTypes.STRING,
               required: true
            },
            mentaldisorderhistorydeathrelation  : {
                type: DataTypes.STRING,
               required: true
            },
             });
    return Family;
  };