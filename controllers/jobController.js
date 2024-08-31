const User = require('../models/user')
const Job = require('../models/job')

const addJob = async (req, res, next) => {
    try{
        const {name, logo, position, salary, jobType, remote, location, description, about, skills, info} = req.body
        // const skillsArray = skills.split(',').map(skill => skill.trim());

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(401).json({message: 'User Not Found'})
        }

        const job = new Job({
            name, logo, position, salary, jobType, remote, location, description, about, skills, info, createdAt: Date.now(), userId: req.user_Id
        })
        const newJob = await job.save()
        const job_id = newJob._id

        user.jobId.push(newJob)
        await user.save()

        return res.status(200).json({msg: "Job Created", job_id})
    }
    catch(err) {
        next(err)
    }
}

const updateJob = async (req, res, next) => {
    try{
        const {id} = req.params
        if(!id) {
            return res.status(403).send('Wrong Request')
        }
        const {name, logo, position, salary, jobType, remote, location, description, about, skills, info} = req.body

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(401).json({message: 'User Not Found'})
        }

        const defaultJob = await Job.findById(id)

        if(req.user_Id.toString() !== defaultJob.userId.toString()){
            return res.status(401).json({message: 'Authentication Error'})
        }
        
        const skillsArray = skills || defaultJob.skills

        const updatedJob = await Job.findByIdAndUpdate(id, {
            name: name || defaultJob.name, 
            logo: logo || defaultJob.logo, 
            position: position || defaultJob.position, 
            salary: salary || defaultJob.salary, 
            jobType: jobType || defaultJob.jobType, 
            remote: remote || defaultJob.remote,  
            location: location || defaultJob.location, 
            description: description || defaultJob.description, 
            about: about || defaultJob.about, 
            skills: skillsArray, 
            info: info || defaultJob.info,
        }, { new: true })

        await updatedJob.save();
        return res.status(200).send({msg: 'Job Updated', updatedJob})
    }
    catch(err) {
        next(err)
    }
}

module.exports = {addJob, updateJob}