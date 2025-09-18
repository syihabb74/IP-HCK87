const { GoogleGenAI } = require("@google/genai");

class AiController {
    
    static async aiAnalyzeTopMarkets (req,res,next) {
        const ai = new GoogleGenAI({});

        if (!req.body) return next({name : 'BadRequest', message : `Prompt can't be empty`});

        try {

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{
                    role: "user",
                    parts: [{
                        text: `Data: ${JSON.stringify(req.body)}

MANDATORY: You MUST format ALL data as markdown tables. Example:

| Nama Koin | Simbol | Harga (USD) | Market Cap | Rank |
|-----------|--------|-------------|------------|------|
| Bitcoin | BTC | 45000 | 900B | 1 |
| Ethereum | ETH | 3000 | 350B | 2 |

STRICT RULES:
1. Every data row MUST use pipe symbols |
2. Header separator MUST be |-----------|
3. NO other formatting allowed for tabular data
4. Start response immediately with table
5. Use Indonesian language for explanations

Create a proper markdown table for the cryptocurrency data.`
                    }]
                }]
            })

            res.status(200).json({message : response.text})

        } catch (error) {

            next(error)

        }

    }


}

module.exports = AiController;