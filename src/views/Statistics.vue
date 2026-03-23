<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="statistics">
    <div class="head">
      <img src="/src/components/icons/trend.png" />
      <h1>My Statistics</h1>
    </div>

    <div class="bar-section">
      <div class="glass-card big">
        <p class="title">Productivity</p>

        <div class="month-buttons">
          <button
            v-for="(m, i) in months"
            :key="i"
            :class="{ active: selectedMonth === i + 1 }"
            @click="selectMonth(i + 1)"
          >
            {{ m }}
          </button>
        </div>

        <div class="bar-chart">
          <Bar :data="barChartData" :options="barOptions" />
        </div>
      </div>
    </div>

    <hr />

    <div class="charts-row">
      <div class="glass-card small">
        <div class="chart-container">
          <p class="title">All Progress</p>
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { ref, onMounted } from 'vue'
import api from '@/api'
import { useSessionStore } from '@/stores/sessionUser'

// Register Chart.js elements
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

const session = useSessionStore()

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const today = new Date()

const selectedMonth = ref(today.getMonth() + 1)
const selectedYear = ref(today.getFullYear())

const barChartData = ref({
  labels: ['ToDo', 'Pending', 'Done'],
  datasets: [
    {
      label: 'Tasks',
      data: [0, 0, 0],
      backgroundColor: ['#f39c12', '#3498db', '#2ecc71'],
    },
  ],
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // ako ne želiš legendu
  },
  scales: {
    x: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
        font: { weight: 'bold' },
      },
    },
    y: {
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
        font: { weight: 'bold' },
      },
    },
  },
}

function selectMonth(month) {
  selectedMonth.value = month
  getBarStats()
}

const chartData = ref({
  labels: ['ToDo', 'Pending', 'Done'],
  datasets: [
    { data: [0, 0, 0], backgroundColor: ['#f39c12', '#3498db', '#2ecc71'], borderWidth: 0 },
  ],
})

// --- Monthly Progress ---
const monthlyChartData = ref({
  labels: ['ToDo', 'Pending', 'Done'],
  datasets: [
    { data: [0, 0, 0], backgroundColor: ['#f1c40f', '#3498db', '#2ecc71'], borderWidth: 0 },
  ],
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
        font: { weight: 'bold' },
      },
    },
  },
}

// Fetch stats for both charts
async function getStats() {
  try {
    // --- All Progress ---
    const res = await api.getTaskStatusStats(session.sid)

    const allTotals = [0, 0, 0] // ToDo, Pending, Done
    res.data.data.forEach((item) => {
      if (item.sts_name === 'ToDo') allTotals[0] = item.total
      if (item.sts_name === 'Pending') allTotals[1] = item.total
      if (item.sts_name === 'Done') allTotals[2] = item.total
    })

    // **Postavljamo novi datasets objekat** za All Progress
    chartData.value = {
      labels: ['ToDo', 'Pending', 'Done'],
      datasets: [
        {
          data: allTotals,
          backgroundColor: ['#f39c12', '#3498db', '#2ecc71'],
          borderWidth: 0,
        },
      ],
    }

    const resMonthly = await api.getMonthlyProgress(session.sid)

    const monthlyTotals = [0, 0, 0]
    resMonthly.data.data.forEach((item) => {
      if (item.sts_name === 'ToDo') monthlyTotals[0] = item.total
      if (item.sts_name === 'Pending') monthlyTotals[1] = item.total
      if (item.sts_name === 'Done') monthlyTotals[2] = item.total
    })

    monthlyChartData.value = {
      labels: ['ToDo', 'Pending', 'Done'],
      datasets: [
        {
          data: monthlyTotals,
          backgroundColor: ['#f39c12', '#3498db', '#2ecc71'],
          borderWidth: 0,
        },
      ],
    }

    console.log(resMonthly.data)
    console.log(res.data)
  } catch (err) {
    console.log(err)
  }
}

async function getBarStats() {
  try {
    const res = await api.getFullYearProgress(session.sid, selectedMonth.value, selectedYear.value)

    const totals = [0, 0, 0]

    res.data.data.forEach((item) => {
      if (item.sts_name === 'ToDo') totals[0] = item.total
      if (item.sts_name === 'Pending') totals[1] = item.total
      if (item.sts_name === 'Done') totals[2] = item.total
    })

    barChartData.value = {
      labels: ['ToDo', 'Pending', 'Done'],
      datasets: [
        {
          label: 'Tasks',
          data: totals,
          backgroundColor: ['#f39c12', '#3498db', '#2ecc71'],
        },
      ],
    }

    console.log(res.data)
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  getStats()
  getBarStats()
})
</script>

<style scoped>
.statistics {
  padding: 40px 80px;
  min-height: 100vh;
  background: var(--bg-main);
}

hr {
  margin: 100px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.head img {
  height: 40px;
  filter: var(--icon-filter);
}

.head h1 {
  font-weight: bold;
  font-size: 33px;
  color: var(--text-color);
  margin: 0;
}

.todo {
  background: #f39c12;
}
.processing {
  background: #3498db;
}
.done {
  background: #2ecc71;
}

.charts-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 60px;
  margin-bottom: 80px;
}

.chart-container {
  width: 100%;
  max-width: 360px; /* SMANJENO da stane lepo */
  height: 280px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* centriranje */
}

.bar-section {
  margin-top: 40px; /* bilo 60px */
}

.bar-chart {
  width: 100%;
  max-width: 820px; /* malo smanjeno da ima luft */
  height: 320px; /* malo manja visina */
  margin: 0 auto;
  margin-top: 10px; /* mali razmak od dugmića */
}

.month-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 25px;
}

.month-buttons button {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background: var(--statistics-btns);
  color: var(--text-color);
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s;
}

.month-buttons button:hover {
  background: #4f6fb1;
}

.month-buttons button.active {
  background: #3498db;
  color: white;
}

.title {
  color: var(--text-color);
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border-radius: 20px;

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);

  transition: 0.3s ease;

  display: flex;
  justify-content: center;
  align-items: center; /* KLJUČNO za centar */
}

.glass-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.glass-card.big {
  max-width: 900px;
  width: 100%;

  margin: 0 auto;

  padding: 25px 25px 15px 25px; /* gore manje, dole još manje */

  display: flex;
  flex-direction: column;
  align-items: center;
}

.glass-card.small {
  max-width: 420px;
  width: 100%;

  padding: 70px 10px;

  margin: auto; /* KLJUČNO */
}

html,
body {
  background: var(--bg-main);
  margin: 0;
  padding: 0;
}

@media (max-width: 500px) {
  .head h1 {
    font-size: 22px;
  }
}

@media (max-width: 768px) {
  .statistics {
    padding: 10px 20px; /* manje sa strane */
    overflow-x: hidden; /* sprečava horizontalni scroll */
    background: var(--bg-main);
  }

  .head {
    flex-direction: row;
    gap: 10px;
    text-align: center;
    margin-top: 15px;
  }

  .head img {
    height: 28px;
  }

  .head h1 {
    font-size: 22px;
  }

  .bar-section {
    margin-top: 20px;
  }

  .bar-chart {
    width: 100% !important; /* zauzima 100% širine kontejnera */
    max-width: 100% !important; /* ne prelazi ekran */
    height: 220px !important; /* proporcionalno smanjena visina */
    margin: 0 auto;
  }

  .month-buttons {
    flex-wrap: wrap;
    justify-content: center;
    gap: 5px;
    margin-bottom: 15px;
  }

  .month-buttons button {
    padding: 5px 8px;
    font-size: 12px;
  }

  .charts-row {
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-top: 25px;
    margin-bottom: 30px;
  }

  .glass-card.big,
  .glass-card.small {
    width: 100% !important;
    max-width: 100% !important;
    padding: 20px 10px !important;
    box-sizing: border-box;
  }

  .chart-container {
    width: 100% !important;
    max-width: 100% !important;
    height: 200px !important;
    padding: 30px 0px;
  }

  .title {
    font-size: 16px;
    margin-bottom: 15px;
  }
}
</style>
