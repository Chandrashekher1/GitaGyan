import express from "express";
import user from "../routes/user.routes.js";
import auth from "../routes/auth.routes.js";
import chat from "../routes/chat.routes.js";
import googleTTS from "../routes/google.tts.js";
import aiRoutes from "../routes/ai.routes.js";
export default function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/user', user);
    app.use('/api/login', auth);
    app.use('/api/chat', chat);
    app.use('/api/google-tts', googleTTS);
    app.use('/api/ai', aiRoutes);
}
//# sourceMappingURL=route.js.map