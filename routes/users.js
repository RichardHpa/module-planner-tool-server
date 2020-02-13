const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/Users');

router.post('/register', function(req, res){
    // console.log(req.body.password);
    // User.findOne({ username: req.body.username }, function (err, checkUser) {
    //     if(checkUser){
    //         res.send('user already exists');
    //     } else {
    //         const hash = bcrypt.hashSync(req.body.password);
    //         const user = new User({
    //             _id: new mongoose.Types.ObjectId(),
    //             username: req.body.username,
    //             email: req.body.email,
    //             password: hash
    //         });
    //         user.save().then(result => {
    //             res.send(result);
    //         }).catch(err => res.send(err));
    //     }
    // });
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    user.save(function(err) {
      if (err) {
        res.status(500)
          .send("Error registering new user please try again.");
      } else {
        res.status(200).send("Welcome to the club!");
      }
    });
});

router.post('/login', function(req, res){
    User.findOne({ username: req.body.username }, function (err, checkUser) {;
        if(checkUser){
            if(bcrypt.compareSync(req.body.password, checkUser.password)){
                res.send(checkUser);
            } else {
                res.send('invalid password');
            }
        } else {
            res.send('invalid user');
        }
    });
});

module.exports = router;
