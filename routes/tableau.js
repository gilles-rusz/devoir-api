const express = require('express');
const router = express.Router();

const service = require('../services/tableau');
console.log("Type de service.tableau:", typeof service.tableau);

const private = require('../middlewares/private');


router.get('/', private.checkJWT, service.tableau);

router.post('/updateUser', private.checkJWT, service.updateUser);
router.post('/updateUser/:id', private.checkJWT, service.updateUserById);
router.delete('/deleteUser', private.checkJWT, service.deleteUser); 

router.get('/updateCatway/:id', private.checkJWT, service.updateCatway);
router.post('/updateCatway/:id', private.checkJWT, service.updateCatwayById);
router.delete('/deleteCatway/:id', private.checkJWT, service.deleteCatway); 

router.post('/addReservation', private.checkJWT, service.addReservation);
router.get('/getReservationInfo/:id', private.checkJWT, service.getReservationInfo);
router.delete('/deleteReservation/:id', private.checkJWT, service.deleteReservation);


module.exports = router;
