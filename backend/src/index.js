import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";


// dotenv config
dotenv.config(
    {
        path: './env'
    }
);



connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000), () => {
            console.log(`server is running on port ${process.env.port}`)
        }
    })
    .catch((err) => {
        console.log("MongoDB connection error: ", err);
    })
;



