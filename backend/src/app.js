import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

// cors middleware
app.use(cors({
    origin:  "http://localhost:5173",
    credentials: true,
}));

// data handling
app.use(express.json({limit: "16Kb"}));

// url encoder
app.use(express.urlencoded({extended: true, limit: "16Kb"}));

// static folder
app.use(express.static("public"));

// cookierParser
app.use(cookieParser());

export { app };