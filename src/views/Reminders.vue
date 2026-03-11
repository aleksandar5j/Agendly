<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="reminders-page">
    <div class="head">
      <img src="/src/components/icons/bell.png" />
      <h1>My Reminders</h1>
    </div>

    <div class="filters">
      <h1>Active reminders</h1>
    </div>

    <!-- Reminders list -->
    <div v-if="reminders.length" class="reminders-grid">
      <div
        v-for="rem in reminders"
        :key="rem.rem_id"
        class="reminder-card"
        :style="{ borderLeft: '6px solid ' + rem.cat_color }"
      >
        <div class="reminder-header">
          <h3>{{ rem.tsk_title }}</h3>
          <div class="reminder-actions">
            <button @click="openEditModal(rem)">✎</button>
            <button @click="openDeleteModal(rem.rem_id)">✕</button>
          </div>
        </div>

        <p>Task Date: {{ rem.tsk_date }} • {{ rem.tsk_time }}</p>
        <p>Category: {{ rem.cat_name }}</p>
        <p>Status: {{ rem.sts_name }}</p>
        <p>Reminder: {{ rem.rem_minutes_before }} minutes before</p>
      </div>
    </div>
    <img v-else src="/src/components/icons/noresult.png" class="no-results" />

    <!-- Modals for Add/Edit/Delete -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>{{ editReminder ? 'Edit' : 'Add' }} Reminder</h2>

        <select v-model="tsk_id" class="modal-select">
          <option disabled value="">Select Task</option>
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
          <button class="save" @click="saveReminder">Save</button>
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
import { ref, onMounted } from 'vue'
import api from '@/api'
import { useSessionStore } from '@/stores/sessionUser'

const session = useSessionStore()

const reminders = ref([])
const tasks = ref([])
const categories = ref([])
const statuses = ref([])

const tsk_id = ref('')
const rem_minutes_before = ref('')
const editReminder = ref(null)

const showModal = ref(false)
const showDeleteModal = ref(false)
const reminderToDelete = ref(null)

// Fetch initial data
async function getReminders() {
  const res = await api.getAllReminders(session.sid)
  reminders.value = res.data.data
}

async function getTasks() {
  const res = await api.userAllTasks(session.sid)
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

onMounted(() => {
  getReminders()
  getTasks()
  getCategories()
  getStatuses()
})

function openEditModal(rem) {
  editReminder.value = rem
  tsk_id.value = rem.tsk_id
  rem_minutes_before.value = rem.rem_minutes_before
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

// Save Add/Edit
async function saveReminder() {
  const data = {
    sid: session.sid,
    tsk_id: tsk_id.value,
    rem_minutes_before: rem_minutes_before.value,
  }
  if (editReminder.value) {
    data.rem_id = editReminder.value.rem_id
    await api.editReminder(data)
  } else {
    await api.addReminder(data)
  }
  closeModal()
  getReminders()
}

// Delete
function openDeleteModal(rem_id) {
  reminderToDelete.value = rem_id
  showDeleteModal.value = true
}

async function confirmDelete() {
  await api.deleteReminder(reminderToDelete.value, session.sid)
  reminders.value = reminders.value.filter((r) => r.rem_id !== reminderToDelete.value)
  showDeleteModal.value = false
}
</script>

<style scoped>
.reminders-page {
  padding: 40px;
  background: linear-gradient(135deg, #46638b, #26344b);
  color: white;
  min-height: 100vh;
}
.head {
  display: flex;
  align-items: center;
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
  gap: 12px;
  margin-bottom: 20px;
}
.filter-input,
.filter-select {
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.reminders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.reminder-card {
  padding: 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.cancel {
  background: #6b7280;
}
.save {
  background: #3b82f6;
}

.delete-modal {
  background: #111827;
  padding: 20px;
  border-radius: 14px;
  text-align: center;
}
.delete-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.delete-confirm {
  background: #ef4444;
  color: white;
  padding: 6px 12px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
