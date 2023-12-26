const express = require("express");
const userRouter = express.Router();

const { hashPassword, comparePassword, tokenCheck } = require("../middleware/index");
const { register, login, listAllUsers, booksLinkedToUser } = require("../controllers/usercontroller");

//LOGIN/REGISTER
userRouter.post("/registerUser", hashPassword, register);
userRouter.post("/loginUser", comparePassword, login);

//READ USERS - lists all users
userRouter.get("/listAllUsers", listAllUsers);

//USERS LINKED TO BOOKS
userRouter.get("/booksLinkedToUser", tokenCheck, booksLinkedToUser);

//EXPORTS:
module.exports = userRouter;