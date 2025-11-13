const sql = require('mssql');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Database config
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { electricity, lpg, diesel, km } = JSON.parse(event.body);

        // Emission factors (kg CO2 per unit)
        const factors = {
            electricity: 0.82,  // per kWh
            lpg: 2.98,          // per kg
            diesel: 2.68,       // per litre
            km: 0.12            // per km
        };

        // Calculate emissions
        const emissions = {
            electricity: (electricity || 0) * factors.electricity,
            lpg: (lpg || 0) * factors.lpg,
            diesel: (diesel || 0) * factors.diesel,
            transport: (km || 0) * factors.km
        };

        const total = Object.values(emissions).reduce((a, b) => a + b, 0);
        const trees = Math.ceil(total / 21.77); // Trees needed to offset

        // Generate AI suggestion using Gemini
        let aiSuggestion = '';
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            
            const prompt = `Analyze this carbon footprint data and provide a concise 2-3 sentence recommendation:
            - Total CO2: ${total.toFixed(2)} kg/month
            - Electricity: ${emissions.electricity.toFixed(2)} kg
            - LPG: ${emissions.lpg.toFixed(2)} kg
            - Diesel: ${emissions.diesel.toFixed(2)} kg
            - Transport: ${emissions.transport.toFixed(2)} kg
            
            Provide actionable advice on reducing emissions, focusing on the highest emission source.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            aiSuggestion = response.text();
        } catch (aiError) {
            console.error('AI generation error:', aiError);
            // Fallback suggestion
            const maxSource = Object.entries(emissions).reduce((a, b) => a[1] > b[1] ? a : b);
            aiSuggestion = `Your monthly footprint is ${total.toFixed(2)} kg CO₂. Focus on reducing ${maxSource[0]} emissions (${maxSource[1].toFixed(2)} kg) for maximum impact. Consider renewable energy alternatives.`;
        }

        // Save to Azure SQL
        try {
            await sql.connect(dbConfig);
            await sql.query`
                INSERT INTO EmissionLogs (electricity, lpg, diesel, km, total_emission, ai_suggestion)
                VALUES (${electricity || 0}, ${lpg || 0}, ${diesel || 0}, ${km || 0}, ${total}, ${aiSuggestion})
            `;
            await sql.close();
        } catch (dbError) {
            console.error('Database error:', dbError);
            // Continue even if DB save fails
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                total: total,
                emissions: emissions,
                trees: trees,
                aiSuggestion: aiSuggestion
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};