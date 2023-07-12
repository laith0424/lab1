const express = require("express");
const mongoose = require("mongoose");
const api = require("./routes/routes.js");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config();
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true}, () =>{
    console.log("Connect to the DB is succseful!");
});
app.use(express.json());
app.use(express.static("public"));
app.use("/api", api);
app.listen(PORT, () => {
    console.log("Listening to the Port: " + PORT);
});