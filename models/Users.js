const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');



const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    name: {
         type: String,
         required: true,
         trim: true
     },
    username: {
         type: String,
         required: true,
         unique: true,
         trim: true
     },
     email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         validate: value => {
             if (!validator.isEmail(value)) {
                 throw new Error({error: 'Invalid Email address'})
             }
         }
     },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});


// UserSchema.pre('save', function(next) {
//     // Check if document is new or a new password has been set
//     if (this.isNew || this.isModified('password')) {
//         const document = this;
//         bcrypt.hash(document.password, saltRounds,function(err, hashedPassword) {
//             if (err) {
//                 next(err);
//             }
//             else {
//                 document.password = hashedPassword;
//                 next();
//             }
//         });
//     } else {
//         next();
//     }
// });

UserSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

UserSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email} ).exec()
    console.log(user);
    if (!user) {
        console.log('here');
        // throw new Error({ error: 'Invalid login credentials' })
        throw 'Invalid login credentials'
        // throw new Error('I\'m Evil')
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        console.log('wrong password');
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
