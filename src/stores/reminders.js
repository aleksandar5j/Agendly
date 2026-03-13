import { defineStore } from 'pinia'
import api from '@/api'
import { useSessionStore } from '@/stores/sessionUser'

export const useReminderStore = defineStore('reminders', {
  state: () => ({
    reminders: [],
    activeReminders: [],
    activeCount: 0,
    showPopup: false,
  }),

  actions: {
    async loadReminders() {
      const session = useSessionStore()
      const res = await api.getAllReminders(session.sid)

      this.reminders = res.data.data.map((r) => ({
        ...r,
        lastPopupTime: 0,
      }))

      this.updateActiveReminders()
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

    updateActiveReminders() {
      this.showPopupManually()
    },

    checkReminders() {
      this.updateActiveReminders()
    },

    async autoDeleteExpired() {
      const session = useSessionStore()

      console.log('AUTO DELETE CHECK START')

      try {
        const res = await api.autoDeleteReminders(session.sid)

        console.log('AUTO DELETE RESPONSE:', res.data)

        await this.loadReminders()
      } catch (err) {
        console.error('Auto delete reminders error', err)
      }
    },

    startAutoDelete() {
      console.log('START AUTO DELETE TIMER')

      setInterval(() => {
        console.log('CHECKING FOR EXPIRED REMINDERS')
        this.autoDeleteExpired()
      }, 60000)
    },
  },
})
