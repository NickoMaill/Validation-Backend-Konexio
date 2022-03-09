const express = require("express");
const app = express();
const fs = require("fs");
const Joi = require('joi');
const schema = Joi.object({
    username: Joi.string().required().min(4),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    age: Joi.number().valid(2),
    city: Joi.string()
});

const users = require('./data/users.json');

function formError() {
	return res.status(400).json({
        message: "oups :("
    });
}

app.use(express.json());

app.use(function debug(_req, _res, next) {
    console.log('request received');
    next();
});

app.get("/", (_req, res) => {
    res.json(users)
});

app.post("/users",formError, (req, res) => {
    const newUser = req.body;

    fs.readFile('./data/users.json', 'utf-8', (err, jsonString) => {
        if (err) throw err

        const data = JSON.parse(jsonString);
        data.push(newUser)

        fs.writeFile('./data/users.json', JSON.stringify(data, null, 2), 'utf-8', err => {
            if (err) throw err
            res.send("user ajouté")
        })
    })
})


