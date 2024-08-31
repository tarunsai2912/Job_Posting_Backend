const express = require('express')
const router = express.Router()
const Job = require('../../models/job')
const User = require('../../models/user')
const authMiddleware = require('../../middleware/auth')
const jobController = require('../../controllers/jobController')

router.post('/create', authMiddleware, jobController.addJob)

router.delete('/delete/:jobid', authMiddleware, async (req, res, next) => {
    try{
        const {jobid} = req.params

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(401).json({msg: 'User Not Found'})
        }

        const job = await Job.findById(jobid)
        if(!job){
            return res.status(401).json({msg: 'Job Not Found'})
        }

        if(req.user_Id.toString() !== job.userId.toString()){
            return res.status(401).json({msg: 'Authentication Error'})
        }
        
        await Job.findByIdAndDelete(jobid)

        await User.updateMany(
            { jobId: jobid },
            { $pull: { jobId: jobid } }
        )

        return res.status(200).json({msg: 'Job Deleted'})
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
        if(!job){
            return res.status(401).json({msg: 'Job Not Found'})
        }

        const timeAgo = (date) => {
            const now = new Date();
            const past = date;
            const diffInSeconds = Math.floor((now - past) / 1000);
          
            const secondsInMinute = 60;
            const secondsInHour = 60 * secondsInMinute;
            const secondsInDay = 24 * secondsInHour;
            const secondsInWeek = 7 * secondsInDay;
          
            if (diffInSeconds >= secondsInWeek) {
                const weeks = Math.floor(diffInSeconds / secondsInWeek);
                return `${weeks}w ago`;
            } 
            else if (diffInSeconds >= secondsInDay) {
                const days = Math.floor(diffInSeconds / secondsInDay);
                return `${days}d ago`;
            } 
            else if (diffInSeconds >= secondsInHour) {
                const hours = Math.floor(diffInSeconds / secondsInHour);
                return `${hours}h ago`;
            } 
            else if (diffInSeconds >= secondsInMinute) {
                const minutes = Math.floor(diffInSeconds / secondsInMinute);
                return `${minutes}m ago`;
            } 
            else {
                return `${diffInSeconds}s ago`;
            }
        }

        const jobCreatedAt = timeAgo(job.createdAt)

        return res.status(200).json({job, jobCreatedAt})
    }
    catch(err) {
        next(err)
    }
})

router.get('/all', async (req, res, next) => {
    try{
        const jobs = await Job.find().select('name logo position salary location skills remote jobType userId')
        return res.status(200).json({jobs})
    }
    catch(err) {
        next(err)
    }
})

router.put('/update/:id', authMiddleware, jobController.updateJob)

module.exports = router