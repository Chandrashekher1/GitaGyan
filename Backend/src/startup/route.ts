import express from "express"
import user from "../routes/user.routes.js"
import auth from "../routes/auth.routes.js"
import chat from "../routes/chat.routes.js"
import googleTTS from "../routes/google.tts.js"
import yogaRoutes from "../routes/yoga.routes.js"
import aiRoutes from "../routes/ai.routes.js"

import { Application } from "express"

export default function(app: Application) {
    app.use(express.json({ limit: "10mb" }))
    app.use(express.urlencoded({ extended: true, limit: "10mb" }))
    app.use('/api/user', user)
    app.use('/api/login', auth)
    app.use('/api/chat', chat)
    app.use('/api/google-tts', googleTTS)
    app.use('/api/yoga', yogaRoutes)
    app.use('/api/ai', aiRoutes)

}
