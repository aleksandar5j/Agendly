<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="tasks-page">
    <!-- Header -->
    <div class="head">
      <img src="/src/components/icons/task.png" />
      <h1>My Tasks</h1>
    </div>
    <div class="under-head">
      <button class="add-btn" @click="showModal = true">+ Add Task</button>
    </div>

    <!-- Tasks List -->
    <div class="tasks-grid">
      <div
        v-for="task in tasks"
        :key="task.tsk_id"
        class="task-card"
        :style="{ borderLeft: '6px solid ' + task.cat_color }"
      >
        <div class="task-header">
          <h3>{{ task.tsk_title }}</h3>
          <button class="delete-btn" @click="openDeleteModal(task.tsk_id)">✕</button>
        </div>

        <p class="desc">{{ task.tsk_description }}</p>

        <p class="desc">
          Status: <strong style="color: brown">{{ task.sts_name }}</strong>
        </p>

        <div class="task-footer">
          <span>{{ task.tsk_date }} • {{ task.tsk_time }}</span>
          <span class="category" :style="{ backgroundColor: task.cat_color }">
            {{ task.cat_name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Add New Task</h2>

        <!-- Title -->
        <input v-model="title" placeholder="Title" class="modal-input" />

        <!-- Description -->
        <textarea v-model="description" placeholder="Description" class="modal-textarea"></textarea>

        <!-- Modern Date -->
        <input type="date" v-model="date" class="modal-input modern-date" />

        <!-- Modern Time -->
        <input type="time" v-model="time" class="modal-input modern-time" />

        <!-- Category select -->
        <select v-model="cat_id" class="modal-input modal-select">
          <option disabled value="">Select category</option>
          <option v-for="cat in categories" :key="cat.cat_id" :value="cat.cat_id">
            {{ cat.cat_name }}
          </option>
        </select>

        <!-- File upload -->
        <label class="file-upload">
          Attach file
          <input type="file" @change="onFileChange" hidden />
        </label>

        <!-- Actions -->
        <div class="modal-actions">
          <button class="cancel" @click="showModal = false">Cancel</button>
          <button class="save" @click="saveTask">Save</button>
        </div>
      </div>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import { useSessionStore } from '@/stores/sessionUser'

const session = useSessionStore()

const tasks = ref([])
const categories = ref([])

const title = ref('')
const description = ref('')
const date = ref()
const time = ref()
const cat_id = ref()

const showDeleteModal = ref(false)
const taskToDelete = ref(null)
const showModal = ref(false)

function openDeleteModal(id) {
  taskToDelete.value = id
  showDeleteModal.value = true
}

async function confirmDelete() {
  await api.deleteTask(session.sid, taskToDelete.value)

  tasks.value = tasks.value.filter((t) => t.tsk_id !== taskToDelete.value)

  showDeleteModal.value = false
  taskToDelete.value = null
}

async function getTasks() {
  const res = await api.userAllTasks(session.sid)
  tasks.value = res.data.data
}

async function getCategories() {
  const res = await api.getCategories()
  categories.value = res.data.data
}

onMounted(() => {
  getTasks()
  getCategories()
})

const file = ref(null)

function onFileChange(e) {
  file.value = e.target.files[0]
}

async function saveTask() {
  const fd = new FormData()
  fd.append('title', title.value)
  fd.append('description', description.value)
  fd.append('date', date.value)
  fd.append('time', time.value)
  fd.append('cat_id', Number(cat_id.value))
  fd.append('sid', session.sid)

  if (file.value) {
    fd.append('file', file.value) // sadržaj fajla
    fd.append('file_name', file.value.name) // ime fajla
  }

  await api.postTask(fd)

  showModal.value = false
  file.value = null
  getTasks()
}
</script>

<style scoped>
.tasks-page {
  padding: 40px 80px;
  min-height: 100vh;
  background: linear-gradient(135deg, #46638b, #26344b);
  color: white;
  font-family: Inter, sans-serif;
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
  background: rgba(255, 255, 255, 0.08);
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
  background: rgba(31, 41, 55, 0.95);
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

/* Common input styles */
.modal-input,
.modal-textarea,
.modal-select {
  width: 100%;
  padding: 14px 18px;
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
}

/* Placeholder */
.modal-input::placeholder,
.modal-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
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

/* Modern Date & Time */
.modern-date,
.modern-time {
  height: 44px;
}

/* File upload */
.file-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.3);
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
  background: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 18px rgba(59, 130, 246, 0.9);
  transform: translateY(-2px) scale(1.02);
}

/* Buttons */
.cancel {
  background: #6b7280;
}

.save {
  background: rgba(59, 130, 246, 0.5);
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
  background: rgba(59, 130, 246, 0.3);
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
  transform: scale(1.2);
  color: #dc2626;
}

.delete-modal {
  background: #1f2937;
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
  flex-direction: row;
  gap: 20px;
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
  font-size: 30px;
  color: white;
  margin: 0;
}

.under-head {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px;
}
</style>
