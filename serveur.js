const bodyParser = require('body-parser');
const express = require('express');
const routesPatient = require('./routes/patient.routes');
const routesMedecin = require('./routes/medecin.routes');
const routesRetourMedecin = require('./routes/RetourMedecin.routes');
const server = express();
const db = require("./models");
const cors = require('cors');
server.use(cors(OptionsCors));
var OptionsCors = {
    origine : 'localhost:4200',
    optionsSuccessStatus : 200 // certains navigateurs hérités (IE11, divers SmartTV) s'étouffent sur 204 
  }

db.mongoose
.connect(db.url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.set('json spaces', 2);

routesPatient(server);
routesMedecin(server);
routesRetourMedecin(server);

server.listen(3000, () =>{
    console.log("Serveur demarré en écoute sur le porte 3000 !")
});
