const mongoose = require('mongoose');

const MemeSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        url: {type: String, required: true},
        date: {type: Date, required: true},
        author: {type: String}
    },
    {
        // Define the collection name stored in MongoDB Compass
        collection: "memes",
    }
);

mongoose.model("MemeInfo", MemeSchema);