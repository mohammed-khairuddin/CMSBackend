// var router = require('express').Router();
const db = require('../config/db');
const fs = require('fs');
const multer = require('multer');
const express = require('express');
const { Router } = require('express');
const UUID = require('uuid-generate')
// const req['uniqueId'] = UUID.generate()
var dicomParser = require('../../node_modules/dicom-parser/dist/dicomParser');
const Patient = db.patientmodel;
// Load in Rusha so we can calculate sha1 hashes
 var Rusha = require('../../node_modules/rusha/dist/rusha');
 var dicomjs = require('dicomjs');
 //var htmlToJson = require('html-to-json');
const { rootCertificates } = require('tls');
const { iteratee } = require('lodash');
const app = express()
var dicomImageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    if(!fs.existsSync("./directory")) {
      fs.mkdir('./directory', {recursive:true}, (err)=>{
        if (err) {
            console.log("Parent directory issue")
            return cb(null, false, new Error('Something Went wrong,please try again')); 
        }
      })
  
    }
    else {
      if(!fs.existsSync(`./directory/${req['uniqueId']}`)) {
        fs.mkdir(`./directory/${req['uniqueId']}`, {recursive:true}, (err)=>{
          if (err) {
            console.log("Children directory issue")
            return cb(null, false, new Error('Something Went wrong,please try again')); 
          } 
        })
            
     
      }
      cb(null,`./directory/${req['uniqueId']}`);
      console.log(`./directory/${req['uniqueId']}`)
      module.exports = { folderName: `./directory/${req['uniqueId']}` };
    }
   },
   
  filename: function (req, file, cb) {
      cb(null ,Date.now()+'.dcm')
  }
  
});

var dicomupload = multer({ errorHandling: 'manual' , storage: dicomImageStorage })

  module.exports = function(app) {
    app.use(function (req, res, next) {
      req['uniqueId'] = UUID.generate()
      console.log(req['uniqueId'])

      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });
    app.post('/api/addpatient/:id',dicomupload.array("uploads[]", 12),async function GetDicomData(req,res) {
      const multipart = require('connect-multiparty');
      //const req['uniqueId'] = require('../router/routes/router')
      const multer = require('multer');
     
       
      console.log(req['uniqueId'])

    
    // Function to calculate the SHA1 Hash for a buffer with a given offset and length
    function sha1(buffer, offset, length) {
      offset = offset || 0;
      length = length || buffer.length;
      var subArray = dicomParser.sharedCopy(buffer, offset, length);
      var rusha = new Rusha();
      return rusha.digest(subArray);
      }
      
      // Read the DICOM P10 file from disk into a BufPfer
      async function GetDicomData(directoryName) {
        console.log('-------------++++++++++++========')
      console.log(directoryName)
      fs.readdir(directoryName, (err, fileNames) => {
        fileNames.forEach((filename) => {
          fs.readFile(directoryName, 'base64', (err, base64Data) => {
            // Do your thing with the file data.
            console.log(base64Data,'++++++++++++++++++++++++++++')
          });
        });
      });
      var filePath = process.argv[2] || 'ctimage.dcm';
      let dataSet_list = [];
      fs.readdirSync(directoryName).forEach(function (name) {
        console.log("++++++++++++++++++")
        console.log(name)
        var dicomFileAsBuffer = fs.readFileSync(directoryName+'/'+name);
      
      // Print the sha1 hash for the overall file
      console.log('File SHA1 hash = ' + sha1(dicomFileAsBuffer));
      
      // Parse the dicom file
      try {
        var dataSet = dicomParser.parseDicom(dicomFileAsBuffer);
        dataSet_list.push(dataSet);
        console.log('"""""""""""""""""""""""""""""""""""""""""""')
      console.log(dataSet.elements.x0040a504.items[0].elements)
      // print the patient's name
        var patientName = dataSet.string('x00100010');
        console.log('Patient Name = '+ patientName);
      
      // Get the pixel data element and calculate the SHA1 hash for its data
        var pixelData = dataSet;
        var pixelDataBuffer = dicomParser.sharedCopy(dicomFileAsBuffer, pixelData.dataOffset, pixelData.length);
        console.log('Pixel Data length = ', pixelDataBuffer.length);
        console.log("Pixel Data SHA1 hash = ", sha1(pixelDataBuffer));
      
      
        if(pixelData.encapsulatedPixelData) {
        var imageFrame = dicomParser.readEncapsulatedPixelData(dataSet, pixelData, 0);
        console.log('Old Image Frame length = ', imageFrame.length);
        console.log('Old Image Frame SHA1 hash = ', sha1(imageFrame));
      
        if(pixelData.basicOffsetTable.length) {
          var imageFrame = dicomParser.readEncapsulatedImageFrame(dataSet, pixelData, 0);
          console.log('Image Frame length = ', imageFrame.length);
          console.log('Image Frame SHA1 hash = ', sha1(imageFrame));
        } else {
          var imageFrame = dicomParser.readEncapsulatedPixelDataFromFragments(dataSet, pixelData, 0, pixelData.fragments.length);
          console.log('Image Frame length = ', imageFrame.length);
          console.log('Image Frame SHA1 hash = ', sha1(imageFrame));
        }
        }
        else { 
          dicomjs.parse(dicomFileAsBuffer, async function (err, dcmData) {  
                      for (var key in dcmData.dataset) {
                          if(!dcmData.dataset[key].isSequence && !dcmData.dataset[key].isPixelData) {
                            if(dcmData.dataset[key].tag == '60051010'){
                          // console.log(result2);
//                           const xmlToJson = require('xml-to-json-stream');
// const parser = xmlToJson({attributeMode:false});
 

// var convert = require('xml-js');
// const xml = `${dcmData.dataset[key].value}`
// var result1 = convert.xml2json(xml, {compact: true, spaces: 4});
// var result2 = convert.xml2json(xml, {compact: false, spaces: 4});
// console.log(result1);
// fs.writeFile(`./profileImages/${req['uniqueId']}.json`, `${result1}`, function (err) {
//   if (err) throw err;
//   console.log(err)
//   console.log('File is created successfully.');
// });

const xmlToJson = require('xml-to-json-stream');
const parser = xmlToJson({attributeMode:false});
const xml = `${dcmData.dataset[key].value}`
parser.xmlToJson(xml, (err,json)=>{
  if(err) {
    console.log(err)
  }

//console.log(JSON.stringify(json))
fs.writeFile(`./profileImages/${req['uniqueId']}.txt`, JSON.stringify(json), function (err) {
  if (err) throw err;
   console.log(err)
});
})
 
                            }
                     } 
              }
          })
          }
      }
      catch(err) {
        console.log(err);
      }
      })
      let patientObj = {};
      
     // console.log(dataSet_list[0])
      dataSet_list.map(data => {
        patientObj.name = data.string('x00100010');
        patientObj.age = data.string('x00101010	');
        patientObj.hospitalname = data.string('x00080080');
        patientObj.testdate = data.string('x00080023');
        patientObj.dob = data.string('x00101030');
        patientObj.height = data.string('x00101020');
        patientObj.mobileNumber = data.string('x00102154');
        patientObj.bmi = data.string('x00101022');
        patientObj.examinedDate = data.string('x00180015');
        patientObj.window = data.string('x00281050');
        patientObj.bp = data.string('x00080020')	
        ;
        patientObj.weight = data.string('x00101030');
      
        patientObj.gender = data.string('x00100040');
        patientObj.vk= data.string('x0040db00')
      })
      console.log(patientObj)
      return patientObj
      
      }
  // let measurementdata = measurement.push(data=>{
  //   return data
  // })
    
    // exports.createPatient = async  function GetDicomData(req,res) {
        if (req.uploadError) {
        return res.end('Error uploading in dicom images')
      }
      let patientObj = await GetDicomData(`./directory/${req['uniqueId']}`)
      //Rename the dicom files here 
      fs.readdirSync(`./directory/${req['uniqueId']}`).forEach(function (name,index) {
        var oldfilepath = `./directory/${req['uniqueId']}/${name}`
        var newfilepath = `./directory/${req['uniqueId']}/${index}.dcm`
        fs.renameSync(oldfilepath,newfilepath )
        fileLength =fs.readdirSync(`./directory/${req['uniqueId']}`).length
        console.log(fileLength)
      })
     let p= await Patient.create({ 
        patientname:patientObj.name,
        gender:patientObj.gender,
        height:patientObj.height,
        weight:patientObj.weight,
        testdate:patientObj.testdate,
        clinicId:req.params.id,
        //type: req.file.mimetype,
        dicomImagesId: req['uniqueId'],   //mapping the patient to dicom images 
        status: 'created',
        length: fileLength,
        }).then((patient) => {
         // console.log(req.file.mimetype)
          res.send({'message': 'patient uploaded successfully!', 'user':patientObj.name,status:200});
        });
        return p
      }
    );
    
  }