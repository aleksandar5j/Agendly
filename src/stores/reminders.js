import { defineStore } from 'pinia'
import api from '@/api'
import { useSessionStore } from '@/stores/sessionUser'

export const useReminderStore = defineStore('reminders', {
  state: () => ({
    tasksLate: [],
    reminders: [],
    activeReminders: [],
    activeCount: 0,
    showPopup: false, // za reminder-e
    showLatePopup: false, // za kasne taskove
    lateTasksPopup: [], // lista kasnih taskova za popup
  }),

  actions: {
    async loadReminders() {
      const session = useSessionStore()
      const res = await api.getAllReminders(session.sid)

      this.reminders = res.data.data
        .filter((r) => r.sts_id !== 5)
        .map((r) => ({ ...r, lastPopupTime: 0 }))
    },

    async loadLateTasks() {
      const session = useSessionStore()
      const res = await api.tasksLate(session.sid)

      this.tasksLate = res.data.data
    },

    showPopupManually() {
      const now = Date.now()
      const active = []

      this.reminders.forEach((rem) => {
        const taskTime = new Date(rem.tsk_date + ' ' + rem.tsk_time).getTime()
        const reminderTime = taskTime - rem.rem_minutes_before * 60000
        const reminderEndTime = taskTime

        if (now >= reminderTime && now <= reminderEndTime) {
          const remMinutesLeft = Math.round((taskTime - now) / 60000)
          active.push({ ...rem, remMinutesLeft })
        }
      })

      this.activeReminders = active
      this.activeCount = active.length

      if (active.length > 0) {
        this.showPopup = true

        setTimeout(() => {
          this.showPopup = false
        }, 5000)
      }
    },

    async showLateTasksPopup() {
      const now = Date.now()
      const lateTasks = this.tasksLate.filter((task) => {
        const taskTime = new Date(task.tsk_date + ' ' + task.tsk_time).getTime()
        return taskTime < now
      })

      if (lateTasks.length > 0) {
        this.lateTasksPopup = lateTasks
        this.showLatePopup = true

        setTimeout(() => {
          this.showLatePopup = false
        }, 5000)
      }
    },

    updateActiveReminders() {
      const now = Date.now()
      const active = []

      this.reminders.forEach((rem) => {
        const taskTime = new Date(rem.tsk_date + ' ' + rem.tsk_time).getTime()
        const reminderTime = taskTime - rem.rem_minutes_before * 60000
        const reminderEndTime = taskTime

        if (now >= reminderTime && now <= reminderEndTime) {
          const remMinutesLeft = Math.round((taskTime - now) / 60000)
          active.push({ ...rem, remMinutesLeft })
        }
      })

      this.activeReminders = active
      this.activeCount = active.length
      this.showPopup = active.length > 0

      if (this.showPopup) {
        setTimeout(() => {
          this.showPopup = false
        }, 5000)
      }
    },

    checkReminders() {
      this.updateActiveReminders()
    },

    async autoDeleteExpired() {
      const session = useSessionStore()

      try {
        const res = await api.autoDeleteReminders(session.sid)

        console.log('AUTO DELETE RESPONSE:', res.data)

        await this.loadReminders()
      } catch (err) {
        console.error('Auto delete reminders error', err)
      }
    },

    startAutoDelete() {
      setInterval(() => {
        this.autoDeleteExpired()
        this.updateActiveReminders() // osvežava popup i badge
      }, 15000) // pre 60000 -> 15000
    },
  },
})
