<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="statistics">
    <div class="head">
      <img src="/src/components/icons/trend.png" />
      <h1>My Statistics</h1>
    </div>

    <div class="bar-section">
      <p
        style="
          color: var(--text-color);
          text-align: center;
          margin-bottom: 20px;
          font-size: 20px;
          font-weight: bold;
        "
      >
        Productivity
      </p>

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

    <hr />

    <div class="charts-row">
      <div class="chart-container">
        <p
          style="
            color: var(--text-color);
            text-align: center;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: bold;
          "
        >
          All Progress
        </p>
        <Doughnut :data="chartData" :options="chartOptions" />
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
  gap: 120px;
  justify-content: center;
  margin-top: 80px;
  margin-bottom: 100px;
}

.chart-container {
  width: 100%;
  max-width: 420px;
  height: 320px;
}

.bar-section {
  margin-top: 60px;
}

.bar-chart {
  width: 100%;
  max-width: 885px;
  height: 350px;
  margin: auto;
}

.month-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
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
</style>
