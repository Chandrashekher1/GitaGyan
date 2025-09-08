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
    origin: '*', 
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