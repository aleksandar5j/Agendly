<template>
  <div class="admin-page">
    <div class="admin-card">
      <h2>Admin Panel</h2>
      <p class="subtitle">Manage system</p>

      <!-- MAIN OPTIONS -->
      <div class="admin-options">
        <div class="option-card" @click="openList('users')">
          <img src="/src/components/icons/userforlogin.png" /> Users
        </div>

        <div class="option-card" @click="openList('attachments')">
          <img src="/src/components/icons/addfile.png" /> Attachments
        </div>
      </div>
    </div>
  </div>

  <!-- LIST POPUP -->
  <div v-if="listPopup.show" class="modal-overlay" @click.self="closeList">
    <div class="modal">
      <h3 style="font-weight: bold; margin-bottom: 10px; font-size: 20px">{{ listPopup.title }}</h3>

      <div class="list">
        <div v-for="item in listPopup.data" :key="item.id || item.usr_id" class="list-item">
          <div class="item-left" @click="openDetails(item, listPopup.type)">
            <span>{{ item.usr_username || item.atc_file_name }}</span>
            <span v-if="item.usr_isadmin" class="badge">ADMIN</span>
          </div>

          <button class="delete-btn" @click.stop="confirmDelete(item, listPopup.type)">
            Delete
          </button>
        </div>
      </div>

      <button class="btn" @click="closeList">Close</button>
    </div>
  </div>

  <!-- DETAILS POPUP -->
  <div v-if="detailsPopup.show" class="modal-overlay" @click.self="detailsPopup.show = false">
    <div class="modal details-modal">
      <h3>{{ detailsPopup.title }}</h3>

      <div v-if="detailsPopup.type === 'user'" class="details-content">
        <div class="detail-row">
          <span class="label">Username:</span>
          <span class="value">{{ detailsPopup.data.usr_username }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Full name:</span>
          <span class="value">{{ detailsPopup.data.usr_fullname }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Email:</span>
          <span class="value">{{ detailsPopup.data.usr_email }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Admin:</span>
          <span class="value">
            <span
              class="badge"
              :class="{
                admin: detailsPopup.data.usr_isadmin,
                user: !detailsPopup.data.usr_isadmin,
              }"
            >
              {{ detailsPopup.data.usr_isadmin ? 'Yes' : 'No' }}
            </span>
          </span>
        </div>
        <div class="detail-row">
          <span class="label">Created At:</span>
          <span class="value">{{ formatDate(detailsPopup.data.usr_createdat) }}</span>
        </div>
      </div>

      <div v-if="detailsPopup.type === 'file'" class="details-content">
        <div class="detail-row">
          <span class="label">Name:</span>
          <span class="value">{{ detailsPopup.data.atc_file_name }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Uploaded At:</span>
          <span class="value">{{ formatDate(detailsPopup.data.atc_uploadedat) }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Task ID:</span>
          <span class="value">{{ detailsPopup.data.tsk_id }}</span>
        </div>
        <div class="detail-row">
          <span class="label">File:</span>
          <button
            class="file-link"
            @click="downloadFile(detailsPopup.data.atc_file, detailsPopup.data.atc_file_name)"
          >
            Download / View
          </button>
        </div>
      </div>

      <button class="btn close-btn" @click="detailsPopup.show = false">Close</button>
    </div>
  </div>

  <div v-if="deletePopup.show" class="modal-overlay" @click.self="deletePopup.show = false">
    <div class="modal delete-modal">
      <h3>Are you sure?</h3>
      <p>
        Do you really want to delete this {{ deletePopup.type === 'user' ? 'user' : 'attachment' }}?
      </p>
      <div class="delete-actions">
        <button class="btn cancel" @click="deletePopup.show = false">Cancel</button>
        <button class="btn delete" @click="performDelete">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const users = ref([])
const attachments = ref([])

// LIST POPUP
const listPopup = ref({
  show: false,
  type: '',
  title: '',
  data: [],
})

// DETAILS POPUP
const detailsPopup = ref({
  show: false,
  type: '',
  title: '',
  data: {},
})

async function getUsers() {
  loading.value = true
  try {
    const res = await api.showAdminUsers()
    users.value = res.data.data
  } finally {
    loading.value = false
  }
}

async function getAttachments() {
  try {
    const res = await api.showAdminAttachments()
    attachments.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getUsers()
  getAttachments()
})

const openList = (type) => {
  if (type === 'users') {
    listPopup.value = {
      show: true,
      type: 'user',
      title: 'Users',
      data: users.value,
    }
  }
  if (type === 'attachments') {
    listPopup.value = {
      show: true,
      type: 'file',
      title: 'Attachments',
      data: attachments.value,
    }
  }
}

const performDelete = async () => {
  const { item, type } = deletePopup.value
  try {
    if (type === 'user') {
      await api.adminDeleteUser(item.usr_id)
      users.value = users.value.filter((u) => u.usr_id !== item.usr_id)
    } else if (type === 'file') {
      await api.adminDeleteAttachment(item.atc_id)
      attachments.value = attachments.value.filter((f) => f.atc_id !== item.atc_id)
    }

    listPopup.value.data = type === 'user' ? users.value : attachments.value
    deletePopup.value.show = false
  } catch (err) {
    console.log(err)
    alert('Failed to delete item')
  }
}

const deletePopup = ref({
  show: false,
  item: null,
  type: '',
})

const confirmDelete = (item, type) => {
  deletePopup.value = {
    show: true,
    item,
    type,
  }
}

const openDetails = (item, type) => {
  listPopup.value.show = false

  detailsPopup.value = {
    show: true,
    type: type, // sada sigurno 'user' ili 'file'
    title: 'Details',
    data: item,
  }
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

const loading = ref(false)

// CLOSE LIST
const closeList = () => {
  listPopup.value.show = false
}

const downloadFile = async (url, name) => {
  const res = await fetch(url)
  const blob = await res.blob()
  const size = blob.size
  console.log('File size:', formatFileSize(size))

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
}

const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown'
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i]
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-main);
  padding: 20px;
}

.admin-card {
  width: 100%;
  max-width: 600px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

h2 {
  color: var(--text-color);
  text-align: center;
}

.subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 25px;
}

.section {
  margin-bottom: 25px;
}

.section h3 {
  color: var(--text-color);
  margin-bottom: 10px;
}

/* LIST */
.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px; /* više paddinga sa strane */
  border-radius: 12px;
  background: var(--settingpage-input);
  color: var(--text-color);
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px; /* razmak između imena i badge-a */
  flex: 1;
}

.delete-btn {
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 10px;
}

.item-left span {
  cursor: pointer;
}

.badge {
  background: rgb(155, 155, 155);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 10px;
}

.details-modal {
  width: 100%;
  max-width: 420px;
  background: var(--card-bg);
  border-radius: 20px;
  padding: 25px 20px;
  color: var(--text-color);
  text-align: left;
  backdrop-filter: blur(15px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.details-modal h3 {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  color: var(--text-color);
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--bg-main);
  border-radius: 12px;
  font-size: 15px;
  transition: 0.2s;
}

.detail-row button {
  border: 0;
}

.detail-row:hover {
  background: rgba(255, 255, 255, 0.1);
}

.label {
  font-weight: 600;
  color: var(--text-muted);
}

.value {
  font-weight: 500;
  color: var(--text-color);
}

.badge {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.badge.admin {
  background: #4caf50;
  color: white;
}

.badge.user {
  background: #999;
  color: white;
}

.file-link {
  color: #2196f3;
  text-decoration: none;
  font-weight: 500;
}

.file-link:hover {
  text-decoration: underline;
}

.close-btn {
  margin-top: 20px;
  width: 100%;
  padding: 12px 0;
  border-radius: 12px;
  border: none;
  background: #2196f3;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.close-btn:hover {
  background: #1976d2;
}

/* MOBILE */
@media (max-width: 500px) {
  .details-modal {
    padding: 20px 15px;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .label,
  .value {
    font-size: 14px;
  }

  .close-btn {
    font-size: 15px;
    padding: 10px 0;
  }

  .modal {
    margin-right: 20px;
  }
}

.modal {
  background: var(--card-bg);
  padding: 30px 25px; /* više paddinga */
  border-radius: 20px;
  width: 100%;
  max-width: 300px;
  color: var(--text-color);
  text-align: center;
  backdrop-filter: blur(15px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0, 0.25);
  margin-right: 20px;

  max-height: 80vh;
  overflow-y: auto;
}

.btn {
  margin-top: 15px;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: var(--btn-bg);
  color: var(--text-color);
  cursor: pointer;
}

@media (max-width: 600px) {
  .admin-card {
    padding: 20px;
    margin: 10px;
  }

  .list-item {
    flex-direction: row;
    font-size: 15px;
    padding: 14px 16px;
  }

  .modal {
    margin-right: 20px;
  }

  .item-left span {
    font-size: 14px;
  }

  .delete-actions {
    flex-direction: column;
  }

  .delete-actions .btn {
    margin: 5px 0;
  }

  .option-card {
    padding: 18px;
    font-size: 18px;
    gap: 12px;
  }

  .admin-options {
    flex-direction: column; /* kolona kada je ekran uži */
    gap: 15px; /* razmak između kartica */
  }
}

.admin-options {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap; /* dozvoljava prelamanje */
  justify-content: center;
}

.option-card {
  flex: 1;
  padding: 25px;
  text-align: center;
  border-radius: 15px;
  background: var(--settingpage-input);
  color: var(--text-color);
  cursor: pointer;
  transition: 0.2s;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.option-card img {
  height: 25px;
  filter: var(--icon-filter);
}

.option-card:hover {
  background: rgba(255, 255, 255, 5, 0.2);
  transform: translateY(-3px);
}

.delete-btn {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 8px;
  background: red;
  color: white;
  cursor: pointer;
  font-size: 12px;
  transition: 0.2s;
}

.delete-btn:hover {
  background: darkred;
}

.delete-modal {
  max-width: 360px;
  padding: 25px 20px;
  text-align: center;
  border-radius: 18px;
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0, 0.2);
}

.delete-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 25px;
}

.delete-actions .btn {
  flex: 1;
  padding: 10px 0;
  font-weight: 600;
  border-radius: 12px;
}

.delete-actions .delete {
  background: red;
  color: white;
}

.delete-actions .delete:hover {
  background: darkred;
}

.delete-actions .cancel {
  background: var(--btn-bg);
  color: var(--text-color);
}

.delete-actions .cancel:hover {
  background: rgba(255, 255, 255, 5, 0.2);
}

.file-link {
  display: inline-block;
  padding: 10px 18px;
  background: #2196f3; /* plava boja */
  color: white;
  font-weight: 600;
  font-size: 14px;
  border-radius: 12px;
  text-decoration: none;
  transition: 0.2s;
  box-shadow: 0 4px 10px rgba(33, 150, 243, 0.3);
}

.file-link:hover {
  background: #1976d2; /* tamnija plava na hover */
  box-shadow: 0 6px 14px rgba(25, 118, 210, 0.4);
  transform: translateY(-2px);
}

.file-link:active {
  background: #1565c0;
  box-shadow: 0 2px 6px rgba(21, 101, 192, 0.4);
  transform: translateY(0);
}

/* MOBILE */
@media (max-width: 500px) {
  .file-link {
    padding: 8px 14px;
    font-size: 13px;
    border-radius: 10px;
  }
}
</style>
