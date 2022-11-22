const Appointment = require('../models/appointment');

exports.sendAppointments = (req, res, next) => {
    Appointment.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json(error));
};