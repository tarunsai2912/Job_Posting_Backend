const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

router.post('/register', async (req, res, next) => {
    try{
        const {name, email, mobile, password} = req.body
        const user = await User.findOne({email})
        if(user) {
            return res.status(400).json({msg: 'User already exists'})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            name, email, mobile, password: hashedPassword
        })
        await newUser.save()
        return res.status(200).json(newUser)
    }
    catch(err){
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({msg: 'Wrong email or password'})
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) {
            return res.status(400).json({msg: 'Wrong email or password'})
        }
        const user_Id = user._id 
        const token = jwt.sign({user_Id: user._id}, process.env.JWT_SECRET)
        return res.status(200).json({msg: 'User Got LoggedIn', token, user_Id});
    } 
    catch(err) {
        next(err)
    }
})

module.exports = router