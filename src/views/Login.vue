<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="userLogin">
      <h1>Welcome back</h1>
      <p class="subtitle">Login to your agenda</p>

      <div class="form-group">
        <div class="input-wrap">
          <span><img src="/src/components/icons/userforlogin.png" /></span>
          <input type="text" v-model="username" required />
        </div>
      </div>

      <div class="form-group">
        <div class="input-wrap">
          <span><img src="/src/components/icons/padlock.png" /></span>
          <input :type="showPass ? 'text' : 'password'" v-model="password" required />
          <button type="button" class="show" @click="showPass = !showPass">👁</button>
        </div>
      </div>

      <button type="submit" class="login-btn">Login</button>

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
const showPass = ref(false)

const errorMsg = ref('')
const successMsg = ref('')

const userLogin = async () => {
  errorMsg.value = ''
  successMsg.value = ''

  try {
    await session.login(username.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = 'Wrong username or password'
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

/* CARD */

.login-card {
  width: 380px;
  padding: 40px;
  border-radius: 18px;
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: white;
}

.login-card h1 {
  text-align: center;
  margin: 0;
}

.subtitle {
  text-align: center;
  opacity: 0.7;
  font-size: 14px;
}

/* INPUTS */

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

.input-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
  padding: 0 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.input-wrap:focus-within {
  border: 1px solid #4facfe;
  box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.2);
}

.input-wrap span {
  margin: 0;
  margin-top: 5px;
}

.input-wrap span img {
  height: 16px;
  opacity: 0.9;
}

.input-wrap input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px;
  color: #222;
  font-size: 14px;
  background: transparent;
}

.input-wrap input::placeholder {
  color: #777;
}

/* SHOW PASSWORD */

.show {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

/* LOGIN BUTTON */

.login-btn {
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

/* DIVIDER */

.divider {
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0.6;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: white;
}

/* GOOGLE BUTTON */

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.google-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
}

.google-btn img {
  width: 20px;
}

/* ERROR / SUCCESS */

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
