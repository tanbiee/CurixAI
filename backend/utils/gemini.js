import "dotenv/config"
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GROQ_API_KEY = process.env.GROQ_API_KEY

const getGeminiResponse = async (messages) => {
    let contents = [];
    if (Array.isArray(messages)) {
        const contextWindow = messages.slice(-20);

        contents = contextWindow.map(msg => ({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content
        }));
    } else {
        contents = [
            {
                role: "user",
                content: messages
            }
        ];
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            messages: contents,
            model: "llama-3.1-8b-instant",
            temperature: 0.7
        }),

    };
    try {
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            options
        );
        const data = await response.json();
        console.log(data);


        if (!response.ok) {
            console.error("error groq api", data)
            throw new Error(`Groq API error: ${response.status}`);
        }
        const textResponse = data.choices?.[0]?.message?.content || "error: could not parse ai response";
        return textResponse;
    } catch (err) {
        console.error("fetch error: ", err);
        throw err;
    }
}

export default getGeminiResponse;