const sql = require('mssql');

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

exports.handler = async (event) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Content-Type": "application/json"
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        await sql.connect(dbConfig);
        const action = event.queryStringParameters?.action || "";

        // -------------------------------------------------------------
        // GET: Latest emission
        // -------------------------------------------------------------
        if (event.httpMethod === "GET" && action === "latest") {
            const result = await sql.query`
                SELECT TOP 1 * FROM EmissionLogs ORDER BY created_at DESC
            `;
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, data: result.recordset[0] })
            };
        }

        // -------------------------------------------------------------
        // GET: Last 10 emission logs
        // -------------------------------------------------------------
        if (event.httpMethod === "GET" && action === "all") {
            const result = await sql.query`
                SELECT TOP 10 * FROM EmissionLogs ORDER BY created_at DESC
            `;
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, data: result.recordset })
            };
        }

        // -------------------------------------------------------------
        // GET: Last 10 activities (REAL-TIME)
        // -------------------------------------------------------------
        if (event.httpMethod === "GET" && action === "activities") {

            const result = await sql.query`
                SELECT TOP 10 id, type, title, details, metadata, created_at
                FROM dbo.ActivityLog
                ORDER BY created_at DESC
            `;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, data: result.recordset })
            };
        }

        // -------------------------------------------------------------
        // POST: Save new emission + Add activity log
        // -------------------------------------------------------------
        if (event.httpMethod === "POST") {
            const body = JSON.parse(event.body);

            const { electricity, lpg, diesel, km, total_emission, ai_suggestion } = body;

            await sql.query`
                INSERT INTO EmissionLogs (electricity, lpg, diesel, km, total_emission, ai_suggestion)
                VALUES (${electricity}, ${lpg}, ${diesel}, ${km}, ${total_emission}, ${ai_suggestion})
            `;

            // log activity
            await sql.query`
                INSERT INTO dbo.ActivityLog (type, title, details, metadata)
                VALUES ('emission', 'Emission Calculated', 
                       ${total_emission + ' kg CO₂'},
                       ${JSON.stringify(body)})
            `;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: "Saved + Activity Logged" })
            };
        }

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: "Invalid action" })
        };

    } catch (err) {
        console.error("DB ERROR:", err);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: err.message
            })
        };
    }
};
