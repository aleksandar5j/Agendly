<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="settings-page">
    <div class="settings-card">
      <!-- AVATAR -->
      <div class="avatar">
        {{ session.user.usr_username.charAt(0).toUpperCase() }}
      </div>

      <!-- USER INFO -->
      <h2>{{ session.user.usr_username }}</h2>
      <p class="email">{{ session.user.usr_email }}</p>

      <!-- PASSWORD -->
      <div class="section">
        <h3>Change Password</h3>

        <input type="password" placeholder="New password" />
        <input type="password" placeholder="Confirm password" />

        <button class="btn">Update Password</button>
      </div>

      <div class="section">
        <h3>Notifications</h3>

        <label>
          <input type="checkbox" v-model="reminderStore.reminderNotificationsEnabled" />
          Task reminders
        </label>

        <label>
          <input type="checkbox" v-model="reminderStore.overdueNotificationsEnabled" />
          Overdue task alerts
        </label>
      </div>

      <!-- APPEARANCE -->
      <div class="section">
        <h3>Appearance</h3>

        <select v-model="theme">
          <option value="light">Light mode</option>
          <option value="dark">Dark mode</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

import { useSessionStore } from '@/stores/sessionUser'
import { useReminderStore } from '@/stores/reminders'

const reminderStore = useReminderStore()
const session = useSessionStore()

watch(
  () => reminderStore.reminderNotificationsEnabled,
  (val) => {
    localStorage.setItem('reminderNot', JSON.stringify(val))
  },
)

watch(
  () => reminderStore.overdueNotificationsEnabled,
  (val) => {
    localStorage.setItem('overdueNot', JSON.stringify(val))
  },
)
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, rgb(93, 128, 202), rgb(32, 72, 136));
  padding: 20px;
}

/* KARTICA */
.settings-card {
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  padding: 35px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* AVATAR */
.avatar {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 40px;
  font-weight: bold;
  color: white;
}

h2 {
  color: white;
  margin-bottom: 5px;
}

.email {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
}

/* SEKCIJE */
.section {
  text-align: left;
  margin-bottom: 28px;
}

.section h3 {
  color: white;
  margin-bottom: 12px;
  font-size: 16px;
}

/* INPUTI - KLJUČNO (SVE ISTO!) */
input,
select {
  width: 100%;
  height: 42px; /* fiksna visina */
  padding: 0 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 14px;
  box-sizing: border-box; /* da ne “šire” */
}

/* placeholder */
input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

/* dugmad */
.btn {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 500;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.35);
}

.btn.primary {
  background: white;
  color: #204888;
}

.btn.primary:hover {
  background: #e2e8f0;
}

/* checkbox */
label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  margin-bottom: 10px;
  font-size: 14px;
}

input[type='checkbox'] {
  width: 16px;
  height: 16px;
}
</style>
