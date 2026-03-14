import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTaskModalStore = defineStore('taskModal', () => {
  const selectedTask = ref(null)
  const showModal = ref(false)
  const newStatus = ref(null)

  function openTask(task) {
    selectedTask.value = task
    newStatus.value = task.status
    showModal.value = true
  }

  function closeTaskModal() {
    selectedTask.value = null
    showModal.value = false
  }

  return { selectedTask, showModal, newStatus, openTask, closeTaskModal }
})
