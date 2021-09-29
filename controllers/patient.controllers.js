const Patient = require('../models/patient.model.js');
const config = require('../token.config');
let jwt = require('jsonwebtoken');

const {PythonShell, PythonShellError} = require('python-shell');

// Login a patient
exports.login = (req, res) => {
    let name = req.body.name;
    let NIR = req.body.NIR;

    Patient.findOne({name})
    .then(patient => {
        if(!patient) {
            return res.status(404).send({
                message: "name not found"
            });            
        }
        if (name && NIR) {
            if (name === patient.name && NIR === patient.NIR) {
                let token = jwt.sign({_id: patient._id,name: name},
                    config.secret,
                    { 
                        expiresIn: '24h' // expires in 24 hours
                    }
                );
                // return the JWT token for the future API calls
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token,
                    patient_id:patient._id

                });
            } else {
                res.send(403).json({
                    success: false,
                    message: 'Incorrect name or NIR'
                });
            }
        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Patient not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving patient with id " + req.params.id
        });
    });
};

// Create and Save a new patient
exports.create = (req, res) => {

    // Validate request
    if(!req.body.name || !req.body.NIR) {
        return res.status(400).send({
            message: "Patient name or NIR can not be empty"
        });
    }

    // Create a patient
    const patient = new Patient({
        name: req.body.name,
        NIR: req.body.NIR,
        status: req.body.status
    });

    // Save patient in the database
    patient.save()
    .then(data => {
        let token = jwt.sign({_id: data._id,name: req.body.name},
            config.secret,
            { 
                expiresIn: '24h' // expires in 24 hours
            }
        );
        res.json({
            success: true,
            message: 'Authentication successful!',
            token: token,
            id: data._id
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Patient."
        });
    });
};

// Retrieve and return all patients from the database.
exports.findAll = (req, res) => {
    Patient.find()
    .then(patients => {
        res.send(patients);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving patients."
        });
    });
};

// Find a single patient with a patientId
exports.findOne = (req, res) => {
    Patient
    .findById(req.params.id)
    .then(patient => {
        if(!patient) {
            return res.status(404).send({
                message: "Patient not found with id " + req.params.id
            });            
        }
        res.send(patient);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Patient not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving patient with id " + req.params.id
        });
    });
};
let testVAR = 0;
let error = "";


// Update a patient identified by the patientId in the request
exports.update = (req, res) => {
    // Find patient and update it with the request body
    Patient.findById(req.params.id)
    .then(patient => {
        if(!patient) {
            return res.status(404).send({
                message: "Patient not found with id " + req.params.id
            });            
        }
        Patient.findByIdAndUpdate(req.params.id, {
            name: req.body.name ? req.body.name : patient.name,
            NIR: req.body.NIR ? req.body.NIR : patient.NIR,
            status: req.body.status ? req.body.status : patient.status,
            responses: req.body.responses ? req.body.responses : patient.responses,
            score: req.body.score ? req.body.score : patient.score
        }, {new: true})
        .then(patient => {
            if(!patient) {
                return res.status(404).send({
                    message: "Patient not found with id " + req.params.id
                });
            }
            res.send(patient);
            
        
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Patient not found with id " + req.params.id
                });                
            }
            return res.status(500).send({
                message: "Erreur updating patient with id " + req.params.id + " " + err
            });
        });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Patient not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving patient with id " + req.params.id
        });
    });

    
};

function intervalFunc() {
    try {
        if(testVAR == 1){
            console.log("tttttttt");
            //console.log("shell : " + shell.childProcess);
            if(error == "ReferenceError: childProcess is not defined"){
                testVAR = 0;
                shell.childProcess.kill('SIGINT');
                
            }
            testVAR = 0;
        }
        else{
            var shell = new PythonShell('questionnaire.py');
            shell.on('message', function(message) {
                console.log(message);
                if(message = "stop"){
                    testVAR += 1;
                }
                
            });
            //shell.end();
            //shell.kill();
        }
    } catch (error) {
        console.log("error : " + error)
    }
}

//La fonction 'intervalFunc' s'éxécutera toute les x milisecondes, soit toute les 10 secondes ici:
setInterval(intervalFunc, 10000);

// Delete a patient with the specified patientId in the request
exports.delete = (req, res) => {
    Patient.findByIdAndRemove(req.params.id)
    .then(patient => {
        if(!patient) {
            return res.status(404).send({
                message: "Patient not found with id " + req.params.id
            });
        }
        res.send({message: "Patient deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Patient not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete patient with id " + req.params.id
        });
    });
};




exports.test = (req, res) => {
    // var spawn = require("child_process").spawn; 
    // var process = spawn('python',["../script/hello.py"] ); 
    // let pyshell = new PythonShell('hello.py');

    // pyshell.on('message', function(message) {
    // console.log(message);
    // })

    // pyshell.end(function (err) {
    // if (err){
    //     throw err;
    // };
    // console.log('finished');
    // });

    PythonShell.run('hello.py',null, function (err, results) {
        // console.log(results);
      });


    res.send({message: "Patient deleted successfully!"});
};

