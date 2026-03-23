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
  </main>

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
.landing-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 120px;
  z-index: 1;
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
  background: rgba(10, 20, 40, 0.6);
  z-index: 0;
}

/* Hero section content */
.content-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 545px;
  width: 100%;
  padding: 40px;
  border-radius: 20px;
  background: rgba(46, 110, 230, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(59, 138, 241, 0.7);
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
  color: rgba(210, 220, 255, 0.9);
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

/* Video section */
.video-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  padding: 80px 10px;
}

/* Glass card / feature card */
.glass-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 545px;
  text-align: center;
  padding: 40px;
  border-radius: 20px;

  background: rgba(46, 110, 230, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(59, 138, 241, 0.7);
  color: #fff;
}

/* Animacija ulaska */
.video-text {
  transform: translateX(-150vw);
  opacity: 0;
  transition:
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
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.video-text p {
  font-size: 1.2rem;
  color: #fff;
  margin: 0;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 20px;
    max-width: 80%;
  }

  .content-wrapper h2 {
    font-size: 28px;
  }

  .glass-card {
    padding: 20px;
    max-width: 80%;
  }

  .subtitle {
    font-size: 14px;
  }

  .logo {
    height: 100px;
  }

  .btn,
  .btn-secondary {
    width: 60%;
    font-size: 14px;
    padding: 12px 10px;
  }

  .video-section {
    padding: 50px 10px;
  }

  .glass-card {
    padding: 20px;
  }

  .video-text h2 {
    font-size: 1.5rem;
  }

  .video-text p {
    font-size: 1rem;
  }

  .video-icon {
    height: 40px;
  }
}
</style>
