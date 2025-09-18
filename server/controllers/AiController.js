const { GoogleGenAI } = require("@google/genai");

// Fungsi untuk mengekstrak dan memformat response AI yang mengandung teks + JSON
const formatAiResponseToJson = (aiResponse) => {
    try {
        // Ekstrak JSON dari response yang mungkin mengandung teks dan JSON
        const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
        let jsonString = '';
        let humanMessage = '';
        
        if (jsonMatch) {
            // Ada JSON dalam code block
            jsonString = jsonMatch[1].trim();
            // Ambil teks di luar JSON sebagai pesan manusia
            humanMessage = aiResponse.replace(/```json[\s\S]*?```/g, '').trim();
        } else {
            // Coba cari JSON pattern tanpa code block
            const jsonPattern = /\[\s*\{[\s\S]*?\}\s*\]/;
            const jsonArrayMatch = aiResponse.match(jsonPattern);
            
            if (jsonArrayMatch) {
                jsonString = jsonArrayMatch[0];
                // Ambil teks sebelum dan sesudah JSON
                humanMessage = aiResponse.replace(jsonPattern, '').trim();
            } else {
                // Tidak ada JSON yang valid ditemukan
                throw new Error('No valid JSON found in response');
            }
        }
        
        // Parse JSON
        const parsedData = JSON.parse(jsonString);
        
        // Validasi bahwa data adalah array
        if (!Array.isArray(parsedData)) {
            throw new Error('Response is not an array');
        }
        
        // Validasi struktur setiap object dalam array
        const validatedData = parsedData.map(item => {
            return {
                id: item.id || '',
                name: item.name || '',
                symbol: item.symbol || '',
                current_price: parseFloat(item.current_price) || 0,
                market_cap: parseInt(item.market_cap) || 0,
                rank: parseInt(item.rank) || 0
            };
        });
        
        return {
            success: true,
            data: validatedData,
            message: humanMessage || 'Data cryptocurrency berhasil diproses',
            formatted: true
        };
        
    } catch (error) {
        console.error('Error formatting AI response to JSON:', error);
        
        // Fallback: return original response as message
        return {
            success: false,
            data: [],
            message: aiResponse,
            formatted: false,
            error: 'Failed to parse JSON from AI response'
        };
    }
};

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

MANDATORY: You MUST format ALL data as json format array of object. Example:

[
  {
    "id": "bitcoin",
    "name": "Bitcoin",
    "symbol": "BTC",
    "current_price": 45000,
    "market_cap": 900000000000,         "rank": 1
  },
  {     "id": "ethereum",   "name": "Ethereum",   "symbol": "ETH", 
         "current_price": 3000,
            "market_cap": 350000000000,
            "rank": 2
          },
          {
            "id": "tether",
            "name": "Tether",
            "symbol": "USDT",
            "current_price": 1,
            "market_cap": 68000000000,
            "rank": 3
          }
        ]

Create a proper json for the cryptocurrency data with your response in human text also .`
                    }]
                }]
            })

            console.log(response.text);

            console.log(response.text)

            // Format response AI ke JSON yang valid
            const formattedResponse = formatAiResponseToJson(response.text);


            res.status(200).json(formattedResponse)

        } catch (error) {

            console.log(error)

            next(error)

        }

    }


}

module.exports = AiController;