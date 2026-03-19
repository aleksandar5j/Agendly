<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="tasks-page">
    <!-- Header -->
    <div class="head">
      <img src="/src/components/icons/task.png" />
      <h1>My Tasks</h1>
    </div>

    <div class="header">
      <!-- Left: Add Task button -->

      <div class="filters">
        <input
          v-model="searchQuery"
          placeholder="Search task by title..."
          class="filter-input"
          @input="filterByTitle"
        />
        <select
          v-model="filterCategory"
          class="filter-select modal-select2"
          @change="filterByCategory"
        >
          <option value="">All categories</option>
          <option v-for="cat in categories" :key="cat.cat_id" :value="cat.cat_id">
            {{ cat.cat_name }}
          </option>
        </select>
        <select v-model="filterStatus" class="filter-select modal-select2" @change="filterByStatus">
          <option value="">All statuses</option>
          <option v-for="sts in statuses" :key="sts.sts_id" :value="sts.sts_id">
            {{ sts.sts_name }}
          </option>
        </select>
      </div>

      <div class="under-head">
        <button v-if="overdueTasks.length > 0" class="late-btn" @click="seeAllLateTasks">
          Overdue tasks ({{ overdueTasks.length }})
        </button>
      </div>

      <!-- Right: Filters -->
    </div>

    <!-- Tasks List -->
    <div class="tasks-grid" v-if="tasks.length">
      <div
        v-for="task in tasks"
        :key="task.tsk_id"
        class="task-card"
        :style="{ borderLeft: '6px solid ' + task.cat_color }"
      >
        <div class="task-header">
          <h3 style="color: var(--text-color)">{{ task.tsk_title }}</h3>
          <div class="task-actions">
            <button class="edit-btn" @click="openEditModal(task)">✎</button>
            <button class="delete-btn" @click="openDeleteModal(task.tsk_id)">✕</button>
          </div>
        </div>

        <p class="desc">{{ task.tsk_description }}</p>

        <p class="desc">
          Status: <strong style="color: brown">{{ task.sts_name }}</strong>
        </p>

        <div class="task-footer">
          <span style="color: var(--text-color)">{{ task.tsk_date }} • {{ task.tsk_time }}</span>
          <span class="category" :style="{ backgroundColor: task.cat_color }">
            {{ task.cat_name }}
          </span>
        </div>
      </div>
    </div>
    <div class="noresult" v-else>
      <img src="/src/components/icons/noresult.png" />
    </div>

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="delete-modal">
        <h3>Delete Task</h3>
        <p>Are you sure you want to delete this task?</p>

        <div class="delete-actions">
          <button class="cancel" @click="showDeleteModal = false">Cancel</button>
          <button class="delete-confirm" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal">
        <h2 style="color: var(--text-color)">Edit Task</h2>

        <div class="input-with-icon">
          <img src="/src/components/icons/title.png" alt="Description Icon" class="input-icon" />
          <input v-model="title" placeholder="Title" class="modal-input" />
        </div>

        <div class="input-with-icon">
          <img src="/src/components/icons/desc.png" alt="Description Icon" class="input-icon" />
          <textarea
            v-model="description"
            placeholder="Description"
            class="modal-textarea"
          ></textarea>
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
            src="/src/components/icons/donenotdone.png"
            alt="Description Icon"
            class="input-icon"
          />
          <select v-model="newStatus" class="modal-select">
            <option v-for="status in statuses" :key="status.sts_id" :value="status.sts_id">
              {{ status.sts_name }}
            </option>
          </select>
        </div>

        <!-- File -->
        <div class="input-with-icon">
          <img src="/src/components/icons/addfile.png" alt="Description Icon" class="input-icon" />
          <label class="file-upload">
            Attach file
            <input type="file" @change="onFileChange" hidden />
          </label>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button class="cancel" @click="showEditModal = false">Cancel</button>
          <button class="save" @click="saveEdit">Save</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="popup.show" :class="['popup', popup.type]">
    {{ popup.message }}
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import { useSessionStore } from '@/stores/sessionUser'
import { useReminderStore } from '@/stores/reminders'

const reminderStore = useReminderStore()

const session = useSessionStore()
const tasks = ref([])
const categories = ref([])
const statuses = ref([])

const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

const title = ref('')
const description = ref('')
const date = ref()
const time = ref()
const cat_id = ref()
const newStatus = ref(null)
const file = ref(null)

const showModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const taskToDelete = ref(null)
const editTask = ref(null)

const overdueTasks = ref([])

async function filterByTitle() {
  if (!searchQuery.value) {
    getTasks()
    return
  }
  try {
    const res = await api.filterTitle(searchQuery.value)
    tasks.value = res.data.data

    filterCategory.value = ''
    filterStatus.value = ''

    console.log(res.data)
  } catch (error) {
    console.log(error)
  }
}

async function seeAllLateTasks() {
  try {
    const res = await api.tasksLate(session.sid)
    console.log(res.data)
    tasks.value = res.data.data
  } catch (error) {
    console.log(error)
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

async function filterByStatus() {
  if (!filterStatus.value) {
    getTasks()
    return
  }
  try {
    const res = await api.filterStatus(filterStatus.value)
    tasks.value = res.data.data

    searchQuery.value = ''
  } catch (error) {
    console.log(error)
  }
}

async function filterByCategory() {
  if (!filterCategory.value) {
    getTasks()
    return
  }
  try {
    const res = await api.filterCategory(filterCategory.value)
    tasks.value = res.data.data

    searchQuery.value = ''
  } catch (error) {
    console.log(error)
  }
}

function closeModal() {
  showModal.value = false
  showEditModal.value = false
  resetForm()
}

function resetForm() {
  title.value = ''
  description.value = ''
  date.value = ''
  time.value = ''
  cat_id.value = ''
  newStatus.value = null
  file.value = null
  editTask.value = null
}

// GET TASKS / CATEGORIES / STATUSES
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
  getTasks()
  getCategories()
  getStatuses()
  getOverdueTasks()
})

// DELETE
function openDeleteModal(id) {
  taskToDelete.value = id
  showDeleteModal.value = true
}
async function confirmDelete() {
  try {
    await api.deleteTask(session.sid, taskToDelete.value)
    tasks.value = tasks.value.filter((t) => t.tsk_id !== taskToDelete.value)
    showDeleteModal.value = false
    taskToDelete.value = null
    getOverdueTasks()
    triggerSuccess(`Task successfully deleted`)
  } catch (error) {
    console.log(error)
    triggerError('Cannot delete task')
  }
}

// FILE CHANGE
function onFileChange(e) {
  file.value = e.target.files[0]
}

// ADD TASK
async function saveTask() {
  try {
    const fd = new FormData()
    fd.append('title', title.value)
    fd.append('description', description.value)
    fd.append('date', date.value)
    fd.append('time', time.value)
    fd.append('cat_id', Number(cat_id.value))
    fd.append('sid', session.sid)
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
    triggerSuccess('New task created successfully')
  } catch (error) {
    console.log(error)
    triggerError('Cannot create new task')
  }
}

// EDIT TASK
function openEditModal(task) {
  editTask.value = { ...task }
  title.value = task.tsk_title
  description.value = task.tsk_description
  date.value = task.tsk_date
  time.value = task.tsk_time
  cat_id.value = task.cat_id
  newStatus.value = task.sts_id
  showEditModal.value = true
}

async function saveEdit() {
  try {
    const fd = new FormData()
    fd.append('tsk_id', editTask.value.tsk_id)
    fd.append('title', title.value)
    fd.append('description', description.value)
    fd.append('date', date.value)
    fd.append('time', time.value)
    fd.append('cat_id', Number(cat_id.value))
    fd.append('status', newStatus.value)
    fd.append('sid', session.sid)
    if (file.value) {
      fd.append('file', file.value)
      fd.append('file_name', file.value.name)
    }
    await api.editTask(fd)
    showEditModal.value = false
    editTask.value = null
    file.value = null
    getTasks()

    triggerSuccess('Task edited successfully')

    await reminderStore.loadLateTasks()
    await reminderStore.loadReminders()
    getOverdueTasks()
  } catch (error) {
    console.log(error)
    triggerError('Cannot save edit for task')
  }
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
.tasks-page {
  padding: 40px 80px;
  min-height: 100vh;
  background: var(--bg-main);
  color: white;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.add-btn {
  background: #3b82f6;
  border: none;
  padding: 12px 22px;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.add-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.task-card {
  background: var(--task-card);
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  transition: 0.3s;
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.desc {
  opacity: 0.8;
  margin: 10px 0;
  color: var(--text-color);
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  font-size: 14px;
}

.category {
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 12px;
  color: white;
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
  background: var(--edit-task-popup);
  padding: 30px;
  border-radius: 24px;
  width: 520px;
  max-width: 95%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease;
}

.modal-select option {
  background: var(--tasks-input);
  color: var(--text-color);
  border-radius: 20px;
}

/* Common input styles */
.modal-input,
.modal-textarea,
.modal-select {
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  border: none;
  background: var(--tasks-input);
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
  color: rgba(0, 0, 0, 0.5);
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
}

.modal-select2 option {
  background: var(--tasks-select);
  color: var(--text-color);
  border-radius: 20px;
}

.modal-select2 {
  border-radius: 14px;
  border: none;
  background: var(--tasks-input);
  color: white;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.modal-select2:focus {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  transform: scale(1.02);
}

.modern-time {
  height: 44px;
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
  background: rgba(59, 130, 246, 0.6);
  transform: translateY(-2px) scale(1.02);
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
  transform: scale(1.05);
}

.save:hover {
  background: rgba(59, 130, 246, 0.6);
  transform: scale(1.05);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
}

.delete-btn:hover {
  transform: scale(1.3);
  color: #dc2626;
}

.edit-btn {
  background: transparent;

  border: none;
  color: #95c3ff;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
}

.edit-btn:hover {
  transform: scale(1.3);
  color: #174077;
}

.delete-modal {
  background: var(--edit-task-popup);
  color: var(--text-color);
  padding: 30px;
  border-radius: 20px;
  width: 350px;
  text-align: center;
  animation: fadeIn 0.2s ease;
}

.delete-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.delete-confirm {
  background: #ef4444;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.delete-confirm:hover {
  background: #dc2626;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);

    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
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

.header {
  display: flex;
  justify-content: space-between; /* dugme levo, filteri desno */
  align-items: center;
  flex-wrap: wrap; /* da filteri idu ispod na manjim ekranima */
  margin: 20px 0px;
}

.under-head {
  /* dugme levo */
}

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap; /* responsive */
}

.filter-input,
.filter-select {
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background: var(--tasks-input);
  color: var(--text-color);
  font-size: 14px;
  outline: none;
  min-width: 150px;
}

.filter-input::placeholder {
  color: var(--text-color);
}

.filter-input:focus,
.filter-select:focus {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
}

.noresult {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
}

.noresult img {
  height: 500px;
}

.late-btn {
  background: #e53935;
  color: white;
  border: none;
  padding: 9px 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.late-btn:hover {
  background: #771a1a;
  transform: translateY(-1px);
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
</style>
