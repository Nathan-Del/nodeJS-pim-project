PatientController = require('../controllers/patient.controllers');
module.exports = (server)=> {
    server.get('/Patient',PatientController.findAll);
    server.get('/Patient/:id',PatientController.findOne);
    server.put('/Patient/:id',PatientController.update);
    server.post('/Patient',PatientController.create);
    server.delete('/Patient/:id',PatientController.delete);
    
}