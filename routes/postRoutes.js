const router = require('express').Router();
const postModel = require('../model/post');
const secret = "SECRETS";
const jwt = require('jsonwebtoken');

const checkLogin = (req,res,next) => {
    try {
        const token = req.headers.authorization?.split("Test ")[1];
        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                // err
                // decoded undefined
                if (err) {
                    res.json({
                        status: "failed",
                        message: err.message
                    })
                }
          });  
        }
        else {
            res.status(400).json({
                status: "failed",
                message: "There is no valid token, Login first!!"
            })
        }
    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }   
    next();
}

router.get('/posts', checkLogin, async (req,res) => {
    try {
        const token = req.headers.authorization?.split("Test ")[1];
        const user = jwt.decode(token);
        const posts = await postModel.find({user: user.data});
        res.status(200).json(posts)
    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
})

router.post('/posts', checkLogin, async (req,res) => {
    try {
        const token = req.headers.authorization?.split("Test ")[1];
        const user = jwt.decode(token);
        const {title, body, image} = req.body;
        const post = await postModel.create({
            title,
            body,
            image,
            user: user.data
        })
        res.status(200).json(post)
    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
})

router.put('/posts/:id', checkLogin, async (req,res) => {
    try {
        const token = req.headers.authorization?.split("Test ")[1];
        const user = jwt.decode(token);
        const filter = {$and: [{_id: req.params.id}, {user: user.data}]};
        const post = await postModel.findOneAndUpdate(filter, req.body, {new: true});
        if (post) {
            res.status(200).json(post)
        }
        else {
            res.status(400).json({
                status: "failed",
                message: "ID mismatched"
            })
        }
       
    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
})


router.delete('/posts/:id', checkLogin, async (req,res) => {
    try {
        const token = req.headers.authorization?.split("Test ")[1];
        const user = jwt.decode(token);
        const filter = {$and: [{_id: req.params.id}, {user: user.data}]};
        const post = await postModel.findOneAndDelete(filter);
        if (post) {
            res.status(200).json({
                status: "Success",
                message: "Deleted Successfully"
            })
        }
        else {
            res.status(400).json({
                status: "failed",
                message: "ID mismatched"
            })
        }
    }
    catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message
        })
    }
})


module.exports = router