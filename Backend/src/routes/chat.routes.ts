import express from "express"
import { embedding } from "../models/Embedding.model.js"
import auth from "../middleware/auth.middleware.js"

const router = express.Router()

router.post('/', [auth], async (req : any,res:any) => {
  try {
    const {query} = req.body
    const context = await embedding({query})
    res.json({context})
  } catch (error:any) {
    res.status(500).json({error:error.message})
  }
})  

export default router