var express = require('express');
const memeModel = require("../models/meme");
var router = express.Router();

router.get("/get-meme", async function (req, res, next) {
    console.log('Get specific meme by identifier (SingleViewUrl)');

    if (req.query.url) {
        const single_view_url = req.query.url;
        console.log('Meme url: ', single_view_url);

        memeModel.find({url: single_view_url.toString()})
            .then((data) => {
                console.log(`Meme having url=${single_view_url}: ${data}`);
                const jsonObj = {
                    "success": true,
                    "data": data,
                }
                res.send(jsonObj);
            })
            .catch((error) => {
                res.status(500).send(error);
            });
    } else {
        const jsonObj = {'success': false, 'error_message': 'Please enter something as value for parameter url.'};
        res.send(jsonObj);
    }
});

module.exports = router;