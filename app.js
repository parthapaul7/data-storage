const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();


const MONGO_DB_URL = process.env.DB_URL;

const app = express();

mongoose
    .connect(MONGO_DB_URL)
    .then(result => {
        console.log("Connected to DB");

        const port = process.env.PORT || 3000;
        app.listen(port, "0.0.0.0", () =>
            console.log("Express app listening on port " + port)
        );
    })
    .catch(err => {
        console.log("Not connected to db: " + err);
    });



// Parse incoming requests

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// use cors
app.use(cors());

// Router module
const homeRouter = require("./routes/home");

// // Routes
app.use("/", homeRouter);

// Catch 404 and forward to error handler