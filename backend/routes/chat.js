import express from 'express'
import Thread from '../models/Thread.js';
import getGeminiResponse from '../utils/gemini.js';

const router = express.Router();

router.post("/test", async(req, res)=>{
    try{
        const thread = new Thread({
            threadId: "123",
            title: "testing the new Thread "
        });
        const response = await thread.save();
        res.send(response);
    }catch(err){
        console.log("error occur", err);
        res.status(500).json({error: "failed to save in DB"});
    }
});

router.get("/thread", async(req,res)=>{
    try{
        const threads = await Thread.find({}).sort({updated: -1});
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "failed to fetch threads"});
    }
})

router.get("/thread/:threadId", async(req, res)=>{
    const {threadId} = req.params;

    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            return res.status(404).json({error: "threads not found"});
        }
        res.json(thread.message);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "failed to fetch threads"});
    }
})

router.delete("/thread/:threadId", async(req,res)=>{
    const {threadId} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            res.status(404).json({error: "threadnot found"});
        }
        res.status(200).json({success: "thread delted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "failed to delete thread"});
    }
})

router.post("/chat", async(req, res)=>{
    const  {threadId, message} = req.body;

    if(!threadId || !message){
        return res.status(400).json({error: "missing required fileds"});
    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            thread = new Thread({
                threadId,
                title: message,
                message: [{role: "user", content: message}]
            })
        }else{
            thread.message.push({role: "user", content: message});
        }
        const assistantReply = await getGeminiResponse(message);
        thread.message.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply: assistantReply});
    }catch(err){
        console.error("Chat endpoint error:", err.message);
        res.status(500).json({error: err.message || "something went wrong"});
    }
})
export default router;