const User = require("../models/usermodel");
const Book = require("../models/bookmodel");
const jwt = require("jsonwebtoken");

//REGISTER
//TOKEN ACQUIRED
async function register(req, res) {
    try {
        const UserResponse = await User.create(req.body);
        const expirationTime = 1000*60*60*24*7
        const privateKey = process.env.JWTPASSWORD
        const payload = {
            email : req.body.email
        };
        const options = {
            expiresIn : expirationTime
        };
        const token = await jwt.sign(payload, privateKey, options);
        console.log(token);

        res.status(201).json({
            message : "user successfully added",
            details : UserResponse, 
            token : token
        })

    } catch (error) {
        res.status(500).json({
            message : "unable to register user", 
            errorMessage: error
        })
        console.log(error);
    }
}

// LOGIN
async function login(req, res) {
    const expirationTime = 1000*60*60*24*7
    const privateKey = process.env.JWTPASSWORD
    const payload = {
        email : req.body.email
    };
    
    const options = {
        expiresIn : expirationTime
    };
    const token = await jwt.sign(payload, privateKey, options);
    console.log(token);
    try {
        res.status(201).json({
            message : "user logged in",
            user : req.body.email,
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message : "unable to login user", 
            errorMessage: error
        })
        console.log(error);
    }
}

// READ USERS - GET - list all users
async function listAllUsers (req, res){
    try {
        const listOfSUsers = await User.findAll();
        res.status(200).json(listOfSUsers);
    } catch (error) {
        res.status(501).json({ 
            message: error.message, 
            error: error
        })
    }
}

//GET - books linked to user, 
// (1) finds a user by email, then
// (2) retrieves all books associated with that user
async function booksLinkedToUser (req, res){
    try {
        const findUser = req.body.email;
        const user = await User.findOne({
            where: { email: findUser }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const books = await Book.findAll({
            where: { UserId: user.id }
        });
        
        res.status(200).json(books);
    
    } catch (error) {
        res.status(501).json({ 
            message: error.message, 
            error: error
        });
    }
}

//EXPORTS
module.exports = {
    register,
    login,
    listAllUsers,
    booksLinkedToUser
}