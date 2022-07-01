const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    phoneNumber: {
        type: Number,
        default: 0,
        minlength: 11,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
    {
    timestamps: true
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    
    return userObject
}

userSchema.statics.findByCredentials = async (phoneNumber, password) => {
    const user = await User.findOne({ phoneNumber }) //.populate('department faculty')

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id : user._id.toString()}, process.env.JWT_SECRET)
    
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User