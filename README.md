# 🌍 GreenTrack India

**AI-Powered Carbon Emission Tracking & Renewable Energy Platform**

Built for the **Prompt to Product Competition** | Deployment-ready in 2 hours

---

## 🎯 Features

✅ **Carbon Emission Calculator** - Calculate CO₂ footprint from electricity, LPG, diesel, and transport  
✅ **AI-Powered Insights** - Gemini AI analyzes your data and provides actionable recommendations  
✅ **Solar Feasibility Recommender** - Get personalized solar system recommendations based on location  
✅ **Real-Time Dashboard** - Visualize emissions with Chart.js (Pie, Line, Bar charts)  
✅ **Azure SQL Database** - Persistent storage for emission logs  
✅ **Netlify Functions** - Serverless backend with full API integration

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **Backend** | Node.js (Netlify Functions) |
| **Database** | Azure SQL Database |
| **AI Engine** | Google Gemini API |
| **Hosting** | Netlify |

---

## 📁 Project Structure

```
greentrack-india/
├── netlify/
│   └── functions/
│       ├── calculateEmission.js    # Carbon calculation + AI
│       ├── getRecommendations.js   # Solar feasibility + AI
│       └── saveToDB.js              # Database operations
├── public/
│   ├── index.html                   # Landing page
│   ├── dashboard.html               # Analytics dashboard
│   ├── calculator.html              # Emission calculator
│   ├── recommender.html             # Solar recommender
│   ├── styles.css                   # Complete CSS (unique prefixes)
│   └── main.js                      # Frontend JavaScript
├── .env.example                     # Environment variables template
├── netlify.toml                     # Netlify configuration
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## 🚀 Quick Start (2-Hour Setup)

### **Step 1: Clone & Install (5 min)**

```bash
git clone https://github.com/yourusername/greentrack-india.git
cd greentrack-india
npm install
```

### **Step 2: Setup Azure SQL (10 min)**

1. Create Azure SQL Database
2. Run `schema.sql` in Azure Query Editor
3. Note down connection details

### **Step 3: Get Gemini API Key (5 min)**

1. Visit https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy the key

### **Step 4: Configure Environment (5 min)**

Create `.env` file:

```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_SERVER=your_server.database.windows.net
DB_NAME=greentrack_db
GEMINI_API_KEY=your_gemini_key
```

### **Step 5: Test Locally (10 min)**

```bash
npm run dev
# Visit http://localhost:8888
```

### **Step 6: Deploy to Netlify (15 min)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Add environment variables in Netlify Dashboard:
# Site Settings > Environment Variables
# Add: DB_USER, DB_PASSWORD, DB_SERVER, DB_NAME, GEMINI_API_KEY

# Deploy
netlify deploy --prod
```

---

## 🎨 Pages Overview

### **1. Landing Page** (`index.html`)
- Hero section with animated cards
- Feature highlights
- Call-to-action buttons
- CSS Prefix: `home-`

### **2. Dashboard** (`dashboard.html`)
- 3 Chart.js visualizations
- Real-time stats (Total emissions, trees needed, savings, score)
- AI insights section
- Activity log
- CSS Prefix: `dash-`

### **3. Calculator** (`calculator.html`)
- Input form (electricity, LPG, diesel, km)
- Real-time calculation
- AI-generated suggestions
- Emission breakdown
- CSS Prefix: `calc-`

### **4. Recommender** (`recommender.html`)
- Solar feasibility analysis
- System size recommendation
- ROI & payback calculation
- AI-powered insights
- CSS Prefix: `rec-`

---

## 🔌 API Endpoints

### **POST** `/.netlify/functions/calculateEmission`
**Request:**
```json
{
  "electricity": 250,
  "lpg": 14,
  "diesel": 10,
  "km": 150
}
```

**Response:**
```json
{
  "success": true,
  "total": 380.5,
  "emissions": {
    "electricity": 205,
    "lpg": 41.72,
    "diesel": 26.8,
    "transport": 18
  },
  "trees": 18,
  "aiSuggestion": "Your monthly footprint is..."
}
```

### **POST** `/.netlify/functions/getRecommendations`
**Request:**
```json
{
  "pincode": "560001",
  "roofArea": 500,
  "monthlyBill": 3500
}
```

**Response:**
```json
{
  "success": true,
  "systemSize": "3.5",
  "annualEnergy": "5985",
  "co2Reduction": "4908",
  "annualSavings": "25200",
  "paybackYears": "6.9",
  "feasibilityScore": 85,
  "aiRecommendation": "Your location receives..."
}
```

### **GET** `/.netlify/functions/saveToDB?action=latest`
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "electricity": 250,
    "total_emission": 380.5,
    "created_at": "2025-11-13T..."
  }
}
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE EmissionLogs (
    id INT PRIMARY KEY IDENTITY(1,1),
    electricity FLOAT NOT NULL DEFAULT 0,
    lpg FLOAT NOT NULL DEFAULT 0,
    diesel FLOAT NOT NULL DEFAULT 0,
    km FLOAT NOT NULL DEFAULT 0,
    total_emission FLOAT NOT NULL,
    ai_suggestion NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE()
);
```

---

## 🎯 Competition Demo Script (5 min)

### **Opening (30 sec)**
> "GreenTrack India is an AI-powered platform that helps Indian households track carbon emissions and transition to renewable energy."

### **Live Demo (3 min)**

1. **Calculator** (60 sec)
   - Enter sample data
   - Show real-time calculation
   - Highlight AI suggestion

2. **Recommender** (60 sec)
   - Input pincode & roof area
   - Show solar feasibility
   - Explain ROI calculation

3. **Dashboard** (60 sec)
   - Show emission trends
   - Explain Chart.js visualizations
   - Demonstrate data export

### **Tech Highlight (1 min)**
> "Built with vanilla JavaScript for speed, Netlify Functions for serverless backend, Azure SQL for persistence, and Gemini AI for intelligent insights. Fully deployable in 2 hours."

### **Closing (30 sec)**
> "GreenTrack makes sustainability accessible. With just a few inputs, any Indian household can understand their carbon impact and take actionable steps toward a greener future."

---

## 🔧 Troubleshooting

### **Issue: Database Connection Fails**
- Verify Azure SQL firewall allows Netlify IPs
- Check environment variables in Netlify Dashboard

### **Issue: AI Suggestions Not Working**
- Verify `GEMINI_API_KEY` is set
- Check API quota at Google AI Studio

### **Issue: Charts Not Rendering**
- Ensure Chart.js CDN is loaded
- Check browser console for errors

---

## 📊 Performance Metrics

- **Page Load**: < 2 seconds
- **API Response**: < 1.5 seconds
- **Database Query**: < 500ms
- **AI Generation**: 1-3 seconds

---

## 🌟 Future Enhancements

- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Mobile app (React Native)
- [ ] Social sharing of carbon reports
- [ ] Integration with smart meters
- [ ] Gamification (carbon reduction challenges)
- [ ] Community leaderboard

---

## 📜 License

MIT License - Feel free to use for your competition!

---

## 👤 Author

Sudeep J Shivashettar
Monisha D
Sangamesha Kumbara
** Acharya Institute of Technology 
Built for Prompt to Product Competition 2025 (Tech Habba)

---

## 🙏 Acknowledgments

- Chart.js for beautiful visualizations
- Google Gemini for AI insights
- Netlify for seamless deployment
- Azure for reliable database hosting

---

**⭐ Star this repo if you find it useful!**
