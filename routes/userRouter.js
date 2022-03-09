const express = require('express');
const router = express.Router();
const fs = require("fs")
const users = require('../data/users.json');
const Joi = require('joi');

const schema = Joi.object({
    id: Joi.number(),
    username: Joi.string().required().min(4),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    age: Joi.number().min(18),
    city: Joi.string()
});

router.get('/', function(req, res) {
    res.json(users);
});

router.post("/", (req, res) => {
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

            if (data.indexOf(res.body) > -1) {

                res.send("user déjà rentré")

            } else {

                fs.writeFile('./data/users.json', JSON.stringify(data, null, 2), 'utf-8', err => {
                    if (err) throw err
                    res.send("user ajouté");
                })

            }

        })

    }


})

module.exports = router;