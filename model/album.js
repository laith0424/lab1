const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
    ID: {
        type: Number,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    artist:{
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model("album", albumSchema);