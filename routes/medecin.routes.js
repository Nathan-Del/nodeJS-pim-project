MedecinController = require('../controllers/medecin.controllers');
module.exports = (server)=> {
    server.get('/Medecin',MedecinController.findAll);
    server.get('/Medecin/:id',MedecinController.findOne);
    server.put('/Medecin/:id',MedecinController.update);
    server.post('/Medecin',MedecinController.login);
    server.delete('/Medecin/:id',MedecinController.delete);
    
}