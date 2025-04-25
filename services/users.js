const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


exports.getById = async (req, res, next) => {
    const id = req.params.id 

    try {
        let user = await User.findById(id);

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user-not-found');
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

        const temp = ({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        try {
            let user = await User.create(temp);

            console.log("User created " + user.name);
            return res.redirect('/tableau-de-bord');
        } catch (e) {
            return res.status(501).json(e);
        }
    }
];


exports.update = [

    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const temp = ({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        const id = req.params.id;

        try {
            let user = await User.findOne({_id : id});

            if (user) {
                Object.keys(temp).forEach((key) => {
                    if (!!temp[key]) {
                        user[key] = temp[key];
                    }
                });

                await user.save();
                return res.status(201).json(user);
            }

            return res.status(404).json("user_not_found");
        } catch (e) {
            return res.status(501).json(e);
        }
    }
];


exports.delete = async (req, res, next) => {
    const id = req.params.id 

    try {
        await User.deleteOne({ _id: id });

        return res.status(204).json('delete_ok');
    } catch (e) {
        return res.status(501).json(e)
    }
}; 


exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updateAt');

        let hashedPass = bcrypt.hashSync(password, 10);

        if (user) {
            bcrypt.compare(password, user.password, function(err, response) {
                if (err) {
                    throw new Error(err);
                }
                if (response) {
                    delete user._doc.password;

                    const expireIn = 24*60*60*60;
                    const token = jwt.sign({
                        user: user
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: expireIn
                    });

                    res.cookie('token', token, {
                        httpOnly: true,
                        maxAge: expireIn
                    });

                    res.header('Authorization', 'Bearer ' + token);
                    //res.status(200).json('authenticate_succeed');
                    return res.redirect('/tableau-de-bord');
                }

                return res.status(403).json('wrong_credentials');
            });
        } else {
            return res.status(404).json('user_not_found');
        }
    } catch (error) {
        return res.status(501).json(error);
    }
}