const express = require('express')
const router = express.Router()
const Job = require('../../models/job')

router.post('/create', async (req, res, next) => {
    try{
        const {name, logo, position, salary, jobType, remote, description, about, skills, info} = req.body
        const skillsArray = skills.split(',').map(skill => skill.trim());
        const user = req.user
        const userId  = user._id
        const newJob = new Job({
            name, logo, position, salary, jobType, remote, description, about, skills: skillsArray, info, userId
        })
        await newJob.save()
        res.status(200).json("Job Created")
    }
    catch(err) {
        next(err)
    }
})

router.delete('/delete/:id', async (req, res, next) => {
    try{
        const {id} = req.params
        const userId = req.user._id
        const defaultJob = Job.findById(id)
        if(!defaultJob.userId.toString() != userId.toString()) {
            return res.status(403).send("Access Denied")
        }
        if(!id) {
            res.status(403).send("Wrong Request")
        }
        await Job.findByIdAndDelete(id)
        res.status(200).send('Job Deleted')
    }
    catch(err) {
        next(err)
    }
})

router.get('/get/:id', async (req, res, next) => {
    try{
        const {id} = req.params
        if(!id) {
            res.status(403).send("Wrong Request")
        }
        const job = await Job.findById(id)
        res.status(200).json(job)
    }
    catch(err) {
        next(err)
    }
})

router.get('/all', async (req, res, next) => {
    try{
        const jobs = await Job.find().select('name logo position skills')
        res.status(200).json(jobs)
    }
    catch(err) {
        next(err)
    }
})

router.patch('/update/:id', async (req, res, next) => {
    try{
        const {id} = req.params
        if(!id) {
            return res.status(403).send('Wrong Request')
        }
        const {name, logo, position, salary, jobType, remote, description, about, skills, info} = req.body
        const defaultJob = await Job.findById(id)
        const user = req.user
        const userId = user._id
        if(!defaultJob.userId.toString() != userId.toString()) {
            return res.status(403).send("Access Denied")
        }
        const skillsArray = skills?.split(',').map(skill => skill.trim()) || defaultJob.skills;
        // If skills is undefined if not provided
        const job = await Job.findByIdAndUpdate(id, {
            name: name || defaultJob.name, 
            logo: logo || defaultJob.logo, 
            position: position || defaultJob.position, 
            salary: salary || defaultJob.salary, 
            jobType: jobType || defaultJob.jobType, 
            remote: remote || defaultJob.remote, 
            description: description || defaultJob.description, 
            about: about || defaultJob.about, 
            skills: skillsArray, 
            info: info || defaultJob.info,
            userId 
        })
        res.status(200).send('Job Updated')
    }
    catch(err) {
        next(err)
    }
})

router.get('/filter/:skills', async (req, res, next) => {
    try{
        const skills = req.params.skills
        if(!skills) {
            return res.status(403).send("Wrong Request")
        }
        const skillsArray = skills.split(',').map(skill => skill.trim())
        const jobs = await Job.find({skills: {$in: skillsArray}}).select('name logo position')
        res.status(200).json(jobs)
    }
    catch(err) {
        next(err)
    }
})

router.get('/search/:query', async (req, res,next) => {
    try{
        const query = req.params.query
        const job = await Job.find({
            $or: [
                {name: {$regex: query, $options: 'i'}}, 
                //options - Case insensitive
                {position: {$regex: query, $options: 'i'}},
                {jobType: {$regex: query, $options: 'i'}},
                {description: {$regex: query, $options: 'i'}}
            ]
        }).select('name logo position')
        res.status(200).json(job)
    }
    catch(err) {
        next(err)
    }
})

module.exports = router