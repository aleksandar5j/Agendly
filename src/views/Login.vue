<!-- eslint-disable vue/valid-template-root -->
<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="userLogin">
      <h1>Prijava</h1>

      <div class="form-group">
        <label>Korisničko ime</label>
        <input type="text" v-model="username" required />
      </div>

      <div class="form-group">
        <label>Šifra</label>
        <input type="password" v-model="password" required />
      </div>

      <button type="submit">Login</button>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success">{{ successMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSessionStore } from '@/stores/sessionUser'
import { useRouter } from 'vue-router'

const session = useSessionStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const successMsg = ref('')

const userLogin = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  try {
    await session.login(username.value, password.value)
    successMsg.value = 'Uspešan login'
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err.response?.data?.data || 'Greška prilikom prijavljivanja!'
    console.error(err.response?.data)
    console.log(err)
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  font-family: Arial, Helvetica, sans-serif;
}

.login-card {
  width: 340px;
  padding: 38px;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: white;
}

.login-card h1 {
  text-align: center;
  margin-bottom: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}

.login-card input {
  padding: 12px;
  border-radius: 8px;
  border: none;
  outline: none;
  font-size: 14px;
}

.login-card button {
  margin-top: 10px;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.login-card button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.4);
}

.error {
  background: rgba(255, 0, 0, 0.15);
  padding: 10px;
  border-radius: 8px;
  color: #ffb3b3;
  text-align: center;
  font-size: 13px;
}

.success {
  background: rgba(0, 255, 150, 0.15);
  padding: 10px;
  border-radius: 8px;
  color: #8affc1;
  text-align: center;
  font-size: 13px;
}
</style>
