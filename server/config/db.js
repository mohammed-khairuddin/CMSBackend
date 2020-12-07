'use strict'

const Sequelize = require('sequelize');
const env = require('./../../.env');
const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: env.DATABASE_DIALECT,
  define: {
    underscored: true
  }
});

// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Models/tables
db.clinicManagement = require('../models/clinicManagement.js')(sequelize, Sequelize);
db.doctorManagement = require('../models/doctorManagement.js')(sequelize, Sequelize);
db.doctorAssignment = require('../models/doctorAssignment.js')(sequelize, Sequelize);
db.assignmentStatus = require('../models/assignmentStatus.js')(sequelize, Sequelize);
db.loginLookUp=require('../models/loginLookUp.model.js')(sequelize, Sequelize);
db.admin=require('../models/admin.model.js')(sequelize, Sequelize);

db.anteriorSeptum=require('../models/anteriorSeptum.js')(sequelize, Sequelize);
db.anteriorWall=require('../models/anteriorWall.js')(sequelize, Sequelize);
db.aorta=require('../models/aorta.js')(sequelize, Sequelize);
db.aorticValve=require('../models/aorticValve.js')(sequelize, Sequelize);
db.conclusion=require('../models/conclusion.js')(sequelize, Sequelize);
db.doctorAdvice=require('../models/doctorAdvice.js')(sequelize, Sequelize);
db.inferiorSeptum=require('../models/inferiorSeptum.js')(sequelize, Sequelize);
db.inferiorVenaCava=require('../models/inferiorVenaCava.js')(sequelize, Sequelize);
db.inferiorWall=require('../models/inferiorWall.js')(sequelize, Sequelize);
db.intracardiacData=require('../models/intracardiacData.js')(sequelize, Sequelize);
db.intraCardiacTumour=require('../models/intraCardiacTumour.js')(sequelize, Sequelize);
db.lateralWall=require('../models/lateralWall.js')(sequelize, Sequelize);
db.leftAtrium=require('../models/leftAtrium.js')(sequelize, Sequelize);
db.leftVentrical=require('../models/leftVentrical.js')(sequelize, Sequelize);
db.leftVentricalFunction=require('../models/leftVentricalFunction.js')(sequelize, Sequelize);
db.mitralValve=require('../models/mitralValve.js')(sequelize, Sequelize);
db.pericardialEffusion=require('../models/pericardialEffusion.js')(sequelize, Sequelize)
db.pericardium=require('../models/pericardium.js')(sequelize, Sequelize);
db.posteriorWall=require('../models/posteriorWall.js')(sequelize, Sequelize);
db.pulmonaryArtery=require('../models/pulmonaryArtery.js')(sequelize, Sequelize);
db.pulmonaryVein=require('../models/pulmonaryVein.js')(sequelize, Sequelize);
db.pulmonicValve=require('../models/pulmonicValve.js')(sequelize, Sequelize);
db.rightAtrium=require('../models/rightAtrium.js')(sequelize, Sequelize);
db.rightVentricalFunction=require('../models/rightVentricalFunction.js')(sequelize, Sequelize);
db.rightVentricle=require('../models/rightVentricle.js')(sequelize, Sequelize);
db.tricuspidValve=require('../models/tricuspidValve.js')(sequelize, Sequelize);
db.venous=require('../models/venous.js')(sequelize, Sequelize);

db.impressions=require('../models/impressions.js')(sequelize, Sequelize);
db.speckleTracking=require('../models/speckleTracking.js')(sequelize, Sequelize);

//
db.regionalwallmotion = require('../models/regionalwallmotion')(sequelize, Sequelize);
db.impressionreport = require('../models/impressionsreport')(sequelize, Sequelize);
db.conclusionreport = require('../models/conclusionreport')(sequelize, Sequelize);
db.doctoradvicereport = require('../models/doctoradvicereport')(sequelize, Sequelize);
db.speckletrackingreport = require('../models/speckletrackingreport')(sequelize, Sequelize);


db.doctorAdviceComments = require('../models/doctorAdviceComments')(sequelize, Sequelize);
db.conclusionsComments = require('../models/conclusionsComments')(sequelize, Sequelize);
db.impressionComments = require('../models/impressionComments')(sequelize, Sequelize);
db.observtaionComments = require('../models/observtaionComments')(sequelize, Sequelize);
//

db.educationalMaster=require('../models/educationalMaster')(sequelize, Sequelize);
db.salutationMaster=require('../models/salutationMaster')(sequelize, Sequelize);
db.hospitalSpeciality=require('../models/hospitalSpeciality')(sequelize, Sequelize);
db.hospitalService=require('../models/hospitalService')(sequelize, Sequelize);
db.hospitalType=require('../models/hospitalType')(sequelize, Sequelize);
db.religionMaster=require('../models/religionMaster')(sequelize, Sequelize);
db.occupationMaster=require('../models/occupationMaster')(sequelize, Sequelize);
db.diagnosisMaster=require('../models/diagnosisMaster')(sequelize, Sequelize);
db.complaintsMaster=require('../models/complaintsMaster')(sequelize, Sequelize);
db.branchMaster=require('../models/branchMaster')(sequelize, Sequelize);
db.martialStatus=require('../models/maritalStatus')(sequelize, Sequelize);

db.gender = require('../models/gendermaster')(sequelize, Sequelize);
db.state = require('../models/statemaster')(sequelize, Sequelize);
db.country = require('../models/countrymaster')(sequelize, Sequelize);
db.referralcomment = require('../models/referralcomment')(sequelize, Sequelize);
db.complains = require('../models/complains')(sequelize, Sequelize);

db.otherdetails = require('../models/otherdetails')(sequelize, Sequelize);
db.familymodel = require('../models/familymodel')(sequelize, Sequelize);
db.lifestyle = require('../models/lifestyle')(sequelize, Sequelize);
db.investigationreport = require('../models/investigationreport')(sequelize, Sequelize);


//////////////////////////////////////////masters
db.durationMaster = require('../models/durationmaster')(sequelize, Sequelize);
db.tabletsMaster = require('../models/tabletsMaster')(sequelize, Sequelize);
db.periodMaster = require('../models/periodMaster')(sequelize, Sequelize);
db.syrupMaster = require('../models/syrupMaster')(sequelize, Sequelize);


////////////////////////////

db.generalClinicManagement = require('../models/generalClinicManagement.js')(sequelize, Sequelize);
db.generalDoctorManagement = require('../models/generalDoctorManagement.js')(sequelize, Sequelize);

db.services = require('../models/services')(sequelize, Sequelize);
db.speciality = require('../models/speciality')(sequelize, Sequelize);
db.branches = require('../models/branches')(sequelize, Sequelize);


/////////////////////////////////////////////////
db.patientMaster=require('../models/patientMaster')(sequelize, Sequelize);
db.kinMaster = require('../models/kinmaster')(sequelize, Sequelize);

db.patientmodel=require('../models/patientmodel')(sequelize, Sequelize);

db.observations=require('../models/observations')(sequelize, Sequelize);

db.doctorAssignment.belongsTo(db.doctorManagement);
db.doctorAssignment.belongsTo(db.clinicManagement);

////////////////////////////////////

db.observationsItem = require('../models/observationsItem')(sequelize, Sequelize);



module.exports = db;