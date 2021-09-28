const RetourMedecin = require('../models/RetourMedecin.model.js');
const config = require('../token.config');
let jwt = require('jsonwebtoken');

// Create and Save a new RetourMedecin
exports.create = (req, res) => {

    // Validate request
    if(!req.body.response || !req.body.nbrQuestion) {
        return res.status(400).send({
            message: "RetourMedecin response or avi or nbrQuestion can not be empty"
        });
    }

    // Create a RetourMedecin
    const retour_medecin = new RetourMedecin({
        response: req.body.response,
        avi: req.body.avi,
        nbrQuestion: req.body.nbrQuestion
    });

    // Save medecin in the database
    retour_medecin.save()
    .then(data => {
        let token = jwt.sign({_id: data._id,response: req.body.response},
            config.secret,
            { 
                expiresIn: '24h' // expires in 24 hours
            }
        );
        res.json({
            success: true,
            message: 'RetourMedecin create successfully!',
            token: token
        });
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the RetourMedecin."
        });
    });
};

// Retrieve and return all RetourMedecin from the database.
exports.findAll = (req, res) => {
    RetourMedecin.find()
    .then(retour_medecin => {
        res.send(retour_medecin);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving retour_medecin."
        });
    });
};

// Find a single medecin with a medecinId
exports.findOne = (req, res) => {
    RetourMedecin
    .findById(req.params.id)
    .then(retour_medecin => {
        if(!retour_medecin) {
            return res.status(404).send({
                message: "Medecin not found with id " + req.params.id
            });            
        }
        res.send(retour_medecin);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Medecin not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving medecin with id " + req.params.id
        });
    });
};

// Update a RetourMedecin identified by the id in the request
exports.update = (req, res) => {
    // Find medecin and update it with the request body
    RetourMedecin.findById(req.params.id)
    .then(retour_medecin => {
        if(!retour_medecin) {
            return res.status(404).send({
                message: "RetourMedecin not found with id " + req.params.id
            });            
        }
        RetourMedecin.findByIdAndUpdate(req.params.id, {
            response: req.body.response ? req.body.response : retour_medecin.response,
            avi: req.body.avi ? req.body.avi : retour_medecin.avi,
            nbrQuestion: req.body.nbrQuestion ? req.body.nbrQuestion : retour_medecin.nbrQuestion
        }, {new: true})
        .then(retour_medecin => {
            if(!retour_medecin) {
                return res.status(404).send({
                    message: "RetourMedecin not found with id " + req.params.id
                });
            }
            res.send(retour_medecin);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "RetourMedecin not found with id " + req.params.id
                });                
            }
            return res.status(500).send({
                message: "Error updating RetourMedecin with id " + req.params.id
            });
        });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "RetourMedecin not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving RetourMedecin with id " + req.params.id
        });
    });
};

// Delete a RetourMedecin with the specified id in the request
exports.delete = (req, res) => {
    RetourMedecin.findByIdAndRemove(req.params.id)
    .then(retour_medecin => {
        if(!retour_medecin) {
            return res.status(404).send({
                message: "RetourMedecin not found with id " + req.params.id
            });
        }
        res.send({message: "RetourMedecin deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "RetourMedecin not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Could not delete RetourMedecin with id " + req.params.id
        });
    });
};

