<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="login-page">
    <!-- VIDEO POZADINA -->
    <video autoplay muted loop class="bg-video">
      <source src="/public/videos/register.mp4" type="video/mp4" />
    </video>

    <!-- POLUPROZIRNI OVERLAY -->
    <div class="overlay"></div>

    <!-- REGISTER FORMA -->
    <form class="login-card" @submit.prevent="userRegister">
      <h1>Register</h1>
      <p class="subtitle">Create your account</p>

      <!-- Puno ime -->
      <div class="form-group">
        <div class="input-wrap">
          <span><img src="/src/components/icons/info.png" /></span>
          <input type="text" v-model="fullname" placeholder="Fullname" required />
        </div>
      </div>

      <!-- Korisničko ime -->
      <div class="form-group">
        <div class="input-wrap">
          <span><img src="/src/components/icons/userforlogin.png" /></span>
          <input type="text" v-model="username" placeholder="Username" required />
        </div>
      </div>

      <!-- Email -->
      <div class="form-group">
        <div class="input-wrap">
          <span><img src="/src/components/icons/email.png" /></span>
          <input type="email" v-model="email" placeholder="Email" required />
        </div>
      </div>

      <!-- Password -->
      <div class="form-group">
        <div class="input-wrap">
          <span><img src="/src/components/icons/padlock.png" /></span>
          <input
            :type="showPass ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            required
          />
          <button type="button" class="show" @click="showPass = !showPass">👁</button>
        </div>
      </div>

      <!-- Confirm Password -->
      <div class="form-group">
        <div class="input-wrap">
          <span><img src="/src/components/icons/padlock.png" /></span>
          <input
            :type="showPass ? 'text' : 'password'"
            v-model="password2"
            placeholder="Retype password"
            required
          />
          <button type="button" class="show" @click="showPass = !showPass">👁</button>
        </div>
      </div>

      <button type="submit" class="register-btn">Register</button>

      <div class="not-log">
        <p>You already have account?</p>
        <button class="login-btn" @click="backToLogin">Login</button>
      </div>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success">{{ successMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'
import { useRouter } from 'vue-router'
const router = useRouter()

const fullname = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const showPass = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

function backToLogin() {
  router.push('/login')
}
async function userRegister() {
  errorMsg.value = ''
  successMsg.value = ''

  if (password.value !== password2.value) {
    errorMsg.value = 'Šifre se ne poklapaju'
    return
  }

  try {
    await api.userRegister({
      fullname: fullname.value,
      username: username.value,
      email: email.value,
      password: password.value,
    })
    successMsg.value = 'Uspešno registrovano! Preusmeravanje na login...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    console.log(err)
    errorMsg.value = 'Došlo je do greške prilikom registracije'
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
  overflow: hidden;
}

/* VIDEO */
.bg-video {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

/* OVERLAY */
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(15, 32, 39, 0.6); /* tamniji overlay za bolju čitljivost */
  backdrop-filter: blur(0px);
  z-index: -1;
}

/* LOGIN CARD */
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
  z-index: 1; /* iznad videa i overlay-a */
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
  margin-top: 7px;
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

.login-btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #ffffff, #ffffff);
  color: black;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.register-btn {
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4facfe, #0083fe);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.not-log {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
