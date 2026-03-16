import express from "express";
import { embedding } from "../models/Embedding.model.js";
const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const { query, language } = req.body;
        const context = await embedding({ query, language });
        res.json({ context });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=chat.routes.js.map