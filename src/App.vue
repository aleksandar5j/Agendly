<template>
  <div class="app-container">
    <aside class="sidebar" v-if="session.isLoggedIn">
      <div class="logo-wrap">
        <img alt="Logo" class="logo" src="/src/components/logo.png" />
        <div class="user-box">
          <div class="user-info">
            <img src="/src/components/icons/user.png" class="user" />
            <h1 class="user-outline">{{ session.user.usr_username }}</h1>
          </div>
          <button class="logout-btn" @click="logout" alt="logout">
            <img src="/src/components/icons/logout.png" />
          </button>
        </div>
      </div>

      <nav class="menu">
        <!-- Dashboard -->
        <RouterLink
          to="/dashboard"
          class="menu-item outline-text"
          exact
          @click.prevent="handleDashboardClick"
        >
          <img src="/src/components/icons/dashboard.png" />
          Dashboard
          <span v-if="reminderStore.tasksLate.length > 0" class="reminder-badge">
            {{ reminderStore.tasksLate.length }}
          </span>
        </RouterLink>

        <!-- Statistics -->
        <RouterLink to="/statistics" class="menu-item outline-text" exact>
          <img src="/src/components/icons/trend.png" />
          Statistics
        </RouterLink>

        <!-- Tasks -->
        <RouterLink to="/tasks" class="menu-item outline-text" exact>
          <img src="/src/components/icons/task.png" />
          Tasks
        </RouterLink>

        <!-- Reminders -->
        <RouterLink
          to="/reminders"
          class="menu-item outline-text"
          exact
          @click.prevent="handleReminderClick"
        >
          <img src="/src/components/icons/bell.png" />
          Reminders
          <span v-if="reminderStore.activeCount > 0" class="reminder-badge">
            {{ reminderStore.activeCount }}
          </span>
        </RouterLink>

        <!-- Settings -->
        <RouterLink to="/settings" class="menu-item outline-text" exact>
          <img src="/src/components/icons/settings.png" />
          Settings
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <main :class="['content', { 'with-sidebar': session.isLoggedIn }]">
      <RouterView />
    </main>

    <div v-if="reminderStore.showPopup" class="reminder-popup">
      <strong>Tasks reminder:</strong>
      <ul>
        <li v-for="rem in reminderStore.activeReminders" :key="rem.rem_id">
          {{ rem.tsk_title }} ({{ rem.remMinutesLeft }} minutes left)
        </li>
      </ul>
    </div>

    <!-- Late tasks popup -->
    <div v-if="reminderStore.showLatePopup" class="taskslate-popup">
      <strong>Overdue tasks:</strong>
      <ul>
        <li v-for="task in reminderStore.lateTasksPopup" :key="task.tsk_id">
          {{ task.tsk_title }} ({{ task.tsk_date }} • {{ task.tsk_time }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useSessionStore } from './stores/sessionUser'
import { useReminderStore } from '@/stores/reminders'
import { onMounted, watch } from 'vue'

const router = useRouter()
const session = useSessionStore()
const reminderStore = useReminderStore()

// Klik na Reminders
const handleReminderClick = () => {
  reminderStore.showPopupManually()
  router.push('/reminders')
}

// Klik na Dashboard
const handleDashboardClick = async () => {
  await reminderStore.loadLateTasks() // učitaj kasne taskove
  reminderStore.showLateTasksPopup() // prikaži overdue popup
  router.push('/dashboard')
}

// Logout
const logout = () => {
  session.logout()
  router.push('/')
}

onMounted(async () => {
  if (session.isLoggedIn) {
    await reminderStore.loadReminders()
    await reminderStore.loadLateTasks()

    // odmah prikaz badge i popup ako ima aktivnih
    reminderStore.updateActiveReminders()

    // start interval za real-time update popupa
    reminderStore.startAutoDelete()
  }
})

watch(
  () => session.isLoggedIn,
  async (logged) => {
    if (logged) {
      await reminderStore.loadReminders()
      await reminderStore.loadLateTasks()
      reminderStore.updateActiveReminders() // odmah postavi badge
      reminderStore.startAutoDelete()
    }
  },
)
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 300px;
  /* background: linear-gradient(to bottom, rgb(134, 163, 209), rgb(35, 57, 117)); */
  background: linear-gradient(to bottom, rgb(114, 145, 211), rgb(32, 72, 136));
  color: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
}

.logo-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
}

.logo-wrap .logo {
  height: 100px;
  padding: 40px;
}

.user-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.6rem 1rem;
  margin-bottom: 40px;
  box-sizing: border-box;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px;
  border-radius: 50%;
  border: none;
  background: rgb(255, 255, 255);
  cursor: pointer;
  transition: 0.3s;
}

.logout-btn img {
  height: 23px;
  filter: invert(0);
  transition: 0.3s;
}

.logout-btn:hover {
  background: rgb(150, 42, 42);
}

.logout-btn:hover img {
  filter: brightness(0) invert(1);
}

.user-box .user {
  height: 25px;
  filter: brightness(0) invert(1);
}

.user-box h1 {
  color: rgb(255, 255, 255);
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  font-size: 18px;
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  background: transparent;
}

.user-outline {
  color: white;
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 1px;
  margin: 0;
  display: flex;
  align-items: center;
}

.menu-item img {
  height: 25px;
  filter: brightness(0) invert(1);
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
}

.menu-item.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.15);
}

.logout-wrap {
  margin-top: auto;
  padding-top: 20px;
  text-align: center;
}
.content {
  flex: 1;
}

.content.with-sidebar {
  margin-left: 320px;
}

.reminder-badge {
  background: red;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
  font-weight: bold;
}

.taskslate-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #ef4444;
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  animation: fadeInOut 5s forwards;
  font-weight: bold;
}

.reminder-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #ef4444;
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  animation: fadeInOut 5s forwards;
  font-weight: bold;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
