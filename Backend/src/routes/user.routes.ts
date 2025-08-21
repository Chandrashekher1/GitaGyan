import bcrypt from 'bcrypt'
import { Users, Validate as validate } from '../models/User.model.js'
import express from 'express'
import auth from '../middleware/auth.middleware.js'
const router = express.Router()


//@ts-ignore
router.get('/me',[auth], async (req,res) => {
    try {
        const user = await Users.findById(req.user._id).select('-password');
        res.status(200).json({ success: true, data: user });
    } catch (err:any) {
        res.status(500).json({ success: false, message: "Failed to fetch profile", error: err.message });
    }
})

router.post('/', async (req,res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).json({ success: false, message: error.message });

        let user = await Users.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ success: false, message: "User already exists" });

            user = new Users({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user = await user.save();
        //@ts-ignore
        const token = user.generateAuthToken();

        res.status(201)
        .header('Authorization',token)
        .json({
        success: true,
        message: "User registered successfully",
        token,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
        });
    } catch (err:any) {
        res.status(500).json({ success: false, message: "Registration failed", error: err.message });
    }
})

router.put('/:id', auth, async(req,res) => {
    try{
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            {
                name : req.body.name,
                email: req.body.email,
            },
            {new : true}
        ).select('-password')
        if(!user) return res.status(404).json({message: "User not found"})
        res.send(user)
    }
    catch(error:any) {
        res.status(500).json({message: "Internal error",error: error.message})
    }
})

router.patch('/:id', auth, async(req,res) => {
    try{
        const user = await Users.findByIdAndUpdate(
            req.params.id,
            {
                name : req.body.name,
                email: req.body.email,
            },
            {new : true}
        ).select('-password')
        if(!user) return res.status(404).json({message: "User not found"})
        res.send(user)
    }
    catch(error:any) {
        res.status(500).json({message: "Internal error", error: error.message})
    }
})

export default router