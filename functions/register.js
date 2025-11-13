const sql = require('mssql');
const bcrypt = require('bcryptjs');
const dbConfig = require('../dbConfig');
require('dotenv').config();
const RESEND_API_KEY = process.env.RESEND_API_KEY;

console.log('Database Configuration:', {
  user: process.env.DB_USER,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
});

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  const body = JSON.parse(event.body);
  const { fullname, email, username, password } = body;

  if (!fullname || !email || !username || !password) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'All fields are required' })
    };
  }

  try {
    const pool = await sql.connect(dbConfig);

    const existingUser = await pool.request()
      .input('username', sql.VarChar, username)
      .input('fullname', sql.VarChar, fullname)
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE username = @username OR fullname = @fullname OR email = @email');

    if (existingUser.recordset.length > 0) {
      const conflictFields = existingUser.recordset.map(user => {
        if (user.username === username) return 'Username';
        if (user.fullname === fullname) return 'Fullname';
        if (user.email === email) return 'Email';
        return null;
      }).filter(Boolean).join(', ');

      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ message: `${conflictFields} already exists.` })
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.request()
      .input('username', sql.VarChar, username)
      .input('password', sql.VarChar, hashedPassword)
      .input('fullname', sql.VarChar, fullname)
      .input('email', sql.VarChar, email)
      .query('INSERT INTO Users (username, password, fullname, email) VALUES (@username, @password, @fullname, @email)');

    // Send welcome email
     await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Filmyadda <support@sudeepbro.me>',
        to: email,
        subject: 'Welcome to Filmyadda 🎬',
        html:`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Static Template</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-image: url(https://filmyadda.sudeepbro.me/css/assets/eamilBG.jpg);
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        background-size: cover;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%;">
          <tbody>
            <tr style="height: 0;">
              <td style="text-align: center;">
                <img
                  alt=""
                  src="https://filmyadda.sudeepbro.me/css/assets/bg.png"
                  height="50px" onclick="window.location.href='https://filmyadda.sudeepbro.me/index.html'"
                  style="cursor: pointer; width: 100%; max-width: 150px;"
                />
              </td>
              <td style="text-align: right;">
                <span
                  style="font-size: 16px; line-height: 30px; color: #ffffff;"
                  ></span>
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 92px 30px 115px;
            background:rgb(246, 240, 240);
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color:rgb(188, 248, 9);
              "
            >
              Welcome to Filmyadda 🎬
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
          
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
                color: #1f1f1f;
              "
            >
              Hi, ${fullname}!<br />
              Your account has been successfully created. You can now explore the latest movies, TV shows, and more.
            
            </p>
            
          </div>
        </div>
       <p style="margin: 0; margin-top: 16px; color: gold; text-align: center;">
  © 2024 Filmyadda. All rights reserved.
        </p>
        
        </main>
    </div>
  </body>
</html>`
      })
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'User registered successfully' })
    };
  } catch (err) {
    console.error("Database connection error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Database error', error: err.message })
    };
  }
};
