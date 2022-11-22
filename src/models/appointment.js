const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  townhall: {type: String, required: true },
  date: {type: String, required: true },
  hours: {type: String, required: true },
  appt_link: {type: String, required: true}
});

module.exports = mongoose.model('Appointment', appointmentSchema);