const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

router.post('/register', async (req, res) => {
    const {name, email, mobile, password} = req.body
    const user = await User.findOne({email})
    if(user) {
        return res.status(400).json({msg: 'User already exists'})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
        name,
        email,
        mobile,
        password: hashedPassword
    })
    await newUser.save()
    res.status(200).json(newUser)

})

router.post('/login', async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user) {
            res.status(400).json({msg: 'Wrong email or password'})
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) {
            res.status(400).json({msg: 'Wrong email or password'})
        }
        else {
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
            res.header("auth-token", token).json({msg: 'Logged in Successfully'})
        }
    } catch(err) {
        next(err)
    }
})

module.exports = router