const { validationResult } = require('express-validator');

const User = require('../models/user');
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const { render } = require('ejs');



exports.tableau = async (req, res, next) => {
    try {
        const users = await User.find({});
        const catways = await Catway.find({});
        const reservationList = await Reservation.find({});
        const catwayId = await Catway.findOne({});
        return res.render('tableau', { 
            title: 'Tableau de bord', 
            users: users,
            catways: catways,
            reservation: reservationList,
            catwayId: catwayId._id
        })
    } catch (error) {
        return res.status(500).json(error);
    }
}


exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.body.user;
        let user = await User.findById(userId);

        return res.render('updateUser', {
            title: "Update user",
            user: user
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};


exports.updateUserById = async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let temp = {
            "name": req.name,
            "email": req.email,
            "password": req.password
          }

    try {
      const id = req.params.id;
  
      const token = req.cookies.token;

      
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing authorization token' });
      }
  
    
      fetch(`http://${process.env.API_URL}/users/${id}`, {
        method: "PATCH",
        headers: {
          'authorization': `Bearer ${token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(temp),
      })
        .then(response => {
          if (response.ok) {
            //console.log("Utilisateur modifier ");
            return res.redirect('/tableau-de-bord');
          } else {
            return response.json().then(errorData => {
              return res.status(response.status).json(errorData);
            });
          }
        })
        .catch(error => {
          console.error('Error updating user:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };


exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.query.user;

        const token = req.cookies.token;

        if (!token) {
          return res.status(401).json({ message: 'Unauthorized: Missing authorization token' });
        };

        
        fetch(`http://${process.env.API_URL}/users/${userId}`, {
          method: "DELETE",
          headers: {
            'authorization': `Bearer ${token}`, 
          }
        })
          .then(response => {
            if (response.ok) {
              //console.log("Utilisateur supprimé ");
              return res.redirect('/tableau-de-bord');
            } else {
              return response.json().then(errorData => {
                return res.status(response.status).json(errorData);
              });
            }
          })
          .catch(error => {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
          });
      } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
};


exports.updateCatway = async (req, res, next) => {
  try {
      const catwayId = req.params.id;
      let catway = await Catway.findById(catwayId);

      return res.render('updateCatway', {
          title: "Update Catway",
          catway: catway
      });
  } catch (error) {
      return res.status(500).json(error);
  }
};


exports.updateCatwayById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  let temp = {
      "catwayState": req.body.catwayState
    }

  try {
    const id = req.params.id;

    const token = req.cookies.token;

    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing authorization token' });
    }

    
    fetch(`http://${process.env.API_URL}/catways/${id}`, {
      method: "PATCH",
      headers: {
        'authorization': `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(temp),
    })
      .then(response => {
        if (response.ok) {
          //console.log("Utilisateur modifier ");
          return res.redirect('/tableau-de-bord');
        } else {
          return response.json().then(errorData => {
            return res.status(response.status).json(errorData);
          });
        }
      })
      .catch(error => {
        console.error('Error updating catway:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.deleteCatway = async (req, res, next) => {
  try {
      const id = req.params.id;
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing authorization token' });
      };

  
      fetch(`http://${process.env.API_URL}catways/${id}`, {
        method: "DELETE",
        headers: {
          'authorization': `Bearer ${token}`,
        }
      })
        .then(response => {
          if (response.ok) {
            return res.redirect('/tableau-de-bord');
          } else {
            return response.json().then(errorData => {
              return res.status(response.status).json(errorData);
            });
          }
        })
        .catch(error => {
          console.error('Error deleting catway:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  exports.addReservation = async (req, res, next) => {
    try {
      const catway = JSON.parse(req.catwayNumber);

      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing authorization token' });
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      myHeaders.append("Authorization", token);

      const urlencoded = new URLSearchParams();
      urlencoded.append("bookingId", req.reservationId);
      urlencoded.append("clientName", req.clientName);
      urlencoded.append("boatName", req.boatName);
      urlencoded.append("checkIn", req.checkIn);
      urlencoded.append("checkOut", req.checkOut);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded
      };

      await fetch(`http://${process.env.API_URL}/catways/${catway._id}/reservations`, 
        requestOptions)
        .then(response => {
          if (response.ok) {
            return res.redirect('/tableau-de-bord');
          } else {
            return response.json().then(errorData => {
              return res.status(response.status).json(errorData);
            });
          }
        })
        .catch(error => {
          console.error('Error deleting catway:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };


exports.getReservationInfo = async (req, res, next) => {
  try {
    const id = req.params.id;

    const reserv = await reservation.findById(id);

    const catway = await Catway.findOne({catwayNumber: reserv.catwayNumber})

    return res.redirect(`/catways/${catway._id}/reservations/${book._id}`)
  } catch (error) {
    console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.deleteReservation = async (req, res, next) => {
  try {
      const id = req.params.id;
      const token = req.cookies.token;

      const reserv = await reservations.findById(id);
      const catway = await Catway.findOne({"catwayNumber": reserv.catwayNumber});

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing authorization token' });
      };

      // Delete request avec token et gestion de l'erreur
      fetch(`http://${process.env.API_URL}/catways/${catway._id}/reservations/${id}`, {
        method: "DELETE",
        headers: {
          'authorization': `Bearer ${token}`, // Inclusion du tekon dans le header
        }
      })
        .then(response => {
          if (response.ok) {
            return res.redirect('/tableau-de-bord');
          } else {
            return response.json().then(errorData => {
              return res.status(response.status).json(errorData);
            });
          }
        })
        .catch(error => {
          console.error('Error deleting catway:', error);
          return res.status(500).json({ message: 'Internal Server Error' });
        });
    } catch (error) {
      console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};
