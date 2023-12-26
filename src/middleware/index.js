const bcrypt = require("bcrypt");
const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

async function hashPassword(req, res, next) {
    try {
        if (!req.body.password) {
            res.status(500).json({
                message : "password missing"
            })
            return;
        }
        req.body.password = await bcrypt.hash(req.body.password, saltRounds)
        next();
       
    } catch (error) {
        res.status(500).json({
            errormessage : error.message
        })
        console.log(error)
    }
}

//FUNCTION TO COMPARE THE PASSWORD
async function comparePassword(req, res, next) {
    try {
        //email from request to find the user details from the db
        const user = await User.findOne({
            where : {
                email : req.body.email
            }
        })
        // if not on db
        if (!user) {
            res.status(500).json({
                message : "username or password do not match"
            })
            return;
        }
        // if on db, compare password
        const response = await bcrypt.compare(req.body.password, user.password);
            if (!response) {
                res.status(500).json({
                    message : "username or password do not match"
                })
                return;
            }
        // if password matches:
            req.user = user;
            next();

    } catch (error) {
        res.status(500).json({
            errormessage : error.message
        })
        console.log(error)
    }
}

// FUNCTION TO CHECK TOKEN
// 'const token' requires token to be added to authorization
// '.replace' removes bearer from the start of the line
// compares email with token and secretKey
async function tokenCheck(req, res, next) {
    try {
        const secretKey = process.env.JWTPASSWORD; 
        const token = req.header("Authorization").replace("Bearer ", " "); 
        const decodedToken = jwt.verify(token, secretKey);
        console.log(decodedToken);

        const emailID = decodedToken.email; 

        if (!emailID) {
            throw new Error("unable to add book/view books to user"); 
        } else {
            req.body.email = emailID;
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            errorMessage: error.message
        });
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    tokenCheck
}