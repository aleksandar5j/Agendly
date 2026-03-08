import { defineStore } from 'pinia'
import api from '@/api'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    sid: localStorage.getItem('sid') || null,
    message: null,
  }),

  actions: {
    async login(username, password) {
      try {
        const res = await api.userLogin({ username, password })
        const payload = res.data?.data || res.data

        const { sessionUser, sid, message } = payload

        if (!sessionUser || !sid) {
          throw new Error('Neispravan login response')
        }

        this.user = sessionUser
        this.sid = sid
        this.message = message || null

        localStorage.setItem('user', JSON.stringify(sessionUser))
        localStorage.setItem('sid', sid)
      } catch (err) {
        this.logout()
        throw err
      }
    },

    logout() {
      this.user = null
      this.sid = null
      this.message = null

      localStorage.removeItem('user')
      localStorage.removeItem('sid')
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.user,
  },
})
