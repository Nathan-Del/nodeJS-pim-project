const mongoose = require('mongoose');

const MedecinSchema = mongoose.Schema({
    name: {type: String, unique: true, required: true},
    password: {type: String, unique: false, required: true}
});
 
module.exports = mongoose.model('Medecin', MedecinSchema);