const mongoose = require('mongoose');

const RetourMedecinSchema = mongoose.Schema({
    response: {type: String, required: true},
    avi: {type: Boolean, required: true},
    nbrQuestion: {type: String, required: true}
});
 
module.exports = mongoose.model('RetourMedecin', RetourMedecinSchema);