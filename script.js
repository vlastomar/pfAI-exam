const ctx = document.getElementById('barChart').getContext('2d');

const colors = {
    prospects: '#6f7a88',
    leads: '#7f8895',
    customers: '#b7bec8',
    grid: 'rgba(118, 133, 153, 0.16)',
    text: '#d7dde7'
};

let chartData = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
        {
            label: 'Customers',
            data: [],
            backgroundColor: colors.customers,
            borderWidth: 0,
            borderSkipped: false,
            barPercentage: 0.8,
            categoryPercentage: 0.92
        },
        {
            label: 'Leads',
            data: [],
            backgroundColor: colors.leads,
            borderWidth: 0,
            borderSkipped: false,
            barPercentage: 0.8,
            categoryPercentage: 0.92
        },
        {
            label: 'Prospects',
            data: [],
            backgroundColor: colors.prospects,
            borderWidth: 0,
            borderSkipped: false,
            barPercentage: 0.8,
            categoryPercentage: 0.92
        }
    ]
};

const barChart = new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            tooltip: {
                displayColors: false,
                backgroundColor: 'rgba(115, 123, 135, 0.95)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: 'rgba(255,255,255,0.22)',
                borderWidth: 1,
                padding: 8,
                callbacks: {
                    title: items => `Month #${items[0].dataIndex + 1}`,
                    label: function(context) {
                        const i = context.dataIndex;
                        const customers = Math.round(chartData.datasets[0].data[i]);
                        const leads = Math.round(chartData.datasets[1].data[i] + customers);
                        const prospects = Math.round(chartData.datasets[2].data[i] + leads);
                        return [
                            `Prospects: ${prospects}`,
                            `Leads: ${leads}`,
                            `Customers: ${customers}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                stacked: true,
                max: 130,
                grid: {
                    color: colors.grid,
                    drawBorder: false
                },
                ticks: {
                    color: colors.text,
                    font: { size: 10, weight: '700' },
                    callback: value => `${value} people`
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: 'Month',
                    color: colors.text,
                    font: { size: 10, weight: '700' }
                },
                grid: {
                    color: colors.grid,
                    drawBorder: false
                },
                ticks: {
                    color: colors.text,
                    font: { size: 10, weight: '700' }
                }
            }
        }
    }
});

const leadRate = document.getElementById('leadRate');
const prospectRate = document.getElementById('prospectRate');
const leadRateValue = document.getElementById('leadRateValue');
const prospectRateValue = document.getElementById('prospectRateValue');
const revenueInput = document.getElementById('revenue');
const orderValueInput = document.getElementById('orderValue');

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateForDisplay(value) {
    if (!value) {
        return '';
    }

    const [year, month, day] = value.split('-');
    return `${day}-${monthNames[Number(month) - 1]}-${year}`;
}

function connectDatePicker(inputId, displayId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);

    if (!input || !display) {
        return;
    }

    const updateDisplay = () => {
        display.value = formatDateForDisplay(input.value);
    };

    input.addEventListener('change', updateDisplay);
    input.addEventListener('input', updateDisplay);
    input.addEventListener('click', () => {
        if (typeof input.showPicker === 'function') {
            input.showPicker();
        }
    });

    updateDisplay();
}

function setSliderFill(slider) {
    const percent = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.setProperty('--percent', `${percent}%`);
}

function updateSliders() {
    leadRateValue.textContent = `${parseFloat(leadRate.value).toFixed(2)}%`;
    prospectRateValue.textContent = `${parseFloat(prospectRate.value).toFixed(2)}%`;
    setSliderFill(leadRate);
    setSliderFill(prospectRate);
}

function calculateAndUpdate() {
    const revenue = parseFloat(revenueInput.value) || 0;
    const orderValue = parseFloat(orderValueInput.value) || 1;
    const lead = parseFloat(leadRate.value) || 1;
    const prospect = parseFloat(prospectRate.value) || 1;

    const customers = revenue / orderValue;
    const leads = customers * 100 / lead;
    const prospects = leads * 100 / prospect;

    const customersPercent = prospects ? (customers / prospects * 100) : 0;
    const leadsPercent = prospects ? (leads / prospects * 100) : 0;

    document.getElementById('customersValue').textContent = Math.round(customers);
    document.getElementById('leadsValue').textContent = Math.round(leads);
    document.getElementById('prospectsValue').textContent = Math.round(prospects);

    document.getElementById('customersBar').style.width = `${customersPercent.toFixed(1)}%`;
    document.getElementById('leadsBar').style.width = `${leadsPercent.toFixed(1)}%`;
    document.getElementById('prospectsBar').style.width = '100%';

    document.querySelector('.customers .percent').textContent = `${customersPercent.toFixed(0)}%`;
    document.querySelector('.leads .percent').textContent = `${leadsPercent.toFixed(0)}%`;
    document.querySelector('.prospects .percent').textContent = '100%';

    const months = 6;
    const customersArr = [];
    const leadsArr = [];
    const prospectsArr = [];

    for (let i = 0; i < months; i++) {
        const factor = (i + 1) / months;
        const c = Math.round(customers * factor);
        const totalLeads = Math.round(leads * factor);
        const totalProspects = Math.round(prospects * factor);

        customersArr.push(c);
        leadsArr.push(Math.max(totalLeads - c, 0));
        prospectsArr.push(Math.max(totalProspects - totalLeads, 0));
    }

    chartData.datasets[0].data = customersArr;
    chartData.datasets[1].data = leadsArr;
    chartData.datasets[2].data = prospectsArr;
    barChart.options.scales.x.max = Math.max(130, Math.ceil(prospects / 10) * 10);
    barChart.update();
}

[leadRate, prospectRate].forEach(slider => {
    slider.addEventListener('input', () => {
        updateSliders();
        calculateAndUpdate();
    });
});

[revenueInput, orderValueInput].forEach(input => {
    input.addEventListener('input', calculateAndUpdate);
});

window.addEventListener('load', () => {
    connectDatePicker('startDate', 'startDateDisplay');
    connectDatePicker('endDate', 'endDateDisplay');
    updateSliders();
    calculateAndUpdate();
});
