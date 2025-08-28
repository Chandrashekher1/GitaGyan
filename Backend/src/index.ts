import db from "./config/db.mogo.js"
import express from "express"
import startup from "./startup/route.js"
import * as dotenv from "dotenv"
import cors from "cors"

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
const port = 3000
app.listen(port, () => {
    console.log(`listening on pot: ${port}`);
    
})