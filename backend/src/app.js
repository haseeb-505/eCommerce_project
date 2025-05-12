import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

// cors middleware
app.use( cors({
    origin: "http://localhost:5173",
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
import authRoutes from "./routes/auth.routes.js"
// import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";


// routes path declaration
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

// Default route for testing
app.get("/", (req, res) => {
    console.log(`App is running on port:${process.env.PORT}\n http:localhost:${process.env.PORT}` )
    res.send("<h1>API is running successfully 🚀</h1>");
});

export { app };