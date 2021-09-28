const dbConfig = require("../config/dbconfig")

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.url = dbConfig.url;
db.medecins = require("./medecin.model")(mongoose);
db.patients = require("./patient.model")(mongoose);

module.exports = db;