RetourMedecinController = require('../controllers/RetourMedecin.controllers');
module.exports = (server)=> {
    server.get('/RetourMedecin',RetourMedecinController.findAll);
    server.get('/RetourMedecin/:id',RetourMedecinController.findOne);
    server.put('/RetourMedecin/:id',RetourMedecinController.update);
    server.post('/RetourMedecin',RetourMedecinController.create);
    server.delete('/RetourMedecin/:id',RetourMedecinController.delete); 
}