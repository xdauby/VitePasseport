const api = require('./bot.js');
const Appointment = require('../models/appointment.js');

setInterval(() => {
    api.actualyzeDatabase();
}, 20000);