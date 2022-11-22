const mongoose = require('mongoose');
const express = require('express');
const app = express();
const appointmentsRoute = require('./src/routes/appointmentRoutes');
const database_updater = require('./src/scriptjs/databaseUpdater.js');

const configMdb = require('./src/config/configMdb');

mongoose.connect(configMdb,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion to MongoDB succeeded'))
  .catch(() => console.log('Connexion to MongoDB failed'));

app.use(express.json());

app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/rdv-passport', appointmentsRoute);

  
module.exports = app;
