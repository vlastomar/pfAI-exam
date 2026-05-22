// --- Chart.js Bar Chart Data and Config ---
const ctx = document.getElementById('barChart').getContext('2d');
let chartData = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [{
        label: 'People',
        data: [10, 30, 25, 60, 90, 125],
        backgroundColor: '#7e8fa6',
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.7
    }]
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
                        const month = context.dataIndex + 1;
                        return `Month #${month}\nProspects: 63\nLeads: 13\nCustomers: 5`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: { color: '#2e3950' },
                ticks: { color: '#e6eaf1', callback: v => v + ' people' }
            },
            y: {
                grid: { color: '#2e3950' },
                ticks: { color: '#e6eaf1', callback: v => 'Month ' + v }
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
}
leadRate.addEventListener('input', calculateAndUpdate);
prospectRate.addEventListener('input', calculateAndUpdate);
revenueInput.addEventListener('input', calculateAndUpdate);
orderValueInput.addEventListener('input', calculateAndUpdate);
window.onload = () => {
    updateSliders();
    calculateAndUpdate();
};
