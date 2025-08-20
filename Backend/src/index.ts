import express from "express"
import { connectToDatabase } from "./astraDB/connection.js"
const app = express()
const database = connectToDatabase()

database




app.listen(3000, () => {
    console.log("listening on Port 3000");
})
