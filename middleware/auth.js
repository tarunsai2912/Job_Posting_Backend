const User = require('../models/user')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// authentication middleware

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("auth-token");
        if (token) {  // if token exists in header
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            if (verified) {
                const user = await User.findOne({ _id: verified._id });  // does this token belong to a user
                if (user) {
                    req.user = user;
                    next();
                }
                else {
                    res.status(401).send("Access Denied");
                }
            }
            else {
                res.status(401).send("Access Denied");

            }
        }
        else {      // if token does not exist in header
            res.status(401).send("Access Denied");
        }
    }
    catch (err) {
        next(err);
    }

}


module.exports = authMiddleware;