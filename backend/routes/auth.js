import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({ googleId });
        if (!user) {
            user = new User({
                googleId,
                email,
                name,
                picture
            });
            await user.save();
        } else {
            // Update picture/name if changed
            user.name = name;
            user.picture = picture;
            await user.save();
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            }
        });
    } catch (err) {
        console.error("Error verifying Google ID token:", err);
        res.status(401).json({ error: "Invalid credentials" });
    }
});

export default router;
