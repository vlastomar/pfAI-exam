
// --- Chart.js Stacked Bar Chart Data and Config ---
const ctx = document.getElementById('barChart').getContext('2d');
let chartData = {
    labels: ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'],
    datasets: [
        {
            label: 'Customers',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: '#ffd166', // gold/yellow
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.7
        },
        {
            label: 'Leads',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: '#4895ef', // blue
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.7
        },
        {
            label: 'Prospects',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: '#e0e5ec', // light gray
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.7
        }
    ]
};
let barChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const month = context.dataIndex;
                        // Show dynamic values for each month
                        return (
                            `Month ${month}\n` +
                            `Prospects: ${Math.round(chartData.datasets[0].data[month])}\n` +
                            `Leads: ${Math.round(chartData.datasets[1].data[month])}\n` +
                            `Customers: ${Math.round(chartData.datasets[2].data[month])}`
                        );
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: { color: '#2e3950' },
                stacked: true,
                ticks: { color: '#e6eaf1', callback: v => v + ' people' }
            },
            y: {
                grid: { color: '#2e3950' },
                stacked: true,
                ticks: { color: '#e6eaf1' }
            }
        }
    }
});

// --- Sliders and Calculations ---
const leadRate = document.getElementById('leadRate');
const prospectRate = document.getElementById('prospectRate');
const leadRateValue = document.getElementById('leadRateValue');
const prospectRateValue = document.getElementById('prospectRateValue');
const revenueInput = document.getElementById('revenue');
const orderValueInput = document.getElementById('orderValue');

function updateSliders() {
    leadRateValue.textContent = parseFloat(leadRate.value).toFixed(2) + '%';
    prospectRateValue.textContent = parseFloat(prospectRate.value).toFixed(2) + '%';
}
leadRate.addEventListener('input', updateSliders);
prospectRate.addEventListener('input', updateSliders);

function calculateAndUpdate() {
    const revenue = parseFloat(revenueInput.value) || 0;
    const orderValue = parseFloat(orderValueInput.value) || 1;
    const lead = parseFloat(leadRate.value) || 1;
    const prospect = parseFloat(prospectRate.value) || 1;
    // Formulas
    const customers = revenue / orderValue;
    const leads = customers * 100 / lead;
    const prospects = leads * 100 / prospect;
    // Update summary cards
    document.getElementById('customersValue').textContent = Math.round(customers);
    document.getElementById('leadsValue').textContent = Math.round(leads);
    document.getElementById('prospectsValue').textContent = Math.round(prospects);
    // Update progress bars
    document.getElementById('customersBar').style.width = (customers / prospects * 100).toFixed(1) + '%';
    document.getElementById('leadsBar').style.width = (leads / prospects * 100).toFixed(1) + '%';
    document.getElementById('prospectsBar').style.width = '100%';
    // Update percent labels
    document.querySelector('.customers .percent').textContent = ((customers / prospects * 100).toFixed(0) || 0) + '%';
    document.querySelector('.leads .percent').textContent = ((leads / prospects * 100).toFixed(0) || 0) + '%';
    document.querySelector('.prospects .percent').textContent = '100%';

    // Update chart data dynamically for stacked bars
    // Each month bar: Prospects (full), Leads (difference), Customers (difference)
    let months = 6;
    let customersArr = [];
    let leadsArr = [];
    let prospectsArr = [];
    for (let i = 0; i < months; i++) {
        // Simulate growth for each month (linear for demo)
        let c = Math.round(customers * (i + 1) / months);
        let l = Math.round(leads * (i + 1) / months) - c;
        let p = Math.round(prospects * (i + 1) / months) - (l + c);
        customersArr.push(c);
        leadsArr.push(l);
        prospectsArr.push(p);
    }
    chartData.datasets[0].data = customersArr;
    chartData.datasets[1].data = leadsArr;
    chartData.datasets[2].data = prospectsArr;
    barChart.update();
}
leadRate.addEventListener('input', calculateAndUpdate);
prospectRate.addEventListener('input', calculateAndUpdate);
revenueInput.addEventListener('input', calculateAndUpdate);
orderValueInput.addEventListener('input', calculateAndUpdate);
window.onload = () => {
    updateSliders();
    calculateAndUpdate();
};
