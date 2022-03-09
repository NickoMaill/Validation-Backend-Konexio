const express = require("express");
const app = express();
const users = require('./data/users.json');
const userRouter = require('./routes/userRouter')

app.use(express.json());

app.use(function debug(_req, _res, next) {
    console.log('request received');
    next();
});

app.use("/users", userRouter);

app.listen(8000, () => {
    console.log("Listening on port 8000");
});


