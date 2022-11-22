const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');
const appointmentCtrl = require('../controllers/appointmentRoutes');

router.use('/', appointmentCtrl.sendAppointments);
  
module.exports = router;