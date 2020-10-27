module.exports = (sequelize, DataTypes) => {
    const TIMESTAMP = require('sequelize-mysql-timestamp')(sequelize);
    const BranchMaster= sequelize.define('branchMaster', {   
      itemName: {
        type: DataTypes.STRING,
       required: true
        }       
      });
    return BranchMaster;
  };