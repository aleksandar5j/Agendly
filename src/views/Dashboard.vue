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

  <div v-if="taskModal.showModal" class="modal-overlay">
    <div class="modal">
      <div class="modal-header" :style="{ background: taskModal.selectedTask?.color || '#2563eb' }">
        <h2>{{ taskModal.selectedTask.category }}</h2>
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
          <p>- No document for this task!</p>
        </div>

        <div class="div-select">
          <p>Mark task</p>
          <select v-model="taskModal.newStatus" class="modal-select">
            <option v-for="status in statuses" :key="status.sts_id" :value="status.sts_id">
              {{ status.sts_name }}
            </option>
          </select>
        </div>

        <div v-if="taskModal.newStatus === 5" class="done-warning">
          <p>This task is marked as Done.</p>
          <p>Do you want to delete it or keep it?</p>
        </div>

        <div class="modal-actions">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

const statuses = ref([])

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

    taskModal.closeTaskModal()
    getTasks()
    reminderStore.loadLateTasks()
    reminderStore.loadReminders()
  } catch (err) {
    console.log(err)
  }
}

async function deleteTask() {
  try {
    if (!taskModal.selectedTask) return

    await api.deleteTask(session.sid, taskModal.selectedTask.id)
    taskModal.closeTaskModal()
    getTasks()
    reminderStore.loadLateTasks()
    reminderStore.loadReminders()
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  getTasks()
  getStatuses()
})
</script>

<style scoped>
.dashboard {
  padding: 40px 80px;
  min-height: 100vh;

  background: linear-gradient(to bottom, rgb(35, 57, 117), rgb(53, 93, 156));
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
  background: rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  transition: 0.3s ease;
  color: white;
  text-align: center;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(37, 99, 235, 0.6);
}

.info-card span {
  font-size: 16px;
  font-weight: bold;
  opacity: 0.9;
  letter-spacing: 0.5px;
  color: white;
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

.today-title {
  font-size: 40px;
  font-weight: bold;
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

  border-radius: 20px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.fc-event-title {
  margin: 20px;
  color: white;
}

.fc-toolbar-title {
  font-size: 22px;
  color: rgb(255, 255, 255);
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
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
  padding: 30px 24px;
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
.modal-select option {
  background: #1f2937;
  color: white;
}

.done-warning {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.5);
  font-size: 14px;
  background: rgba(239, 68, 68, 0.1);
}

.modal-actions {
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
  filter: brightness(0) invert(1);
}
.head h1 {
  font-weight: bold;
  font-size: 33px;
  color: white;
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
  background: rgba(30, 41, 59, 0.95);
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
</style>
