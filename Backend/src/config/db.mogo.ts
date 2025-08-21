import mongoose from "mongoose"
import * as dotenv from "dotenv"
dotenv.config()

const db = mongoose.connect(process.env.MONGODB_URI!)
    .then(() => console.log("MongoDB connected..."))
    .catch((err: any) => console.log(err.message))

export default db