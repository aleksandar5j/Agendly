import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'default',
  }),
  actions: {
    setTheme(val) {
      this.theme = val
      document.documentElement.setAttribute('data-theme', val)
      localStorage.setItem('theme', val)
    },
  },
})
