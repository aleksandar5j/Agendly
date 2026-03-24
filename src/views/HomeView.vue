<template>
  <video autoplay muted loop playsinline class="bg-video">
    <source src="/videos/home2.mp4" type="video/mp4" />
  </video>

  <main class="landing-page">
    <div class="overlay"></div>

    <div class="content-wrapper">
      <img src="/public/favicon.ico" alt="Logo" class="logo" />

      <h2>
        Welcome to
        <strong style="color: rgb(0, 123, 255); font-weight: bold">Agend</strong>ly
      </h2>

      <p class="subtitle">Manage your tasks, events, and daily plans all in one place.</p>

      <div class="actions">
        <RouterLink to="/login" class="btn">Login</RouterLink>
        <RouterLink to="/register" class="btn btn-secondary">Register</RouterLink>
      </div>
    </div>

    <section class="video-section">
      <div class="video-text glass-card">
        <div class="text-row">
          <img src="/src/components/icons/calendar.png" class="video-icon" />
          <h2>Calendar Management</h2>
        </div>
        <p>Add and organize your events with our simple calendar view.</p>
      </div>

      <div class="video-text glass-card">
        <div class="text-row">
          <img src="/src/components/icons/task.png" class="video-icon" />
          <h2>Task Tracking</h2>
        </div>
        <p>Keep track of your tasks and deadlines efficiently.</p>
      </div>

      <div class="video-text glass-card">
        <div class="text-row">
          <img src="/src/components/icons/bell.png" class="video-icon" />
          <h2>Manage Reminders</h2>
        </div>
        <p>Set reminders so you never forget important appointments.</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const cards = document.querySelectorAll('.video-text')
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('animate')
    }, i * 300)
  })
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

html,
body {
  overflow-x: hidden;
}

.landing-page {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 70px;
  padding: 100px 20px 40px;
  margin-top: 100px;
  width: 100%;
  z-index: 1;
  flex-wrap: wrap;
}

.bg-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(58, 85, 139, 0.96);
  z-index: 0;
}

.content-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 605px;
  width: 100%;
  min-height: 475px;
  padding: 40px;
  border-radius: 20px;
  background: rgba(207, 207, 207, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 5px 30px 70px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(59, 138, 241, 0.7);
  color: #fff;
  z-index: 1;
}

.logo {
  height: 150px;
  margin-bottom: 20px;
}

.content-wrapper h2 {
  font-size: 40px;
  font-weight: bold;
}

.subtitle {
  font-size: 1.1rem;
  color: white;
}

/* Buttons */
.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin: 20px;
}

.btn {
  background-color: rgb(0, 123, 255);
  color: #fff;
  padding: 0.85rem 1.6rem;
  border-radius: 20px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-3px);
  background-color: rgb(30, 150, 255);
  box-shadow: 0 8px 20px rgba(0, 123, 255, 0.45);
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid rgb(0, 123, 255);
}

.btn-secondary:hover {
  background-color: rgb(0, 123, 255);
  color: #fff;
}

/* VIDEO SECTION */
.video-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;

  width: 100%;
  max-width: 600px;

  padding: 0 15px; /* 🔥 MARGINE SA STRANE */
}

/* GLASS CARD */
.glass-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 120px;

  text-align: center;
  padding: 25px 20px;
  border-radius: 20px;

  background: rgba(207, 207, 207, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 5px 30px 70px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(59, 138, 241, 0.7);
  color: #fff;
}

/* Animacija */
.video-text {
  transform: translateX(-150vw);
  opacity: 0;
  transition:
    transform 1s ease-out,
    transform 1s ease-out,
    opacity 1s ease-out;
}

.video-text.animate {
  transform: translateX(0);
  opacity: 1;
}

/* Icon + title */
.text-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
}

.video-icon {
  height: 50px;
  filter: invert(1);
}

.video-text h2 {
  font-size: 2rem;
  margin: 0;
}

.video-text p {
  font-size: 1.1rem;
  margin: 0;
}

/* MOBILE */
@media (max-width: 768px) {
  .landing-page {
    flex-direction: column;
    gap: 30px;
    padding: 30px;
  }

  .content-wrapper {
    max-width: 100%;
    padding: 0 10px; /* 🔥 kartice ne lepe uz ivicu */
  }

  .video-section {
    max-width: 100%;
    padding: 0 10px; /* 🔥 kartice ne lepe uz ivicu */
  }

  .glass-card {
    width: 100%;
  }

  .content-wrapper h2 {
    font-size: 28px;
  }

  .subtitle {
    font-size: 14px;
  }

  .logo {
    height: 100px;
  }

  .btn,
  .btn-secondary {
    width: 80%;
    font-size: 14px;
    padding: 12px 10px;
  }

  .video-text h2 {
    font-size: 1.4rem;
  }

  .video-text p {
    font-size: 0.95rem;
  }

  .video-icon {
    height: 35px;
  }
}
</style>
