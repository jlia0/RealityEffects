const DATA_COUNT = 30;
const labels = [];
for (let i = 0; i < DATA_COUNT; ++i) {
    labels.push(i.toString());
}

let datapoints = [0, 20, 20, 60, 60, 120, 20, 180, 120, 125, 105, 110, 170];

const data = {
    labels: labels,
    datasets: [
        {
            label: 'Angle Data',
            data: datapoints,
            borderColor: 'rgba(255, 99, 132, 1.0)',
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4
        }
    ]
};

// initialize a chart and put it in the 'barChart' div
const bar = document.getElementById('chart').getContext('2d');
const chart = new Chart(bar, {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Chart.js Line Chart - Cubic interpolation mode'
            },
        },
        interaction: {
            intersect: false,
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Value'
                },
                suggestedMin: -10,
                suggestedMax: 200
            }
        }
    },
});

const socket = io()
let count = DATA_COUNT
socket.on('add', (data) => {
    chart.data.datasets[0].data.push(data)
    if (chart.data.datasets[0].data.length >= 50) {
        chart.data.datasets[0].data.shift()
    }
    chart.update()
})

