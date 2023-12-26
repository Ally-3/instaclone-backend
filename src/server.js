require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const User = require("../src/models/usermodel");
const userRouter = require("../src/routes/userroutes");

function syncTables() {
    User.sync({ alter : true })
}

const port = process.env.PORT || 5002

app.use(cors());
app.use(express.json());
app.use(userRouter);

app.get("/health", (req, res) => {
    res.status(200).json({message: "API is running"})
})

app.listen (port, () => {
    console.log(`app is listening on ${port}`);
    syncTables();
})