const express = require('express');
const router = express.Router();

const userRoute = require('../routes/users');
const catwayRoute = require('../routes/catways');
const reservationRoute = require('../routes/reservation');
const tableauRoute = require('../routes/tableau');

router.use('/users', userRoute);
router.use('/catways', catwayRoute);
router.use('/reservation', reservationRoute);
router.use('/tableau-de-bord', tableauRoute);

module.exports = router;