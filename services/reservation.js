const reservation = require('../models/reservation');
const Catway = require('../models/catway');
const {validationResult } = require('express-validator');


exports.getAll = async (req, res, next) => {
    try {
        const id = req.params.id
        let booking = await reservation.find({});
        let catway = await Catway.findById(id);
        
        if (booking) {
            return res.render('reservation', { title: 'Réservations', reservation: reservation, catway: catway });
        }
    } catch (e) {
        return res.status(501).json(e);
    }
}

exports.getById = async (req, res, next) => {
    const id = req.params.id
    const idReservation = req.params.idReservation 

    try {
        let catway = await Catway.findById(id);

        if (catway) {
            let booking = await reservation.findById(idReservation)
                if (booking) {
                    //res.status(200).json(booking);
                    return res.render('reservationInfo', { title: 'Information réservation', reservation: reservation, catway: catway })
                }
            return res.status(404).json("Aucune réservation trouvé");
        }

        return res.status(404).json('catway-not-found');
    } catch (e) {
        return res.status(501).json(e);
    }
}

exports.add = [
    async (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        let catway = await Catway.findById(id);

        if (catway) {
            const temp = ({
                reservationId: req.reservationgId,
                catwayNumber: catway.catwayNumber,
                clientName: req.clientName,
                boatName: req.boatName,
                checkIn: req.checkIn,
                checkOut: req.checkOut
            })
    
            try {
                let reservation = await reservation.create(temp);
    
                return res.status(201).json(reservation);
            } catch (e) {
                return res.status(501).json(e);
            }
        }
    }
];


exports.update = [
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        let catway = await Catway.findById(id);

        if (catway) {
            const temp = ({
                reservationId: req.reservationgId,
                catwayNumber: catway.catwayNumber,
                clientName: req.clientName,
                boatName: req.boatName,
                checkIn: req.checkIn,
                checkOut: req.checkOut
            })
    
            const idReservation = req.params.idReservation;
    
            try {
                let booking = await reservation.findById(idReservation);
    
                if (reservation) {
                    Object.keys(temp).forEach((key) => {
                        if (!!temp[key]) {
                            reservation[key] = temp[key];
                        }
                    });
    
                    await reservation.save();
                    return res.status(201).json(reservation);
                }
    
                return res.status(404).json("reservation_not_found");
            } catch (e) {
                return res.status(501).json(e);
            }
        }
    }
];


exports.delete = async (req, res, next) => {
    const id = req.params.id;
    let catway = await Catway.findById(id);

    if (catway) {
        const idReservation = req.params.idReservation;

        try {
            await reservation.deleteOne({ _id: idReservation });
    
            return res.status(204).json('delete_ok');
        } catch (e) {
            return res.status(501).json(e)
        }
    }
};