<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dashboard">
    <div class="head">
      <img src="/src/components/icons/dashboard.png" />
      <h1>My Dashboard</h1>
    </div>
    <div class="info">
      <div class="info-card task-left" style="margin-top: 10px">
        <span
          ><h1 class="today-title">
            You have
            <strong style="color: #f39c12; font-weight: bold">{{ tasksToday }}</strong> tasks ToDo
            today!
          </h1></span
        >
      </div>

      <div class="info-card">
        <span>This month</span>
        <h2>{{ tasksDoneThisMonth }}</h2>
        <p>tasks done</p>
      </div>

      <div class="info-card late">
        <h2>{{ tasksLates }}</h2>
        <span>Tasks <span style="color: red; font-weight: bold">late</span></span>
      </div>
    </div>
    <div class="calendar-container">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>

  <div v-if="taskModal.showModal" class="modal-overlayy">
    <div class="modall">
      <div class="modal-header" :style="{ background: taskModal.selectedTask?.color || '#2563eb' }">
        <h2>{{ taskModal.selectedTask.category }}</h2>
      </div>

      <div v-if="isTaskLate" class="late-notice">
        <img src="/src/components/icons/overdue.png" />
        Task late!
      </div>

      <div class="modal-content">
        <h2 style="font-weight: bold">{{ taskModal.selectedTask.title }}</h2>
        <p>{{ taskModal.selectedTask.description }}</p>
        <h3>ToDo until {{ taskModal.selectedTask.date }} • {{ taskModal.selectedTask.time }}</h3>

        <div v-if="taskModal.selectedTask.fileName" class="attachment">
          <p>Document {{ taskModal.selectedTask.fileName }}</p>
          <button @click="downloadFile" class="download">Download</button>
        </div>

        <div v-else>
          <p style="opacity: 0.5">- No document for this task!</p>
        </div>

        <div>
          <input
            type="number"
            placeholder="Set reminder (minutes before)"
            v-model="rem_minutes_beforee"
            class="modal-input"
            style="margin-top: 20px"
          />
        </div>

        <div>
          <p>Mark task</p>
          <select v-model="taskModal.newStatus" class="modal-select" style="color: white">
            <option v-for="status in statuses" :key="status.sts_id" :value="status.sts_id">
              {{ status.sts_name }}
            </option>
          </select>
        </div>

        <div v-if="taskModal.newStatus === 5" class="done-warning">
          <p>This task is marked as Done.</p>
          <p>Do you want to delete it or keep it?</p>
        </div>

        <div class="modal-actionss">
          <button class="cancel" @click="taskModal.closeTaskModal()">Cancel</button>
          <button v-if="taskModal.newStatus != 5" class="save" @click="updateStatus">Save</button>
          <button v-if="taskModal.newStatus == 5" class="save" @click="updateStatus">Keep</button>
          <button v-if="taskModal.newStatus == 5" class="delete" @click="deleteTask()">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="popup.show" :class="['popup', popup.type]">
    {{ popup.message }}
  </div>

  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <div class="input-with-icon">
        <h2 style="color: var(--text-color); margin-left: 40px">✚ Create task</h2>
      </div>

      <div class="input-with-icon">
        <img src="/src/components/icons/title.png" alt="Description Icon" class="input-icon" />
        <input v-model="title" placeholder="Title" class="modal-input" />
      </div>

      <div class="input-with-icon">
        <img src="/src/components/icons/desc.png" alt="Description Icon" class="input-icon" />
        <textarea v-model="description" placeholder="Description" class="modal-textarea"></textarea>
      </div>

      <div class="input-with-icon">
        <img src="/src/components/icons/calendar.png" alt="Description Icon" class="input-icon" />
        <input type="date" v-model="date" class="modal-input modern-date" />
      </div>

      <div class="input-with-icon">
        <img src="/src/components/icons/time.png" alt="Description Icon" class="input-icon" />
        <input type="time" v-model="time" class="modal-input modern-time" />
      </div>

      <div class="input-with-icon">
        <img src="/src/components/icons/select.png" alt="Description Icon" class="input-icon" />
        <select v-model="cat_id" class="modal-input modal-select">
          <option disabled value="">Select category</option>
          <option v-for="cat in categories" :key="cat.cat_id" :value="cat.cat_id">
            {{ cat.cat_name }}
          </option>
        </select>
      </div>

      <div class="input-with-icon">
        <img
          src="/src/components/icons/setreminder.png"
          alt="Description Icon"
          class="input-icon"
        />
        <input
          type="number"
          v-model="rem_minutes_before"
          class="modal-input modern-date"
          placeholder="Set reminder (minutes before)"
        />
      </div>

      <div class="input-with-icon">
        <img src="/src/components/icons/addfile.png" alt="Description Icon" class="input-icon" />
        <label class="file-upload">
          Attach file
          <input type="file" @change="onFileChange" hidden />
        </label>
        <span v-if="file" style="margin-left: 12px; color: var(--text-color); font-weight: 500">
          {{ file.name }}
        </span>
      </div>

      <div class="modal-actions">
        <button class="cancel" @click="closeModal">Cancel</button>
        <button class="save" @click="saveTask">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api'

import { useSessionStore } from '@/stores/sessionUser'
import { useReminderStore } from '@/stores/reminders'
import { useTaskModalStore } from '@/stores/taskModal'

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'

const taskModal = useTaskModalStore()
const session = useSessionStore()
const reminderStore = useReminderStore()

const tasks = ref([])
const categories = ref([])
const overdueTasks = ref([])
const statuses = ref([])

const title = ref('')
const description = ref('')
const date = ref()
const time = ref()
const cat_id = ref()
const file = ref(null)
const rem_minutes_before = ref()

const rem_minutes_beforee = ref()

const showModal = ref(false)

function openAddModal() {
  resetForm()
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function onFileChange(e) {
  file.value = e.target.files[0]
}

async function saveTask() {
  try {
    const fd = new FormData()
    fd.append('title', title.value)
    fd.append('description', description.value)
    fd.append('date', date.value)
    fd.append('time', time.value)
    fd.append('cat_id', Number(cat_id.value))
    fd.append('sid', session.sid)

    if (rem_minutes_before.value) {
      fd.append('rem_minutes_before', rem_minutes_before.value)
    }

    if (file.value) {
      fd.append('file', file.value)
      fd.append('file_name', file.value.name)
    }
    await api.postTask(fd)
    showModal.value = false
    file.value = null
    getTasks()
    await reminderStore.loadLateTasks()
    getOverdueTasks()
    await reminderStore.loadReminders()
    await reminderStore.updateActiveReminders()
    await reminderStore.checkReminders()
    resetForm()
    triggerSuccess('New task created successfully')
  } catch (error) {
    console.log(error)
    triggerError('Cannot create new task')
  }
}

async function getOverdueTasks() {
  try {
    const res = await api.tasksLate(session.sid)
    overdueTasks.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

async function gettTasks() {
  const res = await api.userAllTasks(session.sid)
  tasks.value = res.data.data
}
async function getCategories() {
  const res = await api.getCategories()
  categories.value = res.data.data
}
async function gettStatuses() {
  const res = await api.getStatuses()
  statuses.value = res.data.data
}

onMounted(() => {
  gettTasks()
  getCategories()
  gettStatuses()
  getOverdueTasks()
})

function resetForm() {
  title.value = ''
  description.value = ''
  date.value = ''
  time.value = ''
  cat_id.value = ''
  file.value = null
  rem_minutes_before.value = ''
}

function downloadFile() {
  if (!taskModal.selectedTask) return

  const base64 = taskModal.selectedTask.file
  const filename = taskModal.selectedTask.fileName

  const byteCharacters = atob(base64)
  const byteNumbers = Array.from(byteCharacters, (c) => c.charCodeAt(0))
  const byteArray = new Uint8Array(byteNumbers)

  const ext = filename.split('.').pop().toLowerCase()
  const mimeTypes = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    pdf: 'application/pdf',
    txt: 'text/plain',
  }
  const mimeType = mimeTypes[ext] || 'application/octet-stream'

  const blob = new Blob([byteArray], { type: mimeType })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()

  URL.revokeObjectURL(link.href)
}

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',

  dayMaxEvents: 2,
  moreLinkClick: 'popover',

  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'createTask',
  },

  customButtons: {
    createTask: {
      text: '✚ Create',
      click() {
        openAddModal()
      },
    },
  },

  events: [],
  eventClick: (info) => {
    const task = {
      id: info.event.extendedProps.id,
      title: info.event.title,
      description: info.event.extendedProps.description,
      category: info.event.extendedProps.category,
      time: info.event.extendedProps.time,
      date: info.event.startStr,
      status: info.event.extendedProps.status,
      color: info.event.extendedProps.color,
      fileName: info.event.extendedProps.fileName,
      file: info.event.extendedProps.file,
    }

    taskModal.openTask(task)
  },
})

const tasksDoneThisMonth = ref()
const tasksLates = ref()
const tasksToday = ref()

async function getTasks() {
  try {
    const res = await api.userTasks(session.sid)
    tasks.value = res.data.data

    calendarOptions.value.events = tasks.value.map((task) => ({
      title: task.tsk_title,
      date: task.tsk_date,
      time: task.tsk_time,
      backgroundColor: task.cat_color,
      borderColor: 'transparent',
      textColor: '#fff',
      extendedProps: {
        category: task.cat_name,
        description: task.tsk_description,
        id: task.tsk_id,
        status: task.sts_id,
        color: task.cat_color,
        fileName: task.atc_file_name,
        file: task.atc_file,
      },
    }))

    const res1 = await api.tasksDoneThisMonth(session.sid)
    tasksDoneThisMonth.value = res1.data.data.doneThisMonth
    tasksLates.value = res1.data.data.tasksLate
    tasksToday.value = res1.data.data.tasksForToday
  } catch (err) {
    console.log(err)
  }
}

async function getStatuses() {
  const res = await api.getStatuses()
  statuses.value = res.data.data
}

async function updateStatus() {
  try {
    if (!taskModal.selectedTask) return

    await api.updateTaskStatus(session.sid, taskModal.selectedTask.id, taskModal.newStatus)

    if (rem_minutes_beforee.value) {
      const res = await api.addReminder({
        tsk_id: taskModal.selectedTask.id,
        rem_minutes_before: rem_minutes_beforee.value,
      })
      console.log(res.data)
    }

    triggerSuccess(`Task status successfully updated`)

    taskModal.closeTaskModal()
    getTasks()
    await reminderStore.loadLateTasks()
    await reminderStore.loadReminders()
    await reminderStore.updateActiveReminders()
    await reminderStore.checkReminders()
  } catch (err) {
    console.log(err)
    triggerError('Failed to update task')
  }
}

async function deleteTask() {
  try {
    if (!taskModal.selectedTask) return

    await api.deleteTask(session.sid, taskModal.selectedTask.id)
    triggerSuccess(`Task "${taskModal.selectedTask.title}" successfully deleted`)
    taskModal.closeTaskModal()
    getTasks()
    reminderStore.loadLateTasks()
    reminderStore.loadReminders()
  } catch (err) {
    console.log(err)
    triggerError('Failed to delete task')
  }
}

const isTaskLate = computed(() => {
  if (!taskModal.selectedTask) return false

  const taskDateTime = new Date(`${taskModal.selectedTask.date}T${taskModal.selectedTask.time}`)
  const now = new Date()

  return taskDateTime < now
})

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

onMounted(() => {
  getTasks()
  getStatuses()
})
</script>

<style scoped>
html,
body {
  background: var(--bg-main);
  margin: 0;
  padding: 0;
}

.dashboard {
  padding: 40px 80px;
  min-height: 100vh;

  background: var(--bg-main);
}

.info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  margin-bottom: 35px;
  max-width: 1045px;
  margin-inline: auto;
}

.info-card {
  backdrop-filter: blur(14px);
  background: var(--infocard-color);
  border-radius: 18px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: 0.3s ease;
  color: var(--text-color);
  text-align: center;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 60px rgba(37, 99, 235, 0.6);
}

.info-card span {
  font-size: 16px;
  font-weight: bold;
  opacity: 0.9;
  letter-spacing: 0.5px;
  color: var(--text-color);
}

.info-card.task-left {
  grid-column: span 2;
}

.task-left:hover {
  box-shadow: 0 20px 60px rgba(243, 156, 18, 0.3);
}

.info-card h2 {
  margin: 10px 0 6px;
  font-size: 36px;
  font-weight: 700;
}

.info-card p {
  font-size: 13px;
  opacity: 0.7;
}

.info-card.late {
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.info-card.late:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(239, 68, 68, 0.6);
}

.calendar-container {
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--infocard-color);
  border-radius: 18px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.fc-event-title {
  margin: 20px;
  color: white;
}

:deep(.fc-toolbar-title) {
  color: var(--text-color) !important;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0, 0.6);
  font-size: 20px;
  margin: 5px;
}

.fc-theme-standard td,
.fc-theme-standard th {
  border: 1px solid rgba(255, 255, 255, 5, 0.22);
}

.fc-button {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  border: none !important;
  padding: 6px 16px !important;
  border-radius: 12px !important;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.6);
  transition: 0.2s;
}

.fc-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.9);
}

.fc-button-primary {
  background: #3b82f6;
  border: none;

  transition: 0.2s;
}

.fc-button-primary:hover {
  background: #2563eb;
}

.fc-daygrid-day {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: 0.2s;
  cursor: pointer;
}

.fc-daygrid-day-frame {
  padding: 20px;
}

.fc-daygrid-day:hover {
  background: rgba(59, 130, 246, 0.15);
}

.fc-daygrid-day-number {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.fc-day-today {
  background: rgba(37, 99, 235, 0.3) !important;
  box-shadow: inset 0 0 15px rgba(37, 99, 235, 0.8);
  cursor: pointer;
}

.fc-col-header-cell-cushion {
  color: #ffffff;
  font-weight: 600;
  padding: 8px 0;
  font-size: 12px;
  letter-spacing: 0.6px;
}

.fc-daygrid-event {
  border-radius: 12px !important;
  padding: 6px 10px !important;
  margin: 6px 6px 4px 6px !important;

  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(6px);

  border: none !important;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: 0.2s ease;
}

.fc-daygrid-event:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.6);
}

.fc-daygrid-day-events {
  padding: 4px 6px 8px 6px;
}

.modal-overlayy {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modall {
  width: 480px;
  max-width: 90%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(14px);
  color: white;
  font-family: Inter, Arial, sans-serif;
}

.modal-header {
  padding: 20px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.modal-content {
  background: rgba(255, 255, 255, 0.1);
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0 0 20px 20px;
}

.modal p {
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 6px;
}

.attachment {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 12px;
}

.download {
  background: white;
  color: #1e3a8a;
  border: none;
  padding: 6px 14px;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  max-width: 150px;
}
.download:hover {
  background: #b8b8b8;
}

.modal-select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 14px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  cursor: pointer;
}

.modal-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-left: 12px;
  background: var(--dashboard-inputs);
}

.modal-select:hover {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px rgba(133, 133, 133, 0.7);
}
.modal-select:focus {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 20px rgba(133, 133, 133, 0.7);
  transform: scale(1.02);
}

.done-warning {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.5);
  font-size: 14px;
  background: rgba(239, 68, 68, 0.1);
}

.modal-actionss {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.cancel {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  border: 0;
  border-radius: 10px;
  padding: 10px 15px;
  font-size: 15px;
  font-weight: bold;
}
.cancel:hover {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 25px rgba(133, 133, 133, 0.7);
}

.save {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 0;
  border-radius: 10px;
  padding: 10px 15px;
  font-size: 15px;
  font-weight: bold;
}
.save:hover {
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.9);
}

.delete {
  background: #ef4444;
  color: white;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 0;
  border-radius: 10px;
  padding: 10px 15px;
  font-size: 15px;
  font-weight: bold;
}
.delete:hover {
  background: #dc2626;
  box-shadow: 0 10px 25px rgba(235, 37, 37, 0.9);
}

.div-select {
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  padding: 10px;
  border-radius: 16px;
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

:deep(.fc-daygrid-more-link) {
  display: inline-block;
  margin: 4px 6px;
  padding: 4px 8px;

  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white !important;

  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
  text-align: center;

  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);
  transition: 0.2s ease;

  cursor: pointer;
}

:deep(.fc-daygrid-more-link:hover) {
  transform: translateY(-0.2px) scale(1.01);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.9);
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

:deep(.fc-popover) {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(14px);
  background: var(--infocard-color);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  color: white;
  overflow: hidden;
}

:deep(.fc-popover-header) {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-weight: bold;
  padding: 10px 14px;
  font-size: 14px;
  border: none;
}

:deep(.fc-popover-body) {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

:deep(.fc-popover-body .fc-event) {
  border-radius: 10px !important;
  padding: 6px 10px !important;
  font-size: 12px;
  font-weight: 600;

  backdrop-filter: blur(6px);
  border: none !important;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: 0.2s ease;
}

:deep(.fc-popover-body .fc-event:hover) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 5, 0.7);
}

:deep(.fc-popover-close) {
  color: white;
  font-size: 16px;
  opacity: 0.8;
  cursor: pointer;
}

:deep(.fc-popover-close:hover) {
  opacity: 1;
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

.calendar-header {
  max-width: 1000px;
  margin: 0 auto 5px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calendar-header h2 {
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.fc-toolbar-title {
  color: white;
}

:deep(.fc-createTask-button) {
  background: #5387d4 !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  border-radius: 18px !important;
  padding: 6px 16px !important;
  transition: 0.6s;
}

:deep(.fc-createTask-button:hover) {
  box-shadow: 0 10px 25px rgba(34, 118, 197, 0.7);
  background: #4a79be !important;
  transition: 0.3s;
}

:deep(.fc-prev-button) {
  background: #5387d4 !important;
  border: none !important;
  color: white !important;
  border-radius: 18px;
  margin-right: 3px;
}

:deep(.fc-next-button) {
  background: #5387d4 !important;
  border: none !important;
  color: white !important;
  border-radius: 18px;
}

:deep(.fc-prev-button:hover),
:deep(.fc-next-button:hover) {
  box-shadow: 0 10px 25px rgba(34, 118, 197, 0.7);
  background: #4a79be !important;
  transition: 0.3s;
}

:deep(.fc-toolbar-chunk) {
  display: flex;
  gap: 8px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal container */
.modal {
  background: var(--dashboard-add-popup);
  color: var(--text-color);
  padding: 30px;
  border-radius: 24px;
  width: 520px;
  max-width: 95%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  backdrop-filter: blur(20px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease;
}

.modal-select option {
  background: var(--dashboard-inputs);
  color: var(--text-color);
  border-radius: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.modal-input,
.modal-textarea,
.modal-select {
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  border: none;
  background: var(--dashboard-inputs);
  color: var(--text-color);
  font-size: 15px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
}

/* Placeholder */
.modal-input::placeholder,
.modal-textarea::placeholder {
  color: var(--text-color);
}

/* Focus effect */
.modal-input:focus,
.modal-textarea:focus,
.modal-select:focus,
.file-upload:focus {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  transform: scale(1.02);
}

/* Textarea */
.modal-textarea {
  height: 100px;
  resize: none;
  padding: 12px 18px;
}

/* Select */
.modal-select {
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding-left: 12px;
  background: var(--dashboard-inputs);
}

.modern-date,
.modern-time {
  -webkit-appearance: none; /* Chrome/Safari */
  -moz-appearance: none; /* Firefox */
  appearance: none; /* standard */
  position: relative;
}

/* File upload */
.file-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.8);
  color: white;
  font-weight: 600;
  cursor: pointer;
  padding: 0 18px;
  border-radius: 14px;
  height: 44px;
  transition: all 0.3s ease;
  text-align: center;
}

.file-upload:hover {
  background: rgba(59, 130, 246, 0.7);
  box-shadow: 0 0 18px rgba(59, 130, 246, 0.9);
}

/* Buttons */
.cancel {
  background: #6b7280;
}

.save {
  background: rgba(59, 130, 246, 0.8);
}

.cancel,
.save {
  border: none;
  padding: 10px 20px;
  border-radius: 14px;
  cursor: pointer;
  color: white;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cancel:hover {
  background: #4b5563;
}

.save:hover {
  background: rgba(59, 130, 246, 0.7);
}

.input-with-icon {
  display: flex;
  align-items: center;
  gap: 20px; /* razmak između ikone i inputa */
  margin-bottom: 15px;
}

.input-icon {
  height: 22px;
  filter: var(--icon-filter);
  opacity: 0.9;
}

.late-notice {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  font-weight: bold;
  padding: 10px;
  font-size: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.late-notice img {
  height: 35px;
}

@media (max-width: 500px) {
  .dashboard {
    padding: 12px;
    gap: 12px;
    background: var(--bg-main);
  }

  .head {
    margin-top: 15px;
  }

  .head img {
    height: 28px;
  }

  .head h1 {
    font-size: 22px;
  }

  .info {
    flex-direction: column;
    gap: 10px;
  }

  .info-card {
    padding: 10px;
    font-size: 13px;
    border-radius: 10px;
  }

  .info-card h1,
  .info-card h2 {
    font-size: 16px;
  }

  .info-card span,
  .info-card p {
    font-size: 12px;
  }

  .calendar-container {
    max-width: 100%;
    overflow-x: auto;
  }

  /* Modal za Task */
  .modall {
    max-width: 320px;
    padding: 12px;
  }

  .modal-header h2 {
    font-size: 16px;
  }

  .late-notice {
    font-size: 12px;
    gap: 6px;
  }

  .modal-content h2 {
    font-size: 16px;
  }

  .modal-content h3,
  .modal-content p {
    font-size: 13px;
  }

  .attachment p,
  .div-select p,
  .done-warning p {
    font-size: 12px;
  }

  .modal-select {
    font-size: 13px;
    padding: 6px 8px;
  }

  .modal-actionss button {
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 8px;
  }

  .modal {
    max-width: 280px;
    max-height: 50vh;
    padding: 20px;
    margin: 15px;
    overflow-y: auto;
  }

  .modal h2 {
    font-size: 16px;
  }

  .modal-input,
  .modal-textarea,
  .modern-date,
  .modern-time,
  .modal-select {
    font-size: 13px;
    padding: 8px 10px;
    height: 34px;
  }

  .modal-textarea {
    height: 70px;
  }

  .input-with-icon {
    gap: 10px;
  }

  .input-icon {
    height: 20px;
  }

  .file-upload {
    font-size: 12px;
    padding: 0 10px;
  }

  .modal-actions button {
    font-size: 12px;
    padding: 10px 15px;
  }

  .popup {
    top: 12px;
    right: 12px;
    font-size: 12px;
    padding: 10px 14px;
  }
}
</style>
