/**
 * References:
 * help from Xueru Zheng, Group 070
 * https://www.bezkoder.com/node-js-upload-store-images-mongodb/
 * https://stackoverflow.com/questions/54979632/get-formdata-values-on-backend-side
 *
 * Query:
 * https://codesandbox.io/s/requests-yctc5?file=/src/index.js
 * https://www.youtube.com/watch?v=-NBNF2yURm8
 *
 * */

var express = require("express");
var router = express.Router();
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/memes/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + ".jpg");
    },
});

const upload = multer({storage: storage});
const memeModel = require("../models/meme");

router.post("/upload-meme", upload.single("file"), async (req, res) => {
    console.log(req.file);
    console.log('form data: ', req.body);

    const meme = new memeModel({
        title: req.body.title,
        url: req.body.url,
        img: `http://localhost:3002/memes/${req.file.filename}`,
        date: Date.now(),
        author: req.body.author,
        permission: req.body.permission
    });

    try {
        await meme.save();
        res.send({status: "ok"});
    } catch (error) {
        res.send({status: "error"});
    }
});

router.get("/get-memes", async function (req, res, next) {
    console.log('Get request for all memes');
    if (req.query.username) {
        const param = req.query.username;
        console.log('Param', param);

        memeModel.find({author: param.toString()})
            .then((data) => {
                console.log('Memes by param.toString(): ', data);
                res.send(data);
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    } else {
        memeModel.find()
            .then((data) => {
                console.log('All public memes: ', data);
                res.send(data);
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    }
});

router.get("/get-memes-by-someone", async function (req, res, next) {
    console.log('Get request for all memes by someone');
    const {username} = req.body;
    console.log(`req.body = ${username}`);

    memeModel.find({author: username})
        .then((data) => {
            console.log('Memes of someone: ', data);
            res.send(data);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

module.exports = router;
