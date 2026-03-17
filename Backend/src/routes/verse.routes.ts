import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/:chapter', async (req, res) => {
    const { chapter } = req.params;
    const url = `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapter}/verses/`;
    
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'bhagavad-gita3.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                success: false, 
                message: "Failed to fetch verses from RapidAPI", 
                error: errorText 
            });
        }

        const data = await response.json();
        res.status(200).json({ success: true, data });
    } catch (err: any) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
});

router.get('/:chapter/:verse', async (req, res) => {
    const { chapter, verse } = req.params;
    const url = `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapter}/verses/${verse}/`;
    
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'bhagavad-gita3.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ 
                success: false, 
                message: "Failed to fetch verse from RapidAPI", 
                error: errorText 
            });
        }

        const data = await response.json();
        res.status(200).json({ success: true, data });
    } catch (err: any) {
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
});

export default router;
