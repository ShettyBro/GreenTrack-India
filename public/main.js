// ===============================================
// DASHBOARD FUNCTIONS (Prefix: dash)
// ===============================================

let dashPieChart, dashLineChart, dashBarChart;

// Initialize all charts
function dashInitCharts() {
    // Pie Chart - Emission Breakdown
    const pieCtx = document.getElementById('dashPieChart');
    if (pieCtx) {
        dashPieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Electricity', 'LPG', 'Diesel', 'Transport'],
                datasets: [{
                    data: [45, 20, 15, 20],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b',
                        '#8b5cf6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12,
                                family: 'Inter'
                            }
                        }
                    }
                }
            }
        });
    }

    // Line Chart - Monthly Trends
    const lineCtx = document.getElementById('dashLineChart');
    if (lineCtx) {
        dashLineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
                datasets: [{
                    label: 'CO₂ Emissions (kg)',
                    data: [520, 480, 450, 420, 410, 380],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Bar Chart - Savings Comparison
    const barCtx = document.getElementById('dashBarChart');
    if (barCtx) {
        dashBarChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Without Solar',
                        data: [5200, 5100, 5300, 5250, 5400, 5350],
                        backgroundColor: '#ef4444'
                    },
                    {
                        label: 'With Solar',
                        data: [3500, 3400, 3550, 3500, 3600, 3580],
                        backgroundColor: '#10b981'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 12,
                                family: 'Inter'
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Load dashboard data
function dashLoadData() {
    // Update stats with sample data
    document.getElementById('dashTotalEmissions').textContent = '380 kg';
    document.getElementById('dashTreesNeeded').textContent = '28';
    document.getElementById('dashSavings').textContent = '₹12,400';
    document.getElementById('dashScore').textContent = '72/100';
}

// Refresh dashboard data
function dashRefreshData() {
    // Show loading state
    const btn = document.querySelector('.dash-btn-refresh');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="dash-btn-icon">⏳</span> Loading...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        dashLoadData();
        if (dashPieChart) dashPieChart.update();
        if (dashLineChart) dashLineChart.update();
        if (dashBarChart) dashBarChart.update();
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Show success message
        alert('Dashboard refreshed successfully! ✓');
    }, 1500);
}

// Export dashboard data
function dashExportData() {
    const reportData = {
        totalEmissions: '380 kg',
        treesNeeded: '28',
        potentialSavings: '₹12,400',
        carbonScore: '72/100',
        generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'greentrack-report.json';
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Report exported successfully! ✓');
}

// ===============================================
// CALCULATOR FUNCTIONS (Prefix: calc)
// ===============================================

async function calcCalculateEmissions(event) {
    event.preventDefault();
    
    const electricity = parseFloat(document.getElementById('calcElectricity').value) || 0;
    const lpg = parseFloat(document.getElementById('calcLpg').value) || 0;
    const diesel = parseFloat(document.getElementById('calcDiesel').value) || 0;
    const km = parseFloat(document.getElementById('calcKm').value) || 0;
    
    // Emission factors (kg CO2 per unit)
    const factors = {
        electricity: 0.82,  // per kWh
        lpg: 2.98,          // per kg
        diesel: 2.68,       // per litre
        km: 0.12            // per km
    };
    
    const emissions = {
        electricity: electricity * factors.electricity,
        lpg: lpg * factors.lpg,
        diesel: diesel * factors.diesel,
        transport: km * factors.km
    };
    
    const total = Object.values(emissions).reduce((a, b) => a + b, 0);
    const trees = Math.ceil(total / 21.77); // Average tree absorbs 21.77 kg CO2/year
    
    // Display results
    document.getElementById('calcResultTotal').textContent = total.toFixed(2);
    document.getElementById('calcResultTrees').textContent = trees;
    document.getElementById('calcResultElec').textContent = emissions.electricity.toFixed(2);
    document.getElementById('calcResultLpg').textContent = emissions.lpg.toFixed(2);
    document.getElementById('calcResultDiesel').textContent = emissions.diesel.toFixed(2);
    document.getElementById('calcResultTransport').textContent = emissions.transport.toFixed(2);
    
    document.getElementById('calcResults').style.display = 'block';
    
    // Generate AI suggestion
    calcGenerateAISuggestion(total, emissions);
}

async function calcGenerateAISuggestion(total, emissions) {
    const suggestionDiv = document.getElementById('calcAISuggestion');
    suggestionDiv.innerHTML = '<div class="calc-loading">🤖 AI is analyzing your data...</div>';
    
    // Simulate AI analysis
    setTimeout(() => {
        let suggestion = `Based on your monthly carbon footprint of ${total.toFixed(2)} kg CO₂, `;
        
        if (total < 200) {
            suggestion += "you're doing great! You're below the average household emissions.";
        } else if (total < 400) {
            suggestion += "you're within average range. Consider adopting solar to reduce by 45%.";
        } else {
            suggestion += "there's significant room for improvement. A 3kW solar system could save ₹24,000 annually.";
        }
        
        // Find highest emission source
        const maxSource = Object.entries(emissions).reduce((a, b) => a[1] > b[1] ? a : b);
        suggestion += ` Your highest emission source is ${maxSource[0]} (${maxSource[1].toFixed(2)} kg). Focus here for maximum impact.`;
        
        suggestionDiv.innerHTML = `<div class="calc-ai-result">${suggestion}</div>`;
    }, 2000);
}

// ===============================================
// RECOMMENDER FUNCTIONS (Prefix: rec)
// ===============================================

async function recGetRecommendation(event) {
    event.preventDefault();
    
    const pincode = document.getElementById('recPincode').value;
    const roofArea = parseFloat(document.getElementById('recRoofArea').value) || 0;
    const monthlyBill = parseFloat(document.getElementById('recBill').value) || 0;
    
    // Show loading
    document.getElementById('recResults').style.display = 'block';
    document.getElementById('recResultContent').innerHTML = '<div class="rec-loading">☀️ Analyzing solar feasibility...</div>';
    
    // Simulate API call
    setTimeout(() => {
        // Calculate recommendations
        const avgSunlight = 5.5; // hours per day (India average)
        const systemSize = Math.min(roofArea / 10, monthlyBill / 1000 * 1.5); // Rough estimate
        const annualEnergy = systemSize * avgSunlight * 365 * 0.8; // 80% efficiency
        const co2Reduction = annualEnergy * 0.82; // kg CO2
        const annualSavings = monthlyBill * 12 * 0.6; // 60% reduction
        const systemCost = systemSize * 50000; // ₹50k per kW
        const paybackYears = (systemCost / annualSavings).toFixed(1);
        
        const resultHTML = `
            <div class="rec-result-grid">
                <div class="rec-result-card">
                    <div class="rec-result-icon">⚡</div>
                    <div class="rec-result-label">Recommended System</div>
                    <div class="rec-result-value">${systemSize.toFixed(1)} kW</div>
                </div>
                <div class="rec-result-card">
                    <div class="rec-result-icon">☀️</div>
                    <div class="rec-result-label">Annual Energy</div>
                    <div class="rec-result-value">${annualEnergy.toFixed(0)} kWh</div>
                </div>
                <div class="rec-result-card">
                    <div class="rec-result-icon">🌿</div>
                    <div class="rec-result-label">CO₂ Reduction</div>
                    <div class="rec-result-value">${co2Reduction.toFixed(0)} kg/year</div>
                </div>
                <div class="rec-result-card">
                    <div class="rec-result-icon">💰</div>
                    <div class="rec-result-label">Annual Savings</div>
                    <div class="rec-result-value">₹${annualSavings.toFixed(0)}</div>
                </div>
                <div class="rec-result-card">
                    <div class="rec-result-icon">⏱️</div>
                    <div class="rec-result-label">Payback Period</div>
                    <div class="rec-result-value">${paybackYears} years</div>
                </div>
                <div class="rec-result-card">
                    <div class="rec-result-icon">📊</div>
                    <div class="rec-result-label">Feasibility Score</div>
                    <div class="rec-result-value">${systemSize > 2 ? '85' : '72'}/100</div>
                </div>
            </div>
            <div class="rec-ai-summary">
                <h4>🤖 AI Recommendation</h4>
                <p>Your location (${pincode}) receives excellent solar radiation. A ${systemSize.toFixed(1)}kW system is highly recommended and will reduce your carbon footprint by ${((co2Reduction/380)*100).toFixed(0)}%. With government subsidies, your payback period could be reduced to ${(parseFloat(paybackYears) * 0.7).toFixed(1)} years.</p>
            </div>
        `;
        
        document.getElementById('recResultContent').innerHTML = resultHTML;
    }, 2000);
}