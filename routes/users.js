const express = require('express');
const router = express.Router();

const User = require('../models/Users');

const auth = require('../middleware/auth');

// router.post('/register', function(req, res){
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
//     const { username, email, password } = req.body;
//     const user = new User({ username, email, password });
//     user.save(function(err) {
//       if (err) {
//         res.status(500)
//           .send("Error registering new user please try again.");
//       } else {
//         res.status(200).send("Welcome to the club!");
//       }
//     });
// });

// router.post('/login', function(req, res){
//     User.findOne({ username: req.body.username }, function (err, checkUser) {;
//         if(checkUser){
//             if(bcrypt.compareSync(req.body.password, checkUser.password)){
//                 res.send(checkUser);
//             } else {
//                 res.send('invalid password');
//             }
//         } else {
//             res.send('invalid user');
//         }
//     });
// });

router.post('/register', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password);
        console.log(user);
        // if (!user) {
        //     console.log('here');
        //     return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        // }
        // const token = await user.generateAuthToken()
        // res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

})


router.post('/logout', auth, async (req, res) => {
    // Log user out of the application
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})


router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})

module.exports = router;
