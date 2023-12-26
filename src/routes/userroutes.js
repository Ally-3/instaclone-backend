const express = require("express");
const userRouter = express.Router();

const { hashPassword, comparePassword } = require("../middleware/index");
const { register, login, listAllUsers } = require("../controllers/usercontroller");

//LOGIN/REGISTER
userRouter.post("/registerUser", hashPassword, register);
userRouter.post("/loginUser", comparePassword, login);

//READ USERS - lists all users
userRouter.get("/listAllUsers", listAllUsers);

//EXPORTS:
module.exports = userRouter;