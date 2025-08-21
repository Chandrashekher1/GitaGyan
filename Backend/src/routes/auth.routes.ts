import bcrypt from 'bcrypt'
import { Users } from '../models/User.model.js'
import Joi from 'joi'
import express from 'express'

const router = express.Router()

router.post('/', async (req, res) => {
    try{
        const {error} = validate(req.body)
        if(error) return res.status(400).json({ message: error.message })

        let user = await Users.findOne({email: req.body.email})
        if(!user) return res.status(400).json({ message: "User is not registered" });

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword) return res.status(400).json({ message: "Invalid Password" });
        
        //@ts-ignore
        const token = user.generateAuthToken()
        res.header('Authorization', token).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch(err:any){
        console.error("Login error",err)
        res.status(500).json({success: false, message: "Internal server error ", error: err.message})
    }
})

function validate(user: any) {
    const Schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
   return Schema.validate(user);
}

export default router