module.exports = (sequelize, DataTypes) => {
	const medicineMaster = sequelize.define('medicinemaster', {
        
medicinename: {
    type: DataTypes.STRING
},
  genericname: {
    type: DataTypes.STRING
},
  typeofmedicine: {
    type: DataTypes.STRING
},  
  unitofmeasurement: {
    type: DataTypes.STRING
},
 
});
	
return medicineMaster;
}