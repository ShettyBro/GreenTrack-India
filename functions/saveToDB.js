// saveToDB.js (UPDATED)
const sql = require('mssql');

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

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        await sql.connect(dbConfig);

        // GET - Fetch latest record or top 10
        if (event.httpMethod === 'GET') {
            const action = event.queryStringParameters?.action || 'latest';

            if (action === 'latest') {
                const result = await sql.query`
                    SELECT TOP 1 * FROM EmissionLogs 
                    ORDER BY created_at DESC
                `;

                if (result.recordset.length > 0) {
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            success: true,
                            data: result.recordset[0]
                        })
                    };
                } else {
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({
                            success: false,
                            message: 'No records found'
                        })
                    };
                }
            } else if (action === 'all') {
                const result = await sql.query`
                    SELECT TOP 10 * FROM EmissionLogs 
                    ORDER BY created_at DESC
                `;

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        data: result.recordset
                    })
                };
            } else if (action === 'activities' || action === 'allActivities') {
                // Return latest 10 activity logs
                const result = await sql.query`
                    SELECT TOP 10 id, type, title, details, metadata, created_at 
                    FROM ActivityLog
                    ORDER BY created_at DESC
                `;
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        success: true,
                        data: result.recordset
                    })
                };
            }
        }

        // POST - Save new emission record (existing behavior)
        if (event.httpMethod === 'POST') {
            const { electricity, lpg, diesel, km, total_emission, ai_suggestion } = JSON.parse(event.body);

            await sql.query`
                INSERT INTO EmissionLogs (electricity, lpg, diesel, km, total_emission, ai_suggestion)
                VALUES (${electricity}, ${lpg}, ${diesel}, ${km}, ${total_emission}, ${ai_suggestion})
            `;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Data saved successfully'
                })
            };
        }

        await sql.close();

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Database error:', error);
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
