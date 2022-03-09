const express = require("express");
const app = express();
const fs = require("fs");
const Joi = require('joi');
const schema = Joi.object({
    id: Joi.number(),
    username: Joi.string().required().min(4),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    age: Joi.number(),
    city: Joi.string()
    
});

const users = require('./data/users.json');

// function formError() {
//     return res.status(400).json({
//         message: "oups :("
//     });
// }

app.use(express.json());

app.use(function debug(_req, _res, next) {
    console.log('request received');
    next();
});

app.get("/", (_req, res) => {
    res.json(users);
});

app.post("/users", (req, res) => {
    const newUser = req.body;
    const validResult = schema.validate(newUser);

    if (validResult.error) {
        return res.status(400).json({
            message: validResult.error,
        });
    } else {
        fs.readFile('./data/users.json', 'utf-8', (err, jsonString) => {
            if (err) throw err

            const data = JSON.parse(jsonString);
            data.push(newUser);

            fs.writeFile('./data/users.json', JSON.stringify(data, null, 2), 'utf-8', err => {
                if (err) throw err
                res.send("user ajouté");
            })
        })
    }

})

app.listen(8000, () => {
    console.log("Listening on port 8000");
});


