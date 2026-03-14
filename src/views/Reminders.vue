<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="reminders-page">
    <div class="head">
      <img src="/src/components/icons/bell.png" />
      <h1>My Reminders</h1>
    </div>

    <div class="filters" v-if="reminders.length">
      <h1><strong style="color: green; font-weight: bold">Active</strong> reminders</h1>
    </div>

    <div v-if="reminders.length" class="reminders-grid">
      <div
        v-for="rem in reminders"
        :key="rem.rem_id"
        class="reminder-card"
        @click="openTaskInDashboard(rem)"
      >
        <div class="reminder-content">
          <img src="/src/components/icons/bell.png" class="reminder-bell" />
          <h3 class="reminder-title">{{ rem.tsk_title }}</h3>
          <p>{{ rem.rem_minutes_before }} minutes before</p>
          <div class="reminder-actions">
            <button class="edit-btn" @click.stop="openEditModal(rem)">✎</button>
            <button class="delete-btn" @click.stop="openDeleteModal(rem)">✕</button>
          </div>
        </div>
      </div>

      <!-- DUGME KAO KARTICA -->
      <div class="reminder-card add-card" @click="openAddModal">
        <div class="reminder-content">
          <h3 class="reminder-title">Add Reminder</h3>
          <img src="/src/components/icons/add.png" alt="Add reminder" />
        </div>
      </div>
    </div>
    <div v-else class="noresult">
      <img src="/src/components/icons/noremindersss.png" class="no-results" />
      <button @click="openAddModal">Add reminder</button>
    </div>

    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <h2>Add Reminder</h2>

        <select v-model="tsk_id" class="modal-select">
          <option value="">Select Task</option>
          <option v-for="task in tasks" :key="task.tsk_id" :value="task.tsk_id">
            {{ task.tsk_title }}
          </option>
        </select>

        <input
          type="number"
          v-model="rem_minutes_before"
          placeholder="Minutes before"
          class="modal-input"
        />

        <div class="modal-actions">
          <button class="cancel" @click="closeModal">Cancel</button>
          <button class="save" @click="addReminder">Add</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Edit Reminder</h2>

        <label>Change minutes before</label>
        <input
          type="number"
          v-model="rem_minutes_before"
          placeholder="Minutes before"
          class="modal-input"
        />

        <div class="modal-actions">
          <button class="cancel" @click="closeModal">Cancel</button>
          <button class="save" @click="edittReminder">Save</button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="delete-modal">
        <h3>Delete Reminder</h3>
        <p>Are you sure?</p>
        <div class="delete-actions">
          <button class="cancel" @click="showDeleteModal = false">Cancel</button>
          <button class="delete-confirm" @click="confirmDelete">Delete</button>
        </div>
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
const taskModal = useTaskModalStore()

import { useRouter } from 'vue-router'

const router = useRouter()

function openTaskInDashboard(rem) {
  const task = {
    id: rem.tsk_id,
    title: rem.tsk_title,
    description: rem.tsk_description,
    category: rem.cat_name,
    time: rem.tsk_time,
    date: rem.tsk_date,
    status: rem.sts_id,
    color: rem.cat_color,
    fileName: rem.atc_file_name,
    file: rem.atc_file,
  }

  taskModal.openTask(task)

  router.push('/dashboard')
}

const reminderStore = useReminderStore()

const reminders = computed(() => reminderStore.reminders)

const session = useSessionStore()

const tasks = ref([])
const categories = ref([])
const statuses = ref([])

const tsk_id = ref('')
const rem_minutes_before = ref('')
const editReminder = ref(null)

const showModal = ref(false)
const showDeleteModal = ref(false)
const reminderToDelete = ref(null)

const showAddModal = ref(false)

function openAddModal() {
  showAddModal.value = true
}

async function getReminders() {
  await reminderStore.loadReminders()
}

async function getTasks() {
  const res = await api.userTasks(session.sid)
  tasks.value = res.data.data
}

async function getCategories() {
  const res = await api.getCategories()
  categories.value = res.data.data
}

async function getStatuses() {
  const res = await api.getStatuses()
  statuses.value = res.data.data
}

function openDeleteModal(rem) {
  reminderToDelete.value = rem
  showDeleteModal.value = true
}

async function edittReminder() {
  try {
    const payload = {
      rem_id: editReminder.value.rem_id,
      rem_minutes_before: rem_minutes_before.value,
    }

    const res = await api.editReminder(payload)
    await reminderStore.loadReminders()
    console.log(res.data)
    tsk_id.value = ''
    rem_minutes_before.value = ''
    showModal.value = false
  } catch (error) {
    console.log(error)
  }
}

async function confirmDelete() {
  try {
    await api.deleteReminder(reminderToDelete.value.rem_id)

    await reminderStore.loadReminders()

    showDeleteModal.value = false
  } catch (error) {
    console.log(error)
  }
}

async function addReminder() {
  try {
    await api.addReminder({
      tsk_id: tsk_id.value,
      rem_minutes_before: rem_minutes_before.value,
    })

    await getReminders()
    tsk_id.value = ''
    rem_minutes_before.value = ''
    showAddModal.value = false
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getReminders()
  getTasks()
  getCategories()
  getStatuses()
  reminderStore.startAutoDelete()
})

function openEditModal(rem) {
  editReminder.value = rem
  rem_minutes_before.value = rem.rem_minutes_before
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  showAddModal.value = false
}
</script>

<style scoped>
.reminders-page {
  padding: 40px 80px;
  background: linear-gradient(135deg, #46638b, #26344b);
  color: white;
  min-height: 100vh;
}
.head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}
.head img {
  height: 40px;
  filter: invert(1);
}
.head h1 {
  font-size: 28px;
  font-weight: bold;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin: 50px;
}

.filters h1 {
  font-weight: bold;
}

.reminders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 40px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #1f2937;
  padding: 20px;
  border-radius: 14px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.delete-modal {
  background: #111827;
  padding: 40px;
  border-radius: 14px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.modal-actions button {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* CANCEL */
.cancel {
  background: #6b7280;
  color: white;
}

.cancel:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

/* SAVE / ADD */
.save {
  background: #3b82f6;
  color: white;
}

.save:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* DELETE MODAL */
.delete-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 15px;
}

.delete-actions button {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-confirm {
  background: #ef4444;
  color: white;
}

.delete-confirm:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.reminder-card {
  padding: 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
  transition: all 0.25s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
}

.reminder-card:hover {
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.5);
  background: rgba(241, 27, 27, 0.1);
}

.reminder-content {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

.reminder-bell {
  height: 70px;
  filter: invert(1);
}
@keyframes bell-shake {
  0% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(15deg);
  }
  30% {
    transform: rotate(-10deg);
  }
  45% {
    transform: rotate(15deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.reminder-card:hover .reminder-bell {
  animation: bell-shake 0.6s ease-in-out;
}

.reminder-title {
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-align: center;
}

.edit-btn {
  background: rgba(59, 130, 246, 0.25);
  color: #60a5fa;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
}

.reminder-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reminder-header h3 {
  font-size: 18px;
  font-weight: bold;
}

.reminder-actions {
  display: flex;
  gap: 8px;
}

.delete-btn {
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.delete-btn {
  background: rgba(239, 68, 68, 0.25);
  color: #f87171;
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1);
}

.reminder-card p {
  margin: 4px 0;
  font-size: 14px;
  opacity: 0.9;
}

.noresult {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 70vh;
  margin-top: 50px;
  gap: 20px;
}

.noresult img {
  height: 400px;
}

.noresult button {
  padding: 15px 25px;
  border-radius: 10px;
  border: none;
  background: #3b82f6;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.noresult button:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.add-card {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(59, 130, 246, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-card:hover {
  background: rgba(59, 130, 246, 0.6);
  transform: translateY(-4px);
}

.add-card .reminder-title {
  color: white;
  font-weight: bold;
  text-align: center;
}

.add-card img {
  height: 40px;
}

.delete-btn {
  background: #ef4444;
  color: #ffffff;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  transform: scale(1.1);
  background: #dc2626;
  color: white;
}

.modal-input,
.modal-select {
  width: 100%;
  padding: 10px 12px;
  height: 42px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #374151;
  background: #111827;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

/* placeholder */
.modal-input::placeholder {
  color: #9ca3af;
}

/* hover */
.modal-input:hover,
.modal-select:hover {
  border-color: #4b5563;
}

/* focus */
.modal-input:focus,
.modal-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

/* select dropdown */
.modal-select option {
  background: #111827;
  color: white;
}

/* uklanja spinner za number */
.modal-input::-webkit-outer-spin-button,
.modal-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.modal-input[type='number'] {
  -moz-appearance: textfield;
}

.modal-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
</style>
