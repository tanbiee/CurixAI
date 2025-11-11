import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js'



const app = express();
const port = 3030;


app.use(express.json());
app.use(cors());

app.use("/api", chatRoutes);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.5-flash";

app.listen(port, ()=>{
    console.log(`the port is running on http://localhost:${port}`);
    connectDB();
})

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB);
        console.log("connected with the database");
    }
    catch(err){
        console.log("found the error",err);
    }
    
}



// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// app.post("/test", async(req,res)=>{
//     const userMessage = req.body.content || "tell me how many paws does a cat have";

//     const options ={
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "x-goog-api-key": GEMINI_API_KEY,
//         },
//         body: JSON.stringify({
//             contents: [
//                 {
//                     role: "user",
//                     parts: [{text: userMessage}]
//                 }
//             ],
//             generationConfig: {
//                 temperature: 0.7
//             }
//         }),

//     };
//     try{
//         const response = await fetch(
//             "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
//             options
//         );
//         const data = await response.json();
//         console.log(data);
        

//         if(!response.ok){
//             console.error("error gemini api", data)
//             return res.status(response.status).json(data);
            
//         }
//         const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "error: could  not parse ai response";
//         res.json({message: textResponse, 
//             model: "gemini-2.5-flash"});
//     }catch(err){
//         console.error("fetch error: ", err);
//         res.status(500).json({error: "fetch  reques failed"});
//     }
// })


// app.get('/', (req, res)=>{
//     res.send("this is the root page");
// })

// app.post("/test", async(req,res)=>{
//    const userContent = req.body.content || "give me a default content";

//    try{
//     const response = await ai.models.generateContent({
//         model: 'gemini-2.5-flash',
//         contents: userContent
//     });
//     res.json({
//         message: response.text,
//         mode: 'gemini-2.5-flash',
        
//     });
//    }catch(error){
//     console.error(`gemini API error: `, error);
//     res.status(500).json({error: "failed to communicate with Gemini API"});
//    }
// })


