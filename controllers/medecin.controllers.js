const Medecin = require('../models/medecin.model.js');
const config = require('../token.config');
let jwt = require('jsonwebtoken');

// Login a medecin
exports.login = (req, res) => {
    let name = req.body.name;
    let password = req.body.password;

    Medecin.findOne({name})
    .then(medecin => {
        if(!medecin) {
            return res.status(404).send({
                message: "name not found"
            });            
        }
        if (medecin && password) {
            if (name === medecin.name && password === medecin.password) {
                let token = jwt.sign({_id: medecin._id,name: name},
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
                    id: medecin._id

                });
            } else {
                res.send(403).json({
                    success: false,
                    message: 'Incorrect name or password'
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
                message: "Medecin not found with id " + req.params.medecin._id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving medecin with id " + req.params.medecin._id
        });
    });
};

// Create and Save a new medecin
exports.create = (req, res) => {

    // Validate request
    if(!req.body.name || !req.body.password) {
        return res.status(400).send({
            message: "Medecin name or password can not be empty"
        });
    }

    // Create a medecin
    const medecin = new Medecin({
        name: req.body.name,
        password: req.body.password
    });

    // Save medecin in the database
    medecin.save()
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
            token: token
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Medecin."
        });
    });
};

// Retrieve and return all medecins from the database.
exports.findAll = (req, res) => {
    Medecin.find()
    .then(medecins => {
        res.send(medecins);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving medecins."
        });
    });
};

// Find a single medecin with a medecinId
exports.findOne = (req, res) => {
    Medecin
    .findById(req.params.id)
    .then(medecin => {
        if(!medecin) {
            return res.status(404).send({
                message: "Medecin not found with id " + req.params.medecinId
            });            
        }
        res.send(medecin);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Medecin not found with id " + req.params.medecinId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving medecin with id " + req.params.medecinId
        });
    });
};

// Update a medecin identified by the medecinId in the request
exports.update = (req, res) => {
    // Find medecin and update it with the request body
    Medecin.findById(req.params.medecinId)
    .then(medecin => {
        if(!medecin) {
            return res.status(404).send({
                message: "Medecin not found with id " + req.params.medecinId
            });            
        }
        Medecin.findByIdAndUpdate(req.params.medecinId, {
            name: req.body.name ? req.body.name : medecin.name,
            password: req.body.password ? req.body.password : medecin.password
        }, {new: true})
        .then(medecin => {
            if(!medecin) {
                return res.status(404).send({
                    message: "Medecin not found with id " + req.params.medecinId
                });
            }
            res.send(medecin);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Medecin not found with id " + req.params.medecinId
                });                
            }
            return res.status(500).send({
                message: "Error updating medecin with id " + req.params.medecinId
            });
        });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Medecin not found with id " + req.params.medecinId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving medecin with id " + req.params.medecinId
        });
    });
};

// Delete a medecin with the specified medecinId in the request
exports.delete = (req, res) => {
    Medecin.findByIdAndRemove(req.params.medecinId)
    .then(medecin => {
        if(!medecin) {
            return res.status(404).send({
                message: "Medecin not found with id " + req.params.medecinId
            });
        }
        res.send({message: "Medecin deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Medecin not found with id " + req.params.medecinId
            });                
        }
        return res.status(500).send({
            message: "Could not delete medecin with id " + req.params.medecinId
        });
    });
};

