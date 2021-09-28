const mongoose = require('mongoose');
 
const PatientSchema = mongoose.Schema({
    name: {type: String, unique: true, required: true},
    NIR: {type: String, unique: false, required: true},
    status: {type: String, required: true},
    responses: String,
    score: String
});
 
module.exports = mongoose.model('Patient', PatientSchema);