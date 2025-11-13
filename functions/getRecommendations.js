const { GoogleGenerativeAI } = require('@google/generative-ai');

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

    // Handle OPTIONS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { pincode, roofArea, monthlyBill } = JSON.parse(event.body);

        // Basic calculations
        const avgSunlight = 5.5; // hours per day (India average)
        const systemSize = Math.min(roofArea / 10, monthlyBill / 1000 * 1.5);
        const annualEnergy = systemSize * avgSunlight * 365 * 0.8; // 80% efficiency
        const co2Reduction = annualEnergy * 0.82; // kg CO2 saved
        const annualSavings = monthlyBill * 12 * 0.6; // 60% bill reduction
        const systemCost = systemSize * 50000; // ₹50k per kW
        const paybackYears = (systemCost / annualSavings).toFixed(1);
        const feasibilityScore = systemSize > 2 ? 85 : systemSize > 1 ? 72 : 60;

        // Generate AI recommendation using Gemini
        let aiRecommendation = '';
        try {
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            
            const prompt = `As a renewable energy expert, analyze this solar installation case:
            - Location: Pincode ${pincode}, India
            - Available roof area: ${roofArea} sq ft
            - Monthly electricity bill: ₹${monthlyBill}
            - Recommended system: ${systemSize.toFixed(1)} kW
            - Estimated annual energy: ${annualEnergy.toFixed(0)} kWh
            - Annual savings: ₹${annualSavings.toFixed(0)}
            - Payback period: ${paybackYears} years
            
            Provide a 2-3 sentence recommendation covering:
            1. Feasibility assessment
            2. Key benefits (CO2 reduction + cost savings)
            3. Government subsidy consideration
            
            Keep it concise and actionable.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            aiRecommendation = response.text();
        } catch (aiError) {
            console.error('AI generation error:', aiError);
            // Fallback recommendation
            aiRecommendation = `Your location (${pincode}) receives excellent solar radiation. A ${systemSize.toFixed(1)}kW system is highly recommended and will reduce your carbon footprint by ${((co2Reduction/380)*100).toFixed(0)}%. With government subsidies, your payback period could be reduced to ${(parseFloat(paybackYears) * 0.7).toFixed(1)} years.`;
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                pincode: pincode,
                systemSize: systemSize.toFixed(1),
                annualEnergy: annualEnergy.toFixed(0),
                co2Reduction: co2Reduction.toFixed(0),
                annualSavings: annualSavings.toFixed(0),
                paybackYears: paybackYears,
                feasibilityScore: feasibilityScore,
                aiRecommendation: aiRecommendation
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