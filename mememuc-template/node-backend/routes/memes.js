/**
 * References:
 * help from Xueru Zheng, Group 070
 * https://www.bezkoder.com/node-js-upload-store-images-mongodb/
 * https://stackoverflow.com/questions/54979632/get-formdata-values-on-backend-side
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

router.get("/get-memes", async function (req, res, next) {
    const data = req.body;
    console.log(data);

    try {
       // await memeModel.find({});
        res.send({status: "ok"});
    } catch (error) {
        res.send({status: "error"});
    }
});

router.post("/upload-meme", upload.single("file"), async (req, res) => {
    console.log(req.file);
    console.log('form data: ', req.body);

    const meme = new memeModel({
        title: req.body.title,
        url: req.body.url,
        img: `http://localhost:3002/meme/${req.file.filename}`,
        date: Date.now(),
        permission: req.body.permission
    });

    try {
        await meme.save();
        res.send({status: "ok"});
    } catch (error) {
        res.send({status: "error"});
    }
});

router.get("/get-single-meme", async function (req, res, next) {
    console.log(typeof req.body);
    try {
        const memes = await memeModel.find({});
        res.status(200).send(memes);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
