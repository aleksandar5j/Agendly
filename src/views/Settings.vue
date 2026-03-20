<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="settings-page">
    <div class="settings-card">
      <div class="avatar">
        {{ session.user.usr_username.charAt(0).toUpperCase() }}
      </div>

      <h2>{{ session.user.usr_username }}</h2>
      <p class="email">{{ session.user.usr_email }}</p>

      <div class="section">
        <h3>Change Password</h3>

        <input v-model="oldPassword" type="password" placeholder="Old password" />
        <input v-model="newPassword" type="password" placeholder="New password" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm password" />

        <button class="btn" @click="changePassword">Update Password</button>
      </div>

      <div class="section">
        <h3>Notifications</h3>
        <label class="toggle">
          <span>Task reminders</span>
          <input type="checkbox" v-model="reminderStore.reminderNotificationsEnabled" />
          <span class="slider"></span>
        </label>

        <label class="toggle">
          <span>Overdue task alerts</span>
          <input type="checkbox" v-model="reminderStore.overdueNotificationsEnabled" />
          <span class="slider"></span>
        </label>
      </div>

      <div class="section">
        <h3>Appearance</h3>

        <div class="theme-options">
          <div
            class="theme-card"
            :class="{ active: themeStore.theme === 'default' }"
            @click="setTheme('default')"
          >
            <div class="preview default"></div>
            <span>Default</span>
          </div>

          <div
            class="theme-card"
            :class="{ active: themeStore.theme === 'light' }"
            @click="setTheme('light')"
          >
            <div class="preview light"></div>
            <span>Light</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="popup.show" :class="['popup', popup.type]">
    {{ popup.message }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'
import { useThemeStore } from '@/stores/theme'
import { watch } from 'vue'

import { useSessionStore } from '@/stores/sessionUser'
import { useReminderStore } from '@/stores/reminders'

const themeStore = useThemeStore()
const reminderStore = useReminderStore()
const session = useSessionStore()

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const changePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    triggerError('All fields are required!')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    triggerError('Passwords do not match!')
    return
  }

  if (newPassword.value.length < 6) {
    triggerError('Password must be at least 6 characters!')
    return
  }

  try {
    await api.userUpdatePassword({
      sid: session.sid,
      old_password: oldPassword.value,
      new_password: newPassword.value,
    })

    triggerSuccess('Password updated successfully!')

    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    triggerError(err.response?.data.data || 'Error updating password')
  }
}

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

const setTheme = (theme) => {
  themeStore.setTheme(theme)
}

const popup = ref({
  show: false,
  type: 'success',
  message: '',
})

function triggerSuccess(message) {
  popup.value = {
    show: true,
    type: 'success',
    message,
  }

  setTimeout(() => {
    popup.value.show = false
  }, 3000)
}

function triggerError(message) {
  popup.value = {
    show: true,
    type: 'error',
    message,
  }

  setTimeout(() => {
    popup.value.show = false
  }, 3000)
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-main);
  padding: 20px;
}

.settings-card {
  width: 100%;
  max-width: 460px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  padding: 35px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.avatar {
  width: 100px;
  height: 100px;
  background: var(--settingpage-input);
  color: var(--text-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 40px;
  font-weight: bold;
}

h2 {
  color: var(--text-color);
  margin-bottom: 5px;
}

.email {
  color: var(--text-muted);
  margin-bottom: 30px;
}

.section {
  text-align: left;
  margin-bottom: 28px;
}

.section h3 {
  color: var(--text-color);
  margin-bottom: 12px;
  font-size: 16px;
}

input,
select {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
  background: var(--settingpage-input);
  color: var(--text-color);
  font-size: 14px;
  box-sizing: border-box;
}

input::placeholder {
  color: var(--text-color);
}

.btn {
  width: 100%;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: var(--btn-bg);
  color: var(--text-color);
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

.toggle {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-color);
  margin-bottom: 14px;
  font-size: 14px;
}

.toggle input {
  display: none;
}

.slider {
  position: relative;
  width: 46px;
  height: 24px;
  background: var(--toggle-bg);
  border-radius: 999px;
  cursor: pointer;
  transition: 0.3s;
}

.slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .slider {
  background: var(--toggle-active);
  box-shadow: 0 0 10px var(--toggle-glow);
}

.toggle input:checked + .slider::before {
  transform: translateX(22px);
}

.slider:hover {
  opacity: 0.85;
}

.toggle input:checked + .slider {
  box-shadow: 0 0 10px rgba(79, 172, 254, 0.6);
}

.popup {
  position: fixed;
  top: 25px;
  right: 25px;
  padding: 14px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0, 0.25);
  animation: slideIn 0.3s ease;
  z-index: 9999;
}

.popup.success {
  background: #27703a;
}

.popup.error {
  background: #e74c3c;
}

@keyframes slideIn {
  from {
    transform: translateX(120px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.theme-options {
  display: flex;
  gap: 12px;
}

.theme-card {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  background: var(--settingpage-input);
  cursor: pointer;
  transition: 0.25s;
  text-align: center;
  border: 2px solid transparent;
}

.theme-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}

.theme-card.active {
  border: 2px solid var(--toggle-active);
  box-shadow: 0 0 12px var(--toggle-glow);
}

.theme-card span {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-color);
}

.preview {
  width: 100%;
  height: 50px;
  border-radius: 8px;
}

.preview.default {
  background: linear-gradient(to bottom, rgb(93, 128, 202), rgb(32, 72, 136));
}

.preview.light {
  background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
}

@media (max-width: 600px) {
  .settings-page {
    align-items: flex-start;
    padding: 10px;
    -webkit-overflow-scrolling: touch;
    backdrop-filter: blur(20px);
  }

  .settings-card {
    max-width: 100%;
    padding: 20px 16px;
    border-radius: 16px;
  }

  .avatar {
    width: 80px;
    height: 80px;
    font-size: 32px;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 18px;
  }

  .email {
    font-size: 13px;
    margin-bottom: 20px;
  }

  .section {
    margin-bottom: 24px;
  }

  .section h3 {
    font-size: 14px;
    margin-bottom: 10px;
  }

  input {
    height: 45px;
    font-size: 15px;
    border-radius: 12px;
  }

  input:focus {
    box-shadow: 0 0 0 2px var(--toggle-active);
  }

  .btn {
    height: 48px;
    font-size: 15px;
    border-radius: 12px;
  }

  /* 👉 Sticky dugme (mnogo bolji UX na telefonu) */
  .btn {
    position: sticky;
    bottom: 10px;
  }

  /* TOGGLE */
  .toggle {
    font-size: 15px;
  }

  .slider {
    width: 50px;
    height: 26px;
  }

  .slider::before {
    width: 20px;
    height: 20px;
  }

  .toggle input:checked + .slider::before {
    transform: translateX(24px);
  }

  /* THEME CARDS */
  .theme-options {
    flex-direction: column;
    gap: 10px;
  }

  .theme-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
  }

  .theme-card span {
    font-size: 14px;
  }

  .preview {
    width: 70px;
    height: 40px;
  }

  .popup {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    top: 15px;
    width: 90%;
    text-align: center;
  }
}
</style>
