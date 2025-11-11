import "dotenv/config"
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

const getGeminiResponse = async (message)=>{
    const options ={
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [{text: message}]
                }
            ],
            generationConfig: {
                temperature: 0.7
            }
        }),

    };
    try{
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            options
        );
        const data = await response.json();
        console.log(data);
        

        if(!response.ok){
            console.error("error gemini api", data)
            throw new Error(`Gemini API error: ${response.status}`);
        }
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "error: could not parse ai response";
        return textResponse;
    }catch(err){
        console.error("fetch error: ", err);
        throw err;
    }
}

export default getGeminiResponse;