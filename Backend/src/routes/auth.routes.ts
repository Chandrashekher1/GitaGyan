import bcrypt from 'bcrypt'
import { Users } from '../models/User.model.js'
import Joi from 'joi'
import express from 'express'
import * as dotenv from "dotenv"
dotenv.config()


const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error) return res.status(400).json({ message: error.message })

        let user = await Users.findOne({ email: req.body.email })
        if (!user) return res.status(400).json({ message: "User is not registered" });

        if (!user.password) return res.status(400).json({ message: "This account uses Google login. Please sign in with Google." });

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).json({ message: "Invalid Password" });

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
    } catch (err: any) {
        console.error("Login error", err)
        res.status(500).json({ success: false, message: "Internal server error ", error: err.message })
    }
})


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "https://gitagyan-hackathon-1.onrender.com/api/login/auth/google/callback"
const FRONTEND_URL = process.env.FRONTEND_URL || "https://gita-gyan-rust.vercel.app"

router.get('/auth/google', (req, res) => {
    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    })
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
})

router.get('/auth/google/callback', async (req, res) => {
    try {
        const code = req.query.code as string
        if (!code) {
            return res.redirect(`${FRONTEND_URL}/login?error=missing_code`)
        }
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
            }),
        })
        const tokenData = await tokenResponse.json() as { access_token?: string; error?: string }
        if (tokenData.error || !tokenData.access_token) {
            console.error("Google token error:", tokenData)
            return res.redirect(`${FRONTEND_URL}/login?error=token_exchange_failed`)
        }
        const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })
        const profile = await profileResponse.json() as {
            id: string; email: string; name: string; picture?: string
        }
        let user = await Users.findOne({ googleId: profile.id })
        if (!user) {
            user = await Users.findOne({ email: profile.email })
            if (user) {
                user.googleId = profile.id
                await user.save()
            } else {
                user = await Users.create({
                    name: profile.name,
                    email: profile.email,
                    googleId: profile.id,
                })
            }
        }
        //@ts-ignore
        const token = user.generateAuthToken()
        res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&uid=${user._id}`)
    } catch (err: any) {
        console.error("Google OAuth error:", err)
        res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`)
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