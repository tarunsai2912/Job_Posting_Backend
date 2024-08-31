const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const app = express()
dotenv.config()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth/index')
const fs = require('fs') // File system library
const jobRoutes = require('./routes/jobs')
const cors = require('cors')

app.use(cors())

// Log every incoming request
app.use((req, res, next) => {
    const log = `${req.method} - ${req.url} - ${req.ip} - ${new Date()}`
    fs.appendFile('log.txt', log, (err) => {
        if(err){
            console.log(err);
        }
    })
    next()
})

app.use(bodyParser.json())
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Error handling middleware
app.use((err, req, res, next) => {
    let log = err.stack
    log += `/n${req.method} - ${req.url} - ${req.ip} - ${new Date()}`
    fs.appendFile('error.txt', log, (err) => {
        if(err){
            console.log(err);
        }
    })
    res.status(500).send("Something went wrong")
})

mongoose.connect('mongodb+srv://tarunsairayapureddi:ZTE9w3efKXVemSqF@fullstack-capstone.mwfxzq1.mongodb.net/?retryWrites=true&w=majority&appName=FullStack-capstone')

mongoose.connection.on('connected', () => {
    console.log('MongoDb is connected...');
})

app.listen(port, () => {
    console.log(`Server is running on ${port} port number`);
}) 