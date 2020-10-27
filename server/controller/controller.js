const db = require('../config/db');
const config = require('../config/config');
const ClinicManagement = db.clinicManagement;
const DoctorManagement = db.doctorManagement;
const AssignmentStatus = db.assignmentStatus;
const LoginLookUp = db.loginLookUp;
const Admin = db.admin;
const Role = db.role;
const Patient = db.patientmodel;
const LeftVentricle = db.leftVentrical;
const PatientMaster = db.patientMaster;
const KinMaster = db.kinMaster;
const Observations = db.observations;
const salutationMaster = db.salutationMaster;

const generalClinicManagement = db.generalClinicManagement;
const generalDoctorManagement = db.generalDoctorManagement;

const {sendEmail,textMessage} = require('../routes/registrationRoutes')

//const UUID = require('uuid-generate')
const multipart = require('connect-multiparty');
const Sequelize = require('sequelize');
//const uniqueKey = UUID.generate()
const _dirname = require('../../index')
const fs = require('fs');
const multer = require('multer');
const folderName = require('../router/routes/router');


function getFolderpath(req) {
  return  `main-directory/1/sai`
  }

// const multipartMiddleware =  multipart({ uploadDir: getFolderpath()})
// const multipartMiddlewareForProfileImages =  multipart({ uploadDir: './profileImages'})

const Op = db.Sequelize.Op;
var dicomParser = require('../../node_modules/dicom-parser/dist/dicomParser');

// Load in Rusha so we can calculate sha1 hashes
 var Rusha = require('../../node_modules/rusha/dist/rusha');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const clinicManagementModel = require('../models/clinicManagement');
const loginLookupModel = require('../models/loginLookUp.model');
// const assignmentStatusModel = require('../models/assignmentStatus');
const patientmodel=require('../models/patientmodel');

const { response, request } = require('express');
const { loginLookUp, doctorManagement, impressionreport } = require('../config/db');
const clinicManagement = require('../models/clinicManagement');
const { send } = require('process');
const complains = require('../models/complains');
 
exports.registration = async(req, res) => {

	const{username,password,role} = req.body;
    
	if(role === 'CLINIC'){
	console.log(folderName)	
		var usernameIsValid = await ClinicManagement.findOne({
			where:{
	  username:req.body.username
			},
		});
   if (!usernameIsValid) {
	const createClinic= await ClinicManagement.create({
	 ...req.body,
	
		}).then(clinicManagement => {
			console.log(clinicManagement)
		
			// exit node.js app
			res.json({'message': 'Registered successfully!', 'file': req.file,'user':req.body, status:200});
		})
	
}
else{
	return res.status(401).send({ auth: false, accessToken: null, message: "Username already exists!" ,status: 401});

}
	}
	if(role === 'ADMIN'){
		var usernameIsValid = await Admin.findOne({
			where:{
				username:req.body.username
			},
		})
		if(!usernameIsValid){
			const createAdmin = await Admin.create({
				...req.body,
			}).then(admin =>{
				sendEmail('clinicmanagement20@gmail.com','ysrysrysr@gmail.com,Khairuddin@valuedge-solutions.com,rvsairam239@gmail.com',clinicManagement)
				console.log(admin)
				 res.json({'message':'File uploaded successfully'})
			})
		}
	
		else{
			return res.status(401).send({ auth: false, accessToken: null, message: "Username already exists!" });
		
		}	
	}	
if(role === 'DOCTOR'){
	var usernameIsValid = await DoctorManagement.findOne({
		where:{
  username:req.body.username
		},
	});
	if (!usernameIsValid) {

	let totalCount = await DoctorManagement.findAndCountAll({
		where:{
  clinicId:req.body.clinicId
		},
		raw:true
	});
	console.log(totalCount.count)

	if(totalCount.count<3){

	const createDoctor= await DoctorManagement.create({
	 ...req.body,
	}).then(doctorManagement => {
		
	// 	// exit node.js app
	 	res.json({'message': 'Registered successfully!','user':req.body,count:totalCount.count,status:200});
	
	})

}
	}
else{
	return res.status(401).send({ auth: false, accessToken: null, message: "Username already exists!" ,});
	// res.json({'message':'cannot enter',count:totalCount.count});
}
}



const createLoginLookup = await db.loginLookUp.create({
	username: req.body.username,
	  password:req.body.password,
	  role:req.body.role,
})
};

exports.profileImage = async(req, res,next) => {
// 	console.log('adsasasa')
//   multipartMiddlewareForProfileImages(req,res,next)
//   function getFolderpath2(req) {
// 	return  `./profileImages`
// 	}
// fs.readdirSync(getFolderpath2()).forEach(function (name) {
// 	var profilename = fs.readFileSync(getFolderpath2()+'/'+name);
// 	console.log("kaushik")

// console.log(name)
// console.log("vishal")
var multiparty = require('multiparty');

var data = new multiparty.Form();

 data.parse(req, function(err, fields, files) {
   console.log(files);
    var fileContent = fs.readFileSync(files.file[0].path,'utf8');
     res.json(fileContent   );
    });

  const createClinic= await ClinicManagement.create({
	...req.body,
   
	   }).then(clinicManagement => {
		   console.log(clinicManagement)
	   
		   // exit node.js app
		   res.json({'message': 'File uploaded successfully!', 'file': req.file,'user':req.body});
	   })
}


exports.assignmentStatus = async(req, res) => {

	// Save ClinicManagement to Database
	console.log("Processing func -> Add");
	const {name,status} = req.body

	const assignmentstatusReq = req.body;
	const createAssignmentStatus = await AssignmentStatus.create({
		... req.body,
	})

	return res.send({status:200,message:"Successfully created "})
}

exports.signin =  (req, res) => {
	console.log("Sign-In");
	
    
	db.clinicManagement.findOne({
		where: {
			username: req.body.username
		}
	}).then(data => {
		if (!data) {
			db.doctorManagement.findOne({
				where: {
					username: req.body.username
				}
			}).then(doctorData => {
				if(!doctorData) {
					db.admin.findOne({
						where:{
							username: req.body.username
						}
						
					}).then(admindata =>{
						if(!admindata)
						return res.status(401).send({message:"Please check the details",status:401});
						checkPassword(req,admindata,res)
					})

				}
				else{
					checkPassword(req,doctorData,res)

				}
				
			})
		}
else{
	checkPassword(req,data,res)

} 	
	}).catch(err => {
		res.status(500).send('Error -> ' + err);
	});
	
}


checkPassword = (req,data,res) => {
	
	console.log(data.role);
	var role= data.role;
	var pass1 = Buffer.from(req.body.password); 
   var pass2 = Buffer.from(data.password); 
   var passwordIsValid = Buffer.compare(pass1, pass2);
		//var  = Buffer.compare(req.body.password,data.password);
		if (passwordIsValid == 0) {
			var id = data.id;
			var role = data.role;
			
			var token = jwt.sign({ id: data.id }, config.secret, {
			  expiresIn: 86400 // expires in 24 hours
			});
			var status = res.status;
			console.log(req.body.username)
			console.log("+++++++++++++++++++++++++++++++")
			res.status(200).send({ auth: true, accessToken: token,role:role ,id:id,data:data});
		}
		else{
			return res.status(401).send({ auth: false, accessToken: null, message: "Invalid Password!" ,status: 401});

		}
}


// CLINICS


exports.clinicContent = (req, res) => {
	ClinicManagement.findAll({
		where: {id: req.clinicId},
		attributes: ['name','address', 'username', 'country','state',],
		// include: [{
		// 	model: LoginLookUp,
		// 	attributes: ['id', 'username','role'],
		// 	through: {
		// 		attributes: ['clinicId', 'loginLookUpId'],
		// 	}
		// }]
	}).then(clinic => {
		res.status(200).json({
			"description": "ClinicManagement Content Page",
			"clinic": clinic
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access ClinicManagement Page",
			"error": err
		});
	})
}
exports.updateClinicContent = (req, res) => {
	const id = req.params.id;
	// const{ password} = req.body
	ClinicManagement.update( { ...req.body ,
	}, 
			 { where: {id: req.params.id} }
			 ).then(() => {
			 res.status(200).send({message:"Clinic updated successfully"});
			 });
  };
  exports.deleteClinic = (req, res) => {
	const id = req.params.id;
	ClinicManagement.destroy({
	  where: { id: id }
	}).then(() => {
	  res.status(200).send({message:'Clinic deleted successfully'});
	});
  };
exports.getAllClinics = (req, res) => {
	ClinicManagement.findAll({
		where: {role: 'CLINIC'},
		order: [
			[Sequelize.literal('id'), 'desc']
	 ]
	}).then(clinic => {
		res.status(200).json({
			"description": "ClinicManagement Content Page",
			"clinic": clinic,
			
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access ClinicManagement Page",
			"error": err
		});
	})
}

// DOCTORS

exports.doctors = (req, res) => {
	DoctorManagement.findAll({
		where: {clinicId: req.params.clinicId},
		order: [
			[Sequelize.literal('id'), 'desc']
	 ]
	}).then(clinic => {
		res.status(200).json({
			"description": "ClinicManagement Content Page",
			"user": clinic,
			
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access ClinicManagement Page",
			"error": err
		});
	})
}
exports.updateDoctors = (req, res) => {
	const id = req.params.id;
	const{ password} = req.body
	DoctorManagement.update( { ...req.body ,
	}, 
			 { where: {id: req.params.id} }
			 ).then(() => {
			 res.status(200).send({message:"Doctor updated successfully"});
			 });
  };
  exports.deleteDoctors = (req, res) => {
	const id = req.params.id;
	DoctorManagement.destroy({
	  where: { id: id }
	}).then(() => {
	  res.status(200).send({message:'Doctor deleted successfully'});
	});
  };

  exports.getAllDoctors = (req, res) => {
	DoctorManagement.findAll({
		where: {role: 'DOCTOR'},
		order: [
			[Sequelize.literal('id'), 'desc']
	 ]
	}).then(clinic => {
		res.status(200).json({
			"description": "DoctorManagement Content Page",
			"clinic": clinic,
			
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access DoctorManagement Page",
			"error": err
		});
	})
}

//  ASSIGNMENTS
exports.updateAssignment = (req, res) => {
	const id = req.params.id;
	AssignmentStatus.update( { name: req.body.name, status: req.body.status, email: req.body.email,message: req.body.message ,docId: req.body.docId }, 
			 { where: {id: req.params.id} }
			 ).then(() => {
			 res.status(200).send({message:"Assignment updated successfully"});
			 });
  };

  exports.deleteAssignment = (req, res) => {
	const id = req.params.id;
	AssignmentStatus.destroy({
	  where: { id: id }
	}).then(() => {
	  res.status(200).send({message:'Assignment deleted successfully'});
	});
  };

  exports.getAssignments = (req, res) => {
	AssignmentStatus.findOne({
		where: {id : req.params.id},
		
	}).then(assignment => {
		var aid = assignment.id;
		res.status(200).json({
			"description": "Assignment Content Page",
			"assignment": assignment,
			"aid":aid
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Assignment Page",
			"error": err
		});
	})
}


exports.getListOfAssignments = (req,res) =>{
	AssignmentStatus.findAll({
		where: {clinicId: req.params.id,[Op.or]: [{clinicId: req.params.id}, {docId: req.params.id}] },
		attributes: ['name','mobNo', 'email', 'status', 'docId','id'],
		// include: [{
		// 	model: LoginLookUp,
		// 	attributes: ['id', 'username','role'],
		// 	through: {
		// 		attributes: ['clinicId', 'loginLookUpId'],
		// 	}
		// }]
	}).then(assignment => {
		res.status(200).json({ 
			"listOfAssignments": assignment
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access AssignmentStatus Page",
			"error": err
		});
	})
}
exports.getListOfAssignmentsinDoctor = (req,res) =>{
	AssignmentStatus.findAll({
		where: { docId: req.params.id},
		attributes: ['name','mobNo', 'email', 'status'],
	}).then(assignment => {
		res.status(200).json({ 
			"listOfAssignments": assignment
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access AssignmentStatus Page",
			"error": err
		});
	})
}
 ///patient


//  exports.updatePatient = async(req, res) => {
// 	const id = req.params.id;
// 	console.log("+++++++++++++++++++++++++++++")
// 	console.log(req.body)
// 	const {docId,doctorList} = req.body;
// 	console.log('8888888888888888888888');
// 	console.log(doctorList)
// 	Patient.update( { ...req.body,status:'assigned' }, 
// 			 { where: {id: req.params.id} }
// 			 ).then(async () => {
// 				const doctorInfo =  doctorList.filter(data => {
// 					console.log(docId)
// 					console.log(data.id)
// 					return  data.id == docId
// 				 })[0]
// 				 //console.log("32456789")
// 				//console.log(doctorInfo)

// 				 let {name,email,mobNo,} = doctorInfo;
// 				 console.log(email)
// 				console.log(mobNo)
// 				const doctorNo = []
// 				doctorNo.push("+91"+mobNo)
// 				  //email = 'gummadidhalavishal@gmail.com'
// 		/**************** NEEDED  ********/
// 				 await  sendEmail(email,{doctorName:name})
// 				 //await textMessage(doctorNo)
				 
// 			res.status(200).send({message:"patient updated successfully"});
			  
			
// 			 });
//   };

exports.updatePatient = async(req, res) => {
	const id = req.params.id;
	console.log("+++++++++++++++++++++++++++++")
	
	const {docId,sendreport} = req.body;
	
	const pat=await Patient.findAll({ where: {id: req.params.id},raw:true})
  console.log(pat[0].docId)
  const doctorList = await DoctorManagement.findOne({where:{id:pat[0].docId},raw:true})
  console.log(doctorList)
	const patupdate = await Patient.update( { ...req.body,status:'assigned' }, 
			 { where: {id: req.params.id} }
			 ).then(async () => {
				
				console.log(doctorList)

				 let {name,email,mobNo,} = doctorList;
				
				const doctorNo = []
				doctorNo.push("+91"+mobNo)
				  
				  if(sendreport==='email'){
				 await  sendEmail(email,{doctorName:name})
				 console.log(email)
				  }
				  if(sendreport==='sms'){
				 await textMessage(doctorNo)
				  }
			res.status(200).send({message:"patient updated successfully"});
			  
			
			 });
  };

  exports.updPatient = async(req,res)=>{
	const id = req.params.id;
	// const{ password} = req.body
	Patient.update( { ...req.body ,status:'assigned' }, 
			 { where: {id: req.params.id} }
			 ).then(patient => {
				res.status(200).json({
					"description": "patient Details updated",
					status:200
					
				});
			}).catch(err => {
				res.status(500).json({
					"description": "Can not update patient Details",
					"error": err,
					status:500
				});
			})
		
}

exports.updPatientReportStatus = async(req,res)=>{
	const id = req.params.id;
	// const{ password} = req.body
	Patient.update( { status:'closed' }, 
			 { where: {id: req.params.id} }
			 ).then(patient => {
				res.status(200).json({
					"description": "Patient Status updated",
					status:200
					
				});
			}).catch(err => {
				res.status(500).json({
					"description": "Can not update patient Details",
					"error": err,
					status:500
				});
			})
		
}


  exports.deletePatient = (req, res) => {
	const id = req.params.id;
	Patient.destroy({
	  where: { id: id }
	}).then(() => {
	  res.status(200).send('patient deleted successfully ');
	});
  };

//   exports.findpatient = async(req, res) => {

// 	const patientsDataRelatedClinic = await Patient.findAll({
// 		where: {clinicId: req.params.clinicId,status:req.params.status},
// 	raw: true,
// 		order: [
// 			[Sequelize.literal('id'), 'desc']
// 	 ]
// 	})
// 	 const doctorListRelatedToClinic = await DoctorManagement.findAll({
// 		where: {clinicId: req.params.clinicId},
// 		raw: true,
// 		order: [
// 				[Sequelize.literal('id'), 'desc']
// 		]
// 	 })
// 	 doctorListRelatedToClinic.push({'id':null,name:'Select A Doctor'})

// 	const clinicDashboardData = patientsDataRelatedClinic.map(data => { 
// 		return {...data,doctorList:doctorListRelatedToClinic}
// 	})
	

// return res.status(200).json({
// 	user: clinicDashboardData
// })

// }

exports.findpatient = async(req, res) => {
	const {status}=req.params.status;

	const patientsDataRelatedClinic = await Patient.findAll({
		where: {clinicId: req.params.clinicId,status:req.params.status},
	raw: true,
		order: [
			[Sequelize.literal('id'), 'desc']
	 ]
	})
	//  const doctorListRelatedToClinic = await DoctorManagement.findAll({
	// 	where: {clinicId: req.params.clinicId},
	// 	raw: true,
	// 	order: [
	// 			[Sequelize.literal('id'), 'desc']
	// 	]
	//  })
	//  doctorListRelatedToClinic.push({'id':null,name:'Select A Doctor'})

	// const clinicDashboardData = patientsDataRelatedClinic.map(data => { 
	// 	for(let i in patientsDataRelatedClinic){
	// 		console.log(patientsDataRelatedClinic[i].id)
	// 		let patientId = patientsDataRelatedClinic[i].id
	// 		const totalCount= db.observations.findAndCountAll({
	// 			where:{patientId:patientId},
	// 				})
	// 				console.log(totalCount.count)
	// 				let obscount = totalCount.count
	// 				//return {obscount}
					
	// 				console.log(obscount)
	// 				console.log('==================');
	// 				return {...data,doctorList:doctorListRelatedToClinic,obs:obscount}
	// 		}
	
	// })
	// const clinicData = patientsDataRelatedClinic.map(async data => {
		
	// 	const totalCount = observationcount.count
	 	const doctorListRelatedToClinic1 = patientsDataRelatedClinic.map(async data =>{
			const doctorListRelatedToClinic=await DoctorManagement.findAll({
			where: {clinicId: data.clinicId},
			raw: true,
			order: [
					[Sequelize.literal('id'), 'desc']
			]
		 })
		 doctorListRelatedToClinic.push({'id':null,name:'Select A Doctor'})
		 const doc = await Promise.all(doctorListRelatedToClinic)
		 console.log((doc))
		 const observationcount = await db.observations.findAndCountAll({
			where:{patientId:data.id}
	
		 })
		 totalCount= observationcount.count
		return {...data,totalCount,doctorList:doc}
		})
	  const clinicDashboardData = await Promise.all(doctorListRelatedToClinic1)
 

return res.status(200).json({
	user: clinicDashboardData,
	
})

}
 


exports.findpatientreport = async(req, res) => {
	const {status}=req.params.status;
		const patientsDataRelatedClinic = await Patient.findAll({
			where: {clinicId: req.params.clinicId,[Op.or]:[{status:'assigned'}, {status: 'Report Generated'}]},
		raw: true,
			order: [
				[Sequelize.literal('id'), 'desc']
		 ]
		})
	
		
			 const doctorListRelatedToClinic1 = patientsDataRelatedClinic.map(async data =>{
				const doctorListRelatedToClinic=await DoctorManagement.findAll({
				where: {clinicId: data.clinicId},
				raw: true,
				order: [
						[Sequelize.literal('id'), 'desc']
				]
			 })
			 doctorListRelatedToClinic.push({'id':null,name:'Select A Doctor'})
			 const doc = await Promise.all(doctorListRelatedToClinic)
			 console.log((doc))
			 const observationcount = await db.observations.findAndCountAll({
				where:{patientId:data.id}
		
			 })
			 totalCount= observationcount.count
			return {...data,totalCount,doctorList:doc}
			})
		  const clinicDashboardData = await Promise.all(doctorListRelatedToClinic1)
	 
	
	return res.status(200).json({
		user: clinicDashboardData,
		
	})
	
	}
	
	

exports.getAllPatients = async(req, res) => {
	const patient=await	Patient.findAll({
			where: {docId :req.params.docId},
			raw:true,
			order: [
				[Sequelize.literal('id'), 'desc']
		 ]
		})
	const docpatient = patient.map(async data=>{
		const observationcount = await db.observations.findAndCountAll({
			where:{patientId:data.id}
	
		 })
		 totalCount= observationcount.count
	
		return {...data,totalCount}
	})
	const doctor = await Promise.all(docpatient)
	
	return res.status(200).json({
		doctor,
		
	})
	}


	exports.getAllPatientsStatus = async(req, res) => {
		//const {status}=req.params.status
		
		const patient=await	Patient.findAll({
				where: {docId :req.params.docId,status: req.params.status},
				raw:true,
				order: [
					[Sequelize.literal('id'), 'desc']
			 ]
			})
		
		const docpatient = patient.map(async data=>{
			const observationcount = await db.observations.findAndCountAll({
				where:{patientId:data.id}
		
			 })
			 totalCount= observationcount.count
		
			return {...data,totalCount}
		})
	
		const doctor = await Promise.all(docpatient)
	
		return res.status(200).json({
			doctor,
			
		})
		
		}


exports.getPatient = (req, res) => {
	Patient.findOne({
		where: {id :req.params.id},
		
	}).then(doctor => {
		res.status(200).json({
			"description": "Patient Content Page",
			"doctor": doctor
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Patient Page",
			"error": err
		});
	})
}

// exports.getClinics = (req, res) => {
// 	ClinicManagement.findOne({
// 		where: {id :req.params.id},
		
// 	}).then(doctor => {
// 		res.status(200).json({
// 			"description": "Clinic Content Page",
// 			"doctor": doctor
// 		});
// 	}).catch(err => {
// 		res.status(500).json({
// 			"description": "Can not access Clinic Page",
// 			"error": err
// 		});
// 	})
// }

exports.getClinics =  async(req, res) => {
	const doctor= await	db.clinicManagement.findOne({
		   where:{id :req.params.id},
		   })
		
	const country=await db.country.findAll({where:{}});	
	const state=await db.state.findAll({where:{}});	
	const services = await db.hospitalService.findAll({where:{}});
	const hospitalSpeciality = await db.hospitalSpeciality.findAll({where:{}});
	const hospitalType = await db.hospitalType.findAll({where:{}});
		   return res.json({"doctor":doctor,
			"country":country,
			"state":state,
			"hospitalService":services,
			"hospitalSpeciality":hospitalSpeciality,
			"hospitalType":hospitalType,
		})
	   }


// exports.getDoctors = (req, res) => {
// 	const salutation=await db.salutationMaster.findAll({where:{}});
// 	const branch=await db.branchMaster.findAll({where:{}});	
// 	DoctorManagement.findOne({
// 		where: {id :req.params.id},
		
// 	}).then(doctor => {
// 		res.status(200).json({
// 			"description": "Doctor Content Page",
// 			"doctor": doctor,
// 			"salutation":salutation,
// 			"branch":branch,

// 		});
// 	}).catch(err => {
// 		res.status(500).json({
// 			"description": "Can not access Doctor Page",
// 			"error": err
// 		});
// 	})
// }

exports.getDoctors =  async(req, res) => {
	const doctor= await	db.doctorManagement.findOne({
		   where:{id :req.params.id},
		   })
	const salutation=await db.salutationMaster.findAll({where:{}});
	const branch=await db.branchMaster.findAll({where:{}});	
	const country=await db.country.findAll({where:{}});	
	const state=await db.state.findAll({where:{}});	

		   return res.json({"doctor":doctor,"salutation":salutation,
		   "branch":branch,
			"country":country,
			"state":state,
		})
	   }


//master
exports.master = (req,res) => {
	data = req.params;
	console.log(req.params.data);
	const d = db[(req.params.data)];
	console.log('----------------------------')
	d.findAll({
		where: {},
			}).then(master => {
		res.status(200).json({ 
			"master": master
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access master Page",
			"error": err
		});
	})
}


/// patient master controllers 
// exports.patientMaster = (req, res) => {
// 	PatientMaster.create({
// 		$complains: req.body.complains,
// 		...req.body,
// 	}).then(patient => {
// 		res.status(200).json({
// 			"description": "Patient Created",
// 			"user": patient,
			
// 		});
// 	}).catch(err => {
// 		res.status(500).json({
// 			"description": "Can not access patient Page",
// 			"error": err
// 		});
// 	})
// }

exports.patientMaster = async(req, res) => {
	const {complains} = req.body
	// try{
		console.log(complains)
		console.log('+++++++++++++++++++');
		
   const result=await PatientMaster.create({
		...req.body,
   });
	console.log(result)
	// 	await db.complains.create({
	// 		...req.body,patientId:result.id
	//    },raw);
	
	if (complains) {
		console.log(complains)
		console.log('**********************');
		//									let objlength = Object.keys(conclusionsComments[i]).length
					let totalCount =  await db.complains.findAndCountAll({
						where:{
				patientId:result.id},
						raw:true
					});
					console.log(totalCount.count)
					if(totalCount.count>0){
				db.complains.destroy({where:{
										patientId:req.params.patientId}
				})
					}

					for(i in complains){
					const createcomplains=	await db.complains.create({
							...complains[i],
							patientId:result.id
											})
									
		}
		}
		return res.json({result:result})
// }
// catch{
// 	err => {
// 		res.status(500).send('Error -> ' + err);
// 	}
// }
}


exports.findPatientMaster = (req, res) => {
	db.patientMaster.findAll({
	where:{},
	order: [
		[Sequelize.literal('id'), 'desc']
 ]
	}).then(patient => {
		res.status(200).json({
			"description": "patient Page",
			"user": patient,
			
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access patient Page",
			"error": err
		});
	})
}
exports.findOnePatientMaster =  async(req, res) => {
 const patient= await	db.patientMaster.findOne({
		where:{id :req.params.id},
		})
		const complains=await db.complains.findAll({where:{patientId:req.params.id}});
		
		return res.json({"user":patient,"complains":complains})
	}
	exports.updatePatientMaster = async(req, res) => { 
		const id = req.params.id;
		const {complains} = req.body;
		// const{ password} = req.body
		try{
		await PatientMaster.update( { ...req.body ,
		}, 
				 { where: {id: req.params.id} }
				 )
				 if (complains) {
					console.log(complains)
					console.log('**********************');
					//									let objlength = Object.keys(conclusionsComments[i]).length
								let totalCount =  await db.complains.findAndCountAll({
									where:{
							patientId:req.params.id},
									raw:true
								});
								console.log(totalCount.count)
								if(totalCount.count>0){
							await db.complains.destroy({where:{
													patientId:req.params.id}
							})
								}
			
								for(i in complains){
								const createcomplains=	await db.complains.create({
										...complains[i],
										patientId:req.params.id
														})
												
					}
					}
					return res.json({"message":"updated successfully",createcomplains:createcomplains})
			}catch{
				return res.json("error")
			}}

exports.deletePatientMaster = (req, res) => {
	const id = req.params.id;
	PatientMaster.destroy({
		where: { id: id }
	}).then(() => {
		res.status(200).send({message:'Patient Master deleted successfully'});
	});
	};
	
	
			/////////kin controllers
exports.kinMaster = (req, res) => {
	KinMaster.create({
		...req.body,
	}).then(kinmaster => {
		res.status(200).json({
			"description": "kinmaster Page",
			"user": kinmaster,
			status:200
			
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access kinmaster Page",
			"error": err,
			status:500
		});
	})
}
exports.findkinMaster = (req, res) => {
	db.kinMaster.findAll({
	where:{},
	order: [
		[Sequelize.literal('id'), 'desc']
 ]
	}).then(kinmaster => {
		res.status(200).json({
			"description": "kinmaster Page",
			"user": kinmaster,
			status:200
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access kinmaster Page",
			"error": err,
			status:500
		});
	})
}
exports.findOneKinMaster = (req, res) => {
	db.kinMaster.findOne({
		where: {id :req.params.id},
		
	}).then(kinmaster => {
		res.status(200).json({
			"description": "KinMaster Content Page",
			"kinmaster": kinmaster,
			status:200
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access Patient Page",
			"error": err,
			status:500
		});
	})
}
exports.updateKinMaster = (req, res) => {
	const id = req.params.id;
	// const{ password} = req.body
	KinMaster.update( { ...req.body ,
	}, 
			 { where: {id: req.params.id} }
			 ).then(kin => {
				res.status(200).json({
					"description": "Kin Master updated",
					status:200
					
				});
			}).catch(err => {
				res.status(500).json({
					"description": "Can not update Kin Master",
					"error": err,
					status:500
				});
			})
}

exports.deleteKin = (req, res) => {
	const id = req.params.id;
	KinMaster.destroy({
	  where: { id: id }
	}).then(() => {
	  res.status(200).send({message:'Kin deleted successfully'});
	});
  };

const fetchMastterVariables = async() => {

	const anteriorSeptum = await db.anteriorSeptum.findAll({
		where: {},
	raw: true,
		
	})
	const anteriorWall = await db.anteriorWall.findAll({
		where: {},
	raw: true,
		
	})
	const aorta = await db.aorta.findAll({
		where: {},
	raw: true,
		
	})
	const aorticValve = await db.aorticValve.findAll({
		where: {},
	raw: true,
		
	})
	const conclusion = await db.conclusion.findAll({
		where: {},
	raw: true,
		
	})
	const doctorAdvice = await db.doctorAdvice.findAll({
		where: {},
	raw: true,
		
	})
	const inferiorSeptum = await db.inferiorSeptum.findAll({
		where: {},
	raw: true,
		
	})
	const impressions = await db.impressions.findAll({
		where: {},
	raw: true,
		
	})
	const inferiorVenaCava = await db.inferiorVenaCava.findAll({
		where: {},
	raw: true,
		
	})
	const inferiorWall = await db.inferiorWall.findAll({
		where: {},
	raw: true,
		
	})
	const intracardiacData = await db.intracardiacData.findAll({
		where: {},
	raw: true,
		
	})
	const intraCardiacTumour = await db.intraCardiacTumour.findAll({
		where: {},
	raw: true,
		
	})
	const lateralWall = await db.lateralWall.findAll({
		where: {},
	raw: true,
		
	})
	const leftAtrium = await db.leftAtrium.findAll({
		where: {},
	raw: true,
		
	})
	const leftVentrical = await db.leftVentrical.findAll({
		where: {},
	raw: true,
		
	})
	const leftVentricalFunction = await db.leftVentricalFunction.findAll({
		where: {},
	raw: true,
		
	})
	const mitralValve = await db.mitralValve.findAll({
		where: {},
	raw: true,
		
	})
	const pericardialEffusion = await db.pericardialEffusion.findAll({
		where: {},
	raw: true,
		
	})
	const pericardium = await db.pericardium.findAll({
		where: {},
	raw: true,
		
	})
	const posteriorWall = await db.posteriorWall.findAll({
		where: {},
	raw: true,
		
	})
	const pulmonaryArtery = await db.pulmonaryArtery.findAll({
		where: {},
	raw: true,
		
	})
	const pulmonaryVein = await db.pulmonaryVein.findAll({
		where: {},
	raw: true,
		
	})
	const pulmonicValve = await db.pulmonicValve.findAll({
		where: {},
	raw: true,
		
	})
	const rightAtrium = await db.rightAtrium.findAll({
		where: {},
	raw: true,
		
	})
	const rightVentricalFunction = await db.rightVentricalFunction.findAll({
		where: {},
	raw: true,
		
	})
	const rightVentricle = await db.rightVentricle.findAll({
		where: {},
	raw: true,
		
	})
	const tricuspidValve = await db.tricuspidValve.findAll({
		where: {},
	raw: true,
		
	})
	const speckleTracking = await db.speckleTracking.findAll({
		where: {},
	raw: true,
		
	})
	const venous = await db.venous.findAll({
		where: {},
	raw: true,
		
	})
	const anteriorSeptumData = anteriorSeptum.map(data => { 
		return {...data}
		
	})
	const anteriorWallData = anteriorWall.map(data => { 
		return {...data}
		
	})
	const aortaData = aorta.map(data => { 
		return {...data}
		
	})
	const aorticValveData = aorticValve.map(data => { 
		return {...data}
		
	})
	const conclusionData = conclusion.map(data => { 
		return {...data}
		
	})
	const doctorAdviceData = doctorAdvice.map(data => { 
		return {...data}
		
	})
	const inferiorSeptumData = inferiorSeptum.map(data => { 
		return {...data}
		
	})
	const impressionsData = impressions.map(data => { 
		return {...data}
		
	})
	const inferiorVenaCavaData = inferiorVenaCava.map(data => { 
		return {...data}
		
	})
	const inferiorWallData = inferiorWall.map(data => { 
		return {...data}
		
	})
	const intracardiacDataData = intracardiacData.map(data => { 
		return {...data}
		
	})
	const intraCardiacTumourData = intraCardiacTumour.map(data => { 
		return {...data}
		
	})
	const lateralWallData = lateralWall.map(data => { 
		return {...data}
		
	})
	const leftAtriumData = leftAtrium.map(data => { 
		return {...data}
		
	})
	const leftVentricalData = leftVentrical.map(data => { 
		return {...data}
		
	})
	const leftVentricalFunctionData = leftVentricalFunction.map(data => { 
		return {...data}
		
	})
	const mitralValveData = mitralValve.map(data => { 
		return {...data}
		
	})
	const pericardialEffusionData = pericardialEffusion.map(data => { 
		return {...data}
		
	})
	const pericardiumData = pericardium.map(data => { 
		return {...data}
		
	})
	const posteriorWallData = posteriorWall.map(data => { 
		return {...data}
		
	})
	const pulmonaryArteryData = pulmonaryArtery.map(data => { 
		return {...data}
		
	})
	const pulmonaryVeinData = pulmonaryVein.map(data => { 
		return {...data}
		
	})
	const pulmonicValveData = pulmonicValve.map(data => { 
		return {...data}
		
	})
	const rightAtriumData = rightAtrium.map(data => { 
		return {...data}
		
	})
	const rightVentricalFunctionData = rightVentricalFunction.map(data => { 
		return {...data}
		
	})
	const rightVentricleData = rightVentricle.map(data => { 
		return {...data}
		
	})
	const tricuspidValveData = tricuspidValve.map(data => { 
		return {...data}
		
	})
	const speckleTrackingData = speckleTracking.map(data => { 
		return {...data}
		
	})
	const venousData = venous.map(data => { 
		return {...data}
		
	})

	
	return {
		anteriorSeptum:anteriorSeptumData,
 anteriorWall:anteriorWallData,
  aorta:aortaData,
 aorticValve:aorticValveData,
  conclusion:conclusionData,
 doctorAdvice:doctorAdviceData,
 inferiorSeptum:inferiorSeptumData,
 impressions:impressionsData,
  inferiorVenaCava:inferiorVenaCavaData,
  inferiorWall:inferiorWallData,
 intracardiacData:intracardiacDataData,
intraCardiacTumour:intraCardiacTumourData,
lateralWall:lateralWallData,
leftAtrium:leftAtriumData,
leftVentrical:leftVentricalData,
leftVentricalFunction:leftVentricalFunctionData,
mitralValve:mitralValveData,
pericardialEffusion:pericardialEffusionData,
pericardium:pericardiumData,
posteriorWall:posteriorWallData,
pulmonaryArtery:pulmonaryArteryData,
pulmonaryVein:pulmonaryVeinData,
pulmonicValve:pulmonicValveData,
rightAtrium:rightAtriumData,
rightVentricalFunction:rightVentricalFunctionData,
rightVentricle:rightVentricleData,
tricuspidValve:tricuspidValveData,
speckleTracking:speckleTrackingData,
venous:venousData
		
		}
	}


//////////////////////////////////

///////////new masters
exports.getmaster = (req,res) => {
	data = req.params;
	console.log(req.params.data);
	const d = db[(req.params.data)];
	console.log('----------------------------')
	d.findAll({
		where: {},
			}).then(master => {
		res.status(200).json({ 
			
			"master": master
		});
	}).catch(err => {
		res.status(500).json({
		
			"description": "Can not access master Page",
			"error": err
		});
	})
}
exports.createmaster = (req,res) => {
	data = req.params;
	console.log(req.params.data);
	const d = db[(req.params.data)];
	console.log('----------------------------')
	d.create({
		...req.body
			}).then(master => {
		res.status(200).json({ 
			message:"master created successfully",
			"master": master,
			status:200
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access master Page",
			"error": err
		});
	})
}
exports.updatemaster = (req,res) => {
	data = req.params;
	console.log(req.params.data);
	const d = db[(req.params.data)];
	console.log('----------------------------')
	d.update({
		...req.body},
		{ where: {id: req.params.id} }
			).then(master => {
		res.status(200).json({ 
			message:"master updated successfully",
			"master": master,
			status:200
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access master Page",
			"error": err
		});
	})
}
exports.deletemaster = (req,res) => {
	data = req.params;
	console.log(req.params.data);
	const d = db[(req.params.data)];
	console.log('----------------------------')
	d.destroy(
		{ where: {id: req.params.id} }
			).then(master => {
		res.status(200).json({ 
			message:"master deleted successfully",
			"master": master,
			status:200
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access master Page",
			"error": err
		});
	})
}

exports.getonemaster = (req,res) => {
	data = req.params;
	console.log(req.params.data);
	const d = db[(req.params.data)];
	console.log('----------------------------')
	d.findOne({
		where:{id:req.params.id},
			}).then(master => {
		res.status(200).json({ 
			
			"master": master,
			status:200
		});
	}).catch(err => {
		res.status(500).json({
		
			"description": "Can not access master Page",
			"error": err
		});
	})
}

// exports.findByDate = (req, res) => {
// 	db.patientmodel.findAll({
// 		where: {testdate: req.params.testdate,status:req.params.status},
		
// 	}).then(patient => {
// 		res.status(200).json({
// 			"description": "patient Content Page",
// 			"patient": patient
// 		});
// 	}).catch(err => {
// 		res.status(500).json({
// 			"description": "Can not access patient Page",
// 			"error": err
// 		});
// 	})
// }

exports.findByDate = async(req, res) => {
	db.patientmodel.findAll({
		where: {testdate: req.params.createddate,status:req.params.status},
		
	}).then(patient => {
		res.status(200).json({
			"description": "patient Content Page",
			"patient": patient
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access patient Page",
			"error": err
		});
	})
	const doctorListRelatedToClinic = await DoctorManagement.findAll({
		where: {clinicId: req.params.clinicId},
		raw: true,
		order: [
				[Sequelize.literal('id'), 'desc']
		]
	 }).then(doc => {
return{...data , status:200}
	}).catch(err => {
		res.status(500).json({
		
			"description": "Can not access Page",
			"error": err
		});
	})
}

exports.obs = async(req,res,next)=>{
	const createobs = await observations.create({
		...req.body,
	}).then(obs =>{
		res.status(200).json({
			"description": "Obs Content Page",
			"obs": obs
		});
}).catch(err => {
	res.status(500).json({
		"description": "Can not access Clinic Page",
		"error": err
	});
})
}

exports.getClinic = async(req, res) => {	
	const patientsRelatedClinic = await Patient.findAll({
		where: {clinicId: req.params.clinicId},
	raw: true,
		order: [
			[Sequelize.literal('id'), 'desc']
	 ]
	})
	 const doctorRelatedToClinic = await DoctorManagement.findAll({
		where: {clinicId: req.params.clinicId},
		raw: true,
		order: [
				[Sequelize.literal('id'), 'desc']
		]
	 })
	 doctorRelatedToClinic.push({'id':null,name:'Select A Doctor'})

	const clinicData = patientsRelatedClinic.map(data => { 
		return {...data,doctorList:doctorRelatedToClinic}
	})

return res.status(200).json({
	user: clinicData
})
}

// Observations Master 

exports.Observation = async(req,res,next) =>{
	let totalCount = await db.observations.findAndCountAll({
				where:{
		  patientId:req.params.patientId,type:req.params.type
				},
				raw:true
			});
			console.log(totalCount.count)	
			if(totalCount.count === 1){
			const patientId = req.params.id;
					// const{ password} = req.body
					db.observations.update( { ...req.body ,
					}, 
							 { where: {patientId: req.params.patientId,type:req.params.type} }
							 ).then(() => {
							 res.status(200).send({message:" updated successfully"});
							 });
							}
			if(totalCount.count === 0){
			db.observations.create({
			patientId : req.params.patientId,
			type: req.params.type,
			...req.body,
		   
			   }).then(obs => {
				   console.log(obs)
			   
				   // exit node.js app
				   return res.status(200).json({
					"message":"submitted successfully"   })
				})
			}
					
	}
	exports.getObservation = async(req,res,next) =>{
		db.observations.findOne({
			where: {id :req.params.id},
			
		}).then(observation => {
			res.status(200).json({
				"description": "Observation Content Page",
				"observation": observation
			});
		}).catch(err => {
			res.status(500).json({
				"description": "Can not access Observation Page",
				"error": err
			});
		})
	}
	
	exports.findObservation = async(req,res,next) =>{
		db.observations.findOne({
			where: {patientId:req.params.patientId,type:req.params.type},
			
		}).then(observation => {
			res.status(200).json({
				"description": "Observation Content Page",
				"observation": observation
			});
		}).catch(err => {
			res.status(500).json({
				"description": "Can not access Observation Page",
				"error": err
			});
		})
	}
	
// exports.findAllObservations = async(req, res) => {
// 	try{
// 		let formatedfinalList = []
// 	const observations = await db.observations.findAll({
// 	where:{patientId:req.params.patientId}})
// 	const masterTablesData = await fetchMastterVariables()
// 	const observationItem = await db.observationsItem.findAll({where:{patientId:req.params.patientId}})
// 	const observtaionComments = await db.observtaionComments.findAll({where:{patientId:req.params.patientId}})
// 	const conclusionreport = await db.conclusionreport.findAll({where:{patientId:req.params.patientId}})
// 	 const conclusioncomment = await db.conclusionsComments.findAll({where:{patientId:req.params.patientId}})
// 	 const impressionreport = await db.impressionreport.findAll({where:{patientId:req.params.patientId}})
// 	 const impressioncomment = await db.impressionComments.findAll({where:{patientId:req.params.patientId}})
// 	const doctorAdvicereport = await db.doctoradvicereport.findAll({where:{patientId:req.params.patientId}})
// 	 const doctorAdviceComments = await db.doctorAdviceComments.findAll({where:{patientId:req.params.patientId}})
// 	 const speckletrackingreport = await db.speckletrackingreport.findAll({where:{patientId:req.params.patientId}})	 	 
// 	 const regionalWall = await db.regionalwallmotion.findAll({where:{patientId:req.params.patientId}})
// 	return res.send({observations:observations,
// 		masterData:masterTablesData,
// 		 observationItem:observationItem,
// 		observtaionComments:observtaionComments,
// 		conclusionreport:conclusionreport,
// 		conclusioncomment:conclusioncomment,
// 		impressionreport:impressionreport,
// 		impressioncomment:impressioncomment,
// 		doctorAdvicereport:doctorAdvicereport,
// 		doctorAdviceComments:doctorAdviceComments,
// 		regionalWall:regionalWall,
// 		speckleTrackingreport:speckletrackingreport
// 	})
// }catch{
// 	return res.send({})
// }
// }

exports.findAllObservations = async(req, res) => {
	try{
		let formatedfinalList = []
	const observations = await db.observations.findAll({
	where:{patientId:req.params.patientId}})
	const masterTablesData = await fetchMastterVariables()
	const observationItem = await db.observationsItem.findAll({where:{patientId:req.params.patientId}})
	const observtaionComments = await db.observtaionComments.findAll({where:{patientId:req.params.patientId}})
	const conclusionreport = await db.conclusionreport.findAll({where:{patientId:req.params.patientId}})
	 const conclusioncomment = await db.conclusionsComments.findAll({where:{patientId:req.params.patientId}})
	 const impressionreport = await db.impressionreport.findAll({where:{patientId:req.params.patientId}})
	 const impressioncomment = await db.impressionComments.findAll({where:{patientId:req.params.patientId}})
	const doctorAdvicereport = await db.doctoradvicereport.findAll({where:{patientId:req.params.patientId}})
	 const doctorAdviceComments = await db.doctorAdviceComments.findAll({where:{patientId:req.params.patientId}})
	 const speckletrackingreport = await db.speckletrackingreport.findAll({where:{patientId:req.params.patientId}})	 	 
	 const regionalWall = await db.regionalwallmotion.findAll({where:{patientId:req.params.patientId}})
	 const referralcomment = await db.referralcomment.findAll({where:{patientId:req.params.patientId}})
	return res.send({observations:observations,
		masterData:masterTablesData,
		 observationItem:observationItem,
		observtaionComments:observtaionComments,
		conclusionreport:conclusionreport,
		conclusioncomment:conclusioncomment,
		impressionreport:impressionreport,
		impressioncomment:impressioncomment,
		doctorAdvicereport:doctorAdvicereport,
		doctorAdviceComments:doctorAdviceComments,
		regionalWall:regionalWall,
		speckleTrackingreport:speckletrackingreport,
		referralcomment:referralcomment
	})
}catch{
	return res.send({})
}
}

exports.report = async(req,res)=>{
	const createregionalwallmotion = db.regionalwallmotion.create({
		patientId:req.params.patientId,
		...req.body,
	})
	const createimpressions = db.impressionreport.create({
		patientId:req.params.patientId,
		...req.body,
	})
	const createconclusion = db.conclusionreport.create({
		patientId:req.params.patientId,
		...req.body,
	})
	const createdoctoradvice = db.doctoradvicereport.create({
		patientId:req.params.patientId,
		...req.body,
	})
	return res.send({report:req.body,status:200})
}
		
exports.updateobs = (req, res) => {
	const id = req.params.id;
	const {conclusions,doctorAdvice,impressions,wallmotion,selectedObservations} = req.body
	//const {patientId}=req.params.patientId
	console.log(selectedObservations);
	console.log('oooooooooooooooooooooooo');
	if(wallmotion){
	const createregionalwallmotion = db.regionalwallmotion.create({
		patientId:req.params.patientId,
		...wallmotion,
	})}
	if(impressions){
	const createimpressions = db.impressionreport.create({
		patientId:req.params.patientId,
		...impressions,
	})}
	if(conclusions){
	const createconclusion = db.conclusionreport.create({
		patientId:req.params.patientId,
		...conclusions,
	})}
	if(doctorAdvice){
	const createdoctoradvice = db.doctoradvicereport.create({

		patientId:req.params.patientId,
		...doctorAdvice,
	})}
	if(selectedObservations){

console.log('**************');	
console.log(req.body.type);
	const updateobs=db.observations.update( { ...req.body}, 
			 { where: {patientId:req.params.patientId,type:req.body.type} }
			 )}
			 res.status(200).send({report:req.body,message:"observation updated successfully"});
  };


  exports.updatereport = async(req, res) => {
	
	
	const {selectedObservations,observations,conclusions,doctorAdvice,impressions,conclusionsComments,doctorAdviceComments, impressionComments,comments,relativewall,speckleTracking} = req.body;
		
			try { 
				if (selectedObservations) {
					console.log('******');
					const data =[].concat(...selectedObservations)
					console.log(data)
					let totalCount =  await db.observationsItem.findAndCountAll({
						where:{
				  patientId:req.params.patientId,							},
						raw:true
					});
					console.log(totalCount.count)
					if(totalCount.count>0){
					await db.observationsItem.destroy({where:{
							patientId:req.params.patientId,
								  }})
					}
					for(i in data){
					const obsitem=await	db.observationsItem.create({
							itemName:data[i].itemName,
							type:data[i].type,
							id:data[i].id,
							patientId:req.params.patientId
											})
					}
				}
			  } catch (err) {
				// print the error details
				console.log(err, ...selectedObservations);
			  }

						
			  try{
				if (observations) {
					// if(comments){\
					const obs= [].concat(observations)
					let totalCount =  await db.observtaionComments.findAndCountAll({
						where:{
				  patientId:req.params.patientId,							},
						raw:true
					});
					if(totalCount.count>0){
						await db.observtaionComments.destroy({where:{
												patientId:req.params.patientId,}})
							}
				
						for(i in obs){
						for(j in obs[i].comments){
						console.log(obs[i].comments[j].comment,i,j)
										await db.observtaionComments.create({
											...obs[i].comments[j],
											patientId:req.params.patientId
															})
									
							}		
						}		
					}}
					catch(err){
						console.log(err);
						return res.send({message:"cannot insert observation comments"})
					}


				if (conclusions) {
					console.log('****CONCLUSIONS');
					
				

							let totalCount =  await db.conclusionreport.findAndCountAll({
								where:{
						  patientId:req.params.patientId,
								},
								raw:true
							
							});
							console.log(conclusions[i])
							console.log(totalCount);
							console.log('-------------');
							if(totalCount.count>0){
						await db.conclusionreport.destroy({where:{
												patientId:req.params.patientId,
													  }})
							}
							for(i in conclusions){
								await db.conclusionreport.create({
									...conclusions[i],
									patientId:req.params.patientId
													})
							
					
					
				}
							
					}
					if (doctorAdvice) {
					
							//let objlength = Object.keys(doctorAdvice[i]).length
							//for(j in doctorAdvice[i]){
								let totalCount =  await db.doctoradvicereport.findAndCountAll({
									where:{
							  patientId:req.params.patientId
									},
									raw:true,
								});
								if(totalCount.count>0){
							await db.doctoradvicereport.destroy({where:{
													patientId:req.params.patientId,
														  }})
								}
								for(i in doctorAdvice){
									await db.doctoradvicereport.create({
										...doctorAdvice[i],
										patientId:req.params.patientId
														})
								
						
						
					}
								
						}
						if (impressions) {
							
								let objlength = Object.keys(impressions).length
								//for(j in impressions[i]){
									let totalCount =  await db.impressionreport.findAndCountAll({
										where:{
								  patientId:req.params.patientId
										},
										raw:true
									});
									console.log(impressions)
									 if(totalCount.count>0){
								const delimpressions=await db.impressionreport.destroy({where:{
														patientId:req.params.patientId
															  }})
															}
							
							for(j in impressions){
									const createimpressions=await db.impressionreport.create({
											...impressions[j],
											patientId:req.params.patientId
															})
									
							
							
						}
									
							}

							if (conclusionsComments) {
							//									let objlength = Object.keys(conclusionsComments[i]).length
										let totalCount =  await db.conclusionsComments.findAndCountAll({
											where:{
									  patientId:req.params.patientId},
											raw:true
										});
										if(totalCount.count>0){
									db.conclusionsComments.destroy({where:{
															patientId:req.params.patientId}
									})
										}
										for(let i=0;i<conclusionsComments.length;i++){
										const createconclusioncomment=	await db.conclusionsComments.create({
												...conclusionsComments[i],
												patientId:req.params.patientId
																})
														
							}
							}
							if (doctorAdviceComments) {
								
									//let objlength = Object.keys(doctorAdviceComments[i]).length
										let totalCount =  await db.doctorAdviceComments.findAndCountAll({
											where:{
									  patientId:req.params.patientId},
											raw:true
										});
										if(totalCount.count>0){
									db.doctorAdviceComments.destroy({where:{
															patientId:req.params.patientId,}})}
															for(let i=0;i<doctorAdviceComments.length;i++){
										const doctorAdviceComment=await db.doctorAdviceComments.create({
												...doctorAdviceComments[i],
												patientId:req.params.patientId
																})
															
							}
							}
							if (impressionComments) {
							
									// let objlength = Object.keys(impressionComments[i]).length
									// console.log(impressionComments[i])
										let totalCount =  await db.impressionComments.findAndCountAll({
											where:{
									  patientId:req.params.patientId,	},
											raw:true
										});
										if(totalCount.count>0){
									await db.impressionComments.destroy({where:{
															patientId:req.params.patientId		  }})
										}
										for(let i=0;i<impressionComments.length;i++){	
										await db.impressionComments.create({
												...impressionComments[i],
												patientId:req.params.patientId
																})
															
							}
							} 	
							if(relativewall){
							
									
									let totalCount =  await db.regionalwallmotion.findAndCountAll({
											where:{
									  patientId:req.params.patientId
											},
											raw:true
										});
										//console.log(totalCount)
										if(totalCount.count>0){
									await db.regionalwallmotion.destroy({where:{
															patientId:req.params.patientId							  }})
										}
										//console.log(relativewall)
											await db.regionalwallmotion.create({
												...relativewall,
												patientId:req.params.patientId
																})
													
							
							}
							if(speckleTracking){
								
									//let objlength = Object.keys(impressionComments[i]).length
									console.log(speckleTracking[i])
										let totalCount =  await db.speckletrackingreport.findAndCountAll({
											where:{
									  patientId:req.params.patientId,		},
											raw:true
										});
										if(totalCount.count>0){
								await db.speckletrackingreport.destroy({where:{
															patientId:req.params.patientId			  }})
										}
										for(let i=0;i<speckleTracking.length;i++){
											await db.speckletrackingreport.create({
												...speckleTracking[i],
												patientId:req.params.patientId
																})
													
							}
							}

							await db.patientmodel.update({status:'Report Generated'},{where:{id:req.params.patientId}})

				return res.json({message:"report updated successfully",selectedObservations,observations,conclusions,doctorAdvice,impressions,conclusionsComments,doctorAdviceComments, impressionComments,comments,relativewall,speckleTracking});
	
			
	}

	exports.getAllPatientMasterFetch = async(req, res) => {
		try{
			const salutation = await db.salutationMaster.findAll({wherer:{}})
			const complains = await db.complaintsMaster.findAll({where:{}})
		//	const gender = await db.gender.findAll({where:{}})
			const maritalstatus = await db.martialStatus.findAll({where:{}})
			const occupation = await db.occupationMaster.findAll({where:{}})
			const religion = await db.religionMaster.findAll({where:{}})
			const educationalqualifications = await db.educationalMaster.findAll({where:{}})
			const doctor = await db.doctorManagement.findAll({where:{clinicId:req.params.id}})
			const country = await db.country.findAll({where:{}})
			const state = await db.state.findAll({where:{}})
			return res.send({
			salutation:salutation,
			complains:complains,
			//gender:gender,
			maritalstatus:maritalstatus,
			occupation:occupation,
			religion:religion,
			educationalqualifications:educationalqualifications,
			country:country,
			state:state,
			doctor:doctor
			})
				}
				catch{err => {
					res.status(500).send('Error -> ' + err);
				}}
		
	}
	// exports.referralcomment = async(req, res) => {
	// 	db.referralcomment.create({
	// 		...req.body,patientId:req.params.patientId
	// 	}).then(referralcomment => {
	// 		res.status(200).json({
	// 			"comment": referralcomment,
	// 			"description": "Comment Success",
	// 			status:200
				
	// 		});
	// 	}).catch(err => {
	// 		res.status(500).json({
	// 		"description": "Can not access referralcomment Page",
	// 			"error": err,
	// 			status:500
	// 		});
	// 	})
	// }

	exports.referralcomment = async(req, res) => {
		let totalCount = await db.referralcomment.findAndCountAll({
			where:{
	 patientId:req.params.patientId
			},
			raw:true
		});
		if(totalCount.count>0){
		db.referralcomment.update({
			...req.body,
			patientId:req.params.patientId
		}, { where: {patientId: req.params.patientId} })}
		else{
			db.referralcomment.create({
				...req.body,
				patientId:req.params.patientId
			})
		}
		return res.json({message:"referral comment submitted successfully",...req.body})
	}

		exports.getAllReferralComment = (req, res) => {
			db.referralcomment.findAll({
			where:{patientId :req.params.patientId},
			order: [
				[Sequelize.literal('id'), 'desc']
		 ]
			}).then(comment => {
				res.status(200).json({
					"description": "Referral Comment",
					"referralcomment": comment,
					
				});
			}).catch(err => {
				res.status(500).json({
					"description": "Can not get Referral Comment",
					"error": err
				});
			})
		}	
		
		
		exports.getAllHostipalClinicSubFetch = async(req, res) => {
			try{
			const hospitalSpeciality = await db.hospitalSpeciality.findAll({wherer:{}})
			const hospitalService = await db.hospitalService.findAll({where:{}})
			const hospitalType = await db.hospitalType.findAll({where:{}})
			const country = await db.country.findAll({where:{}})
			const state = await db.state.findAll({where:{}})
			const salutation = await db.salutationMaster.findAll({where:{}})
			const branch = await db.branchMaster.findAll({where:{}})
				
				return res.send({
				hospitalSpeciality:hospitalSpeciality,
				hospitalService:hospitalService,
				hostipalType:hospitalType,
				country:country,
				state:state,	
				salutation:salutation,
				branch:branch,
				})
					}
					catch{err => {
						res.status(500).send('Error -> ' + err);
					}}
			
		}

////////////////// GENERAL CLINI DOCTOR////////////////////////		

exports.getGeneralAllClinics = (req, res) => {
	generalClinicManagement.findAll({
		where: {role: 'CLINIC'},
		order: [
			[Sequelize.literal('id'), 'desc']
	 ]
	}).then(clinic => {
		res.status(200).json({
			"description": "ClinicManagement Content Page",
			"clinic": clinic,
			
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Can not access ClinicManagement Page",
			"error": err
		});
	})
}

exports.getGeneralClinics =  async(req, res) => {
	const doctor= await	db.generalClinicManagement.findOne({
		   where:{id :req.params.id},
		   })
		
	const country=await db.country.findAll({where:{}});	
	const state=await db.state.findAll({where:{}});	
	const services = await db.hospitalService.findAll({where:{}});
	const hospitalSpeciality = await db.hospitalSpeciality.findAll({where:{}});
	const hospitalType = await db.hospitalType.findAll({where:{}});
		   return res.json({"doctor":doctor,
			"country":country,
			"state":state,
			"hospitalService":services,
			"hospitalSpeciality":hospitalSpeciality,
			"hospitalType":hospitalType,
		})
	   }

	   exports.updateGeneralClinicContent = (req, res) => {
		const id = req.params.id;
		// const{ password} = req.body
		generalClinicManagement.update( { ...req.body ,
		}, 
				 { where: {id: req.params.id} }
				 ).then(() => {
				 res.status(200).send({message:"Clinic updated successfully"});
				 });
	  };
	  exports.deleteGeneralClinic = (req, res) => {
		const id = req.params.id;
		generalClinicManagement.destroy({
		  where: { id: id }
		}).then(() => {
		  res.status(200).send({message:'Clinic deleted successfully'});
		});
	  };

	  exports.getAllGeneralDoctors = (req, res) => {
		generalDoctorManagement.findAll({
			where: {role: 'DOCTOR'},
			order: [
				[Sequelize.literal('id'), 'desc']
		 ]
		}).then(clinic => {
			res.status(200).json({
				"description": "DoctorManagement Content Page",
				"clinic": clinic,
				
			});
		}).catch(err => {
			res.status(500).json({
				"description": "Can not access DoctorManagement Page",
				"error": err
			});
		})
	}

	exports.getGeneralDoctors =  async(req, res) => {
		const doctor= await	db.generalDoctorManagement.findOne({
			   where:{id :req.params.id},
			   })
		const salutation=await db.salutationMaster.findAll({where:{}});
		const branch=await db.branchMaster.findAll({where:{}});	
		const country=await db.country.findAll({where:{}});	
		const state=await db.state.findAll({where:{}});	
	
			   return res.json({"doctor":doctor,"salutation":salutation,
			   "branch":branch,
				"country":country,
				"state":state,
			})
		   }	
		   exports.updateGeneralDoctors = (req, res) => {
			const id = req.params.id;
			const{ password} = req.body
			generalDoctorManagement.update( { ...req.body ,
			}, 
					 { where: {id: req.params.id} }
					 ).then(() => {
					 res.status(200).send({message:"Doctor updated successfully"});
					 });
		  };
		  exports.deleteGeneralDoctors = (req, res) => {
			const id = req.params.id;
			DoctorManagement.destroy({
			  where: { id: id }
			}).then(() => {
			  res.status(200).send({message:'Doctor deleted successfully'});
			});
		  };
/////////////////////////////////////////////////////////////////