import express from 'express'
import Thread from '../models/Thread.js';
import getGeminiResponse from '../utils/gemini.js';

const router = express.Router();

router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "123",
            title: "testing the new Thread "
        });
        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log("error occur", err);
        res.status(500).json({ error: "failed to save in DB" });
    }
});

router.get("/thread", async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "User ID required" });

    try {
        const threads = await Thread.find({ userId }).sort({ updated: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch threads" });
    }
})

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    const { userId } = req.query;

    try {
        const thread = await Thread.findOne({ threadId, userId });
        if (!thread) {
            return res.status(404).json({ error: "threads not found" });
        }
        res.json(thread.message);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch threads" });
    }
})

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    const userId = req.query.userId || req.body.userId;

    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, userId });
        if (!deletedThread) {
            res.status(404).json({ error: "threadnot found" });
        }
        res.status(200).json({ success: "thread delted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to delete thread" });
    }
})

router.post("/chat", async (req, res) => {
    const { threadId, message, userId } = req.body;

    if (!threadId || !message || !userId) {
        return res.status(400).json({ error: "missing required fileds" });
    }

    try {
        let thread = await Thread.findOne({ threadId, userId });
        if (!thread) {
            thread = new Thread({
                userId,
                threadId,
                title: message,
                message: [{ role: "user", content: message }]
            })
        } else {
            thread.message.push({ role: "user", content: message });
        }

        const assistantReply = await getGeminiResponse(thread.message);

        thread.message.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();
        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        console.error("Chat endpoint error:", err.message);
        res.status(500).json({ error: err.message || "something went wrong" });
    }
})
export default router;