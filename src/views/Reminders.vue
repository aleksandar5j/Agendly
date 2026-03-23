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

        <div class="input-with-icon">
          <img src="/src/components/icons/title.png" alt="Description Icon" class="input-icon" />
          <select v-model="tsk_id" class="modal-select">
            <option value="">Select Task</option>
            <option v-for="task in tasks" :key="task.tsk_id" :value="task.tsk_id">
              {{ task.tsk_title }}
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
            placeholder="Minutes before"
            class="modal-input"
          />
        </div>

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
        <div class="input-with-icon">
          <img
            src="/src/components/icons/setreminder.png"
            alt="Description Icon"
            class="input-icon"
          />
          <input
            type="number"
            v-model="rem_minutes_before"
            placeholder="Minutes before"
            class="modal-input"
          />
        </div>

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

  <div v-if="popup.show" :class="['popup', popup.type]">
    {{ popup.message }}
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
    console.log(res.data)
    tsk_id.value = ''
    rem_minutes_before.value = ''
    showModal.value = false

    triggerSuccess('Reminder edited succesfully')
    await reminderStore.loadReminders()
    await reminderStore.updateActiveReminders()
  } catch (error) {
    console.log(error)
    triggerError('Cannot edit this reminder')
  }
}

async function confirmDelete() {
  try {
    await api.deleteReminder(reminderToDelete.value.rem_id)

    await reminderStore.loadReminders()
    await reminderStore.updateActiveReminders()

    showDeleteModal.value = false

    triggerSuccess('Reminder deleted succesfully')
  } catch (error) {
    console.log(error)
    triggerError('Cannot delete this reminder')
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
    await reminderStore.loadReminders()
    await reminderStore.updateActiveReminders()
    await reminderStore.checkReminders()
    triggerSuccess('Reminder added succesfully')
  } catch (error) {
    console.log(error)

    const msg =
      error?.response?.data?.data?.message ||
      error?.response?.data.data ||
      'Cannot add a reminder for task'

    triggerError(msg)

    showAddModal.value = false
    tsk_id.value = ''
    rem_minutes_before.value = ''
  }
}

onMounted(() => {
  getReminders()
  getTasks()
  getCategories()
  getStatuses()

  reminderStore.updateActiveReminders()

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
.reminders-page {
  padding: 40px 80px;
  background: var(--bg-main);
  color: var(--text-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
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

.filters {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.filters h1,
.filters h2 {
  font-weight: bold;
  font-size: 40px;
  text-align: center;
}

.filters h1 strong {
  color: green;
}

.filters h2 span {
  color: #3b82f6;
}

.reminders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  gap: 16px;
  justify-content: start; /* Kartice idu levo na desktopu */
}

.reminder-card {
  padding: 16px;
  border-radius: 16px;
  background: var(--reminder-card);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.reminder-card:hover {
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.5);
  background: rgba(241, 27, 27, 0.1);
  transform: translateY(-2px);
}

.reminder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.reminder-bell {
  height: 70px;
  filter: var(--icon-filter);
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
  color: var(--text-color);
  text-align: center;
}

.reminder-card p {
  margin: 4px 0;
  font-size: 14px;
  opacity: 0.9;
}

.reminder-actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
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

.edit-btn {
  background: rgba(59, 130, 246, 0.9);
  color: #fff;
}

.edit-btn:hover {
  background: #3b82f6;
  transform: scale(1.1);
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

.add-card {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--hover-bg);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-direction: column;
  gap: 10px;
}

.add-card:hover {
  background: var(--reminder-card-hover);
  transform: translateY(-4px);
}

.add-card .reminder-title {
  color: var(--text-color);
  font-weight: bold;
  text-align: center;
}

.add-card img {
  height: 40px;
}

.noresult {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 70vh;
  margin-top: 40px;
  gap: 20px;
}

.noresult img {
  height: 400px;
  filter: var(--icon-color);
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

/* MODALS */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  z-index: 1000;
}

.modal {
  background: var(--addreminder-popup);
  color: var(--text-color);
  padding: 20px;
  border-radius: 14px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.cancel {
  background: #6b7280;
  color: white;
}

.cancel:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.save {
  background: #3b82f6;
  color: white;
}

.save:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* DELETE MODAL */
.delete-modal {
  background: var(--card-bg);
  color: var(--text-color);
  padding: 40px;
  border-radius: 14px;
  text-align: center;
}

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

/* INPUTS */
.input-with-icon {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.input-icon {
  height: 22px;
  filter: var(--icon-filter);
}

.modal-input,
.modal-select {
  width: 100%;
  padding: 10px 12px;
  height: 42px;
  box-sizing: border-box;
  border-radius: 10px;
  background: var(--input-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}

.modal-input::placeholder {
  color: var(--text-color);
}

.modal-input:hover,
.modal-select:hover {
  border-color: #4b5563;
}

.modal-input:focus,
.modal-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.modal-select option {
  background: var(--card-bg);
  color: var(--text-color);
}

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

/* POPUPS */
.popup {
  position: fixed;
  top: 25px;
  right: 25px;
  padding: 14px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
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

.input-with-icon {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.input-icon {
  height: 22px;
  filter: var(--icon-filter);
}

html,
body {
  background: var(--bg-main);
  margin: 0;
  padding: 0;
}

@media (max-width: 500px) {
  .reminders-page {
    padding: 10px;
    -webkit-overflow-scrolling: touch;
    backdrop-filter: blur(20px);
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

  .filters h1 {
    font-size: 15px;
  }

  .reminders-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .reminder-card {
    padding: 10px;
    border-radius: 10px;
    gap: 6px;
  }

  .reminder-bell {
    height: 55px;
  }

  .reminder-title {
    font-size: 14px;
  }

  .reminder-card p {
    font-size: 12px;
  }

  .reminder-actions {
    gap: 5px;
  }

  .edit-btn,
  .delete-btn {
    width: 26px;
    height: 26px;
    font-size: 13px;
  }

  .add-card img {
    height: 32px;
  }

  .noresult img {
    height: 230px;
  }

  .noresult button {
    padding: 10px 18px;
    font-size: 13px;
  }

  .modal {
    max-width: 320px;
    padding: 14px;
    margin: 10px;
  }

  .modal-input,
  .modal-select {
    height: 34px;
    font-size: 13px;
  }

  .popup {
    top: 12px;
    right: 12px;
    padding: 10px 14px;
    font-size: 12px;
  }

  .delete-modal {
    padding: 24px;
    max-width: 300px;
    margin: 10px;
  }
}
</style>
