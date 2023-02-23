/**
 * References:
 * JWT generator:
 * https://jwt.io/
 * */

var express = require('express');
var router = express.Router();
require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const notifier = require("node-notifier");
const jwt = require("jsonwebtoken");
const commentModel = require("../models/comment");
const User = mongoose.model("UserInfo");
// Expiration time: Thu June 01 2023 00:00:00 GMT+2 (Central European Summer Time)
const JWT_SECRET =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWVtZSBnZW5lcmF0b3IiLCJpYXQiOjE2ODU1NzA0MDB9.fkz2BwlltKHTWAg-QfO_UdB0fTBvT1f0Z3gbL_zJ2fE";

/* GET users listing. */
router.get('/', function (req, res, next) {
    const db = req.db;
    const users = db.get('users');
    users.find({username: req.username}, {projection: {basicauthtoken: 0}}) // return all user properties, except the basic auth token
        .then((docs) => res.json(docs))
        .catch((e) => res.status(500).send())
});

// register part
router.post("/register", async (req, res) => {
    const {username, password} = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        const oldUser = await User.findOne({username});

        if (oldUser) {
            return res.json({error: "User already exists"});
        }

        await User.create({
            username,
            password: encryptedPassword,
        });
        res.send({status: "ok"});
    } catch (error) {
        res.send({status: "error"});
    }
});

// login part
router.post("/login-user", async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if (!user) {
        return res.json({status: "error", error: "User not found"});
    }
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({username: user.username}, JWT_SECRET);

        if (res.status(201)) {
            return res.json({status: "ok", data: token});
        } else {
            return res.json({error: "error"});
        }
    }

    res.json({status: "error", error: "Invalid password"});
});

router.get("/get-comments-for-someone", async function (req, res, next) {
    console.log('Get comments for someone');
    if (req.query.username) {
        const param = req.query.username;
        console.log('Query username: ', param);

        commentModel.find({from: param.toString()}).sort({date: -1})
            .then((data) => {
                console.log(`Comments by someone from=${param}: ${data}`);
                res.send(data);
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    }
});

module.exports = router;
