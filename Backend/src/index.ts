import db from "./config/db.mogo.js"
import express from "express"
import startup from "./startup/route.js"
import * as dotenv from "dotenv"
import cors from "cors"
import { connectToDatabase } from "./config/db.astra.js"

dotenv.config()
const app = express()

// CORS middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://localhost:5173",
            "https://gitagyan-frontend.vercel.app",
            "https://gitagyan-frontend-4hcpxxnvb-tanishq-sethis-projects.vercel.app"
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    credentials: true
}))

startup(app)

// mongoDB connection   
db
//astraDB connection
connectToDatabase()

app.get("/timer", (req,res) => {
    const currentTime = new Date().toISOString();
    res.json({ time: currentTime , message: "Server is running fine!"});
})

app.listen(process.env.PORT, () => {
    console.log(`listening on port: ${process.env.PORT}`);
})