const userModel = require('../model/user');
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const secret = "SECRETS";
const jwt = require('jsonwebtoken');


router.post('/register', body('email').isEmail(), body('password').isLength({min: 5}),async (req,res) => {
   try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
     return res.status(400).json({errors: errors.array()})
    }
    else {
         bcrypt.hash(req.body.password, 10, async (err,hash) => {
             if (err) {
                 res.status(400).json({
                     status: "failed",
                     message: err.message
                 })
             }
             else {
                const isEmailExist = await userModel.find({email: req.body.email})
                if (isEmailExist) {
                    res.status(400).json({status: "failed"});
                }
                else {
                await userModel.create({
                     name: req.body.name,
                     email: req.body.email,
                     password: hash
                 })
                }
             }
         })
    }
   }    
   catch(err) {
    res.status(400).json({
        status: "failed",
        message: err.message
    })
   }
})


router.post('/login', async (req,res) => {
    try {
        const {email} = req.body;
        const user = await userModel.findOne({email});
        if(!user) {
            res.status(400).json({
                status: "failed",
                message: "No valid user with this email"
            })
        }
        else {
           // Load hash from your password DB.
            bcrypt.compare(req.body.password, user.password,(err, result) => {
            // result == true
            if (err) {
                res.status(400).json({
                    status: "failed",
                    message: err.message
                })
            }
            if (result) {
                const token = jwt.sign({
                    data: user.email
                }, secret, {expiresIn: '1h'});
                res.json({
                    status: "Login Successful",
                    token
                })
            }
            else {
                res.status(400).json({
                    status: "failed",
                    message: "Invalid password credentials"
                })
            }
        });
        }

    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
})

module.exports = router;