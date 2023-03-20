import express from "express";
import mongoose from "mongoose";
import { APP_PORT, DB_URL } from "./config"
import errorHandler from "./middlewares/errorHandler";
import path from 'path';

const app = express();
import router from "./routes/routes";

// DB connection
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
    console.log("Database is connected")
});

// Here gets current folder path
global.appRoot = path.resolve(__dirname)

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use("/api", router)
app.use("/uploads", express.static("uploads"))

// This is a middleware hence last me write karte hai 
app.use(errorHandler)

const start = async () => {
    try {
        app.listen(APP_PORT, () => {
            console.log(`Listening on port ${APP_PORT} `);
        })
    } catch (error) {
        console.log(error);
    }
};
start();
