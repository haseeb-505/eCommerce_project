import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

// cors middleware
app.use( cors({
    origin: process.env.CORS_ORGING,
    credentials: true
}));

// data handling
app.use(express.json({limit: "16Kb"}));

// url encoder
app.use(express.urlencoded({extended: true, limit: "16Kb"}));

// static folder
app.use(express.static("public"));

// cookierParser
app.use(cookieParser());

// routes import
import userRoutes from "./routes/user.routes.js";


// routes path declaration
app.use("/api/v1/users", userRoutes);

// Default route for testing
app.get("/", (req, res) => {
    res.send("<h1>API is running successfully 🚀</h1>");
});

export { app };