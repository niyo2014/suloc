import express from 'express';
import { generateVerificationCode, getCorridorAdvice } from '../services/businessLogic.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generate a code for a new request (Public/Internal)
router.get('/generate-code', (req, res) => {
    const code = generateVerificationCode();
    res.json({ code });
});

// Corridor Advice (Public)
router.post('/corridor-advice', (req, res) => {
    const { destination } = req.body;
    if (!destination) return res.status(400).json({ error: 'Destination required' });

    const advice = getCorridorAdvice(destination);
    res.json(advice);
});

export default router;
