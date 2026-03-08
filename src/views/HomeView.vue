<template>
  <main class="landing-page">
    <!-- VIDEO BACKGROUND -->
    <video autoplay muted loop class="bg-video">
      <source src="/src/components/calendar.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    <!-- DARK OVERLAY -->
    <div class="overlay"></div>

    <div class="content-wrapper">
      <!-- LOGO -->
      <div class="left-panel">
        <img src="/src/components/logo.png" alt="Logo" class="logo" />
      </div>

      <!-- TEXT CONTENT -->
      <div class="right-panel">
        <h2>Welcome to Your Personal Agenda</h2>

        <p class="subtitle">
          Manage your tasks, events, and daily plans all in one place. Login or sign up to get
          started and never miss a deadline again!
        </p>

        <div class="actions">
          <RouterLink to="/login" class="btn">Login</RouterLink>
          <RouterLink to="/register" class="btn btn-secondary">Register</RouterLink>
        </div>
      </div>
    </div>
  </main>

  <div class="tips-grid">
    <div class="tips-card">
      <img src="/public/images/calendar.jpg" alt="Calendar" class="tips-img" />
      <div class="tips-content">
        <h3>Calendar Management</h3>
        <p>Add and organize your events with our simple calendar view.</p>
      </div>
    </div>

    <div class="tips-card">
      <img src="/public/images/task.jpg" alt="Tasks" class="tips-img" />
      <div class="tips-content">
        <h3>Task Tracking</h3>
        <p>Keep track of tasks and deadlines efficiently.</p>
      </div>
    </div>

    <div class="tips-card">
      <img src="/public/images/reminder.jpg" alt="Reminder" class="tips-img" />
      <div class="tips-content">
        <h3>Reminders</h3>
        <p>Set reminders so you never forget important appointments.</p>
      </div>
    </div>
    <div class="tips-card">
      <img src="/public/images/statistics.jpg" alt="Visuak Stats" class="tips-img" />
      <div class="tips-content">
        <h3>Visual Stats</h3>
        <p>Visualize your schedule with easy-to-read stats and summaries.</p>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.landing-page {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  color: #fff;
  overflow: hidden;
}

/* VIDEO BACKGROUND */
.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  filter: blur(10px) brightness(0.6);
  transform: scale(1.1);
}

/* DARK OVERLAY FOR READABILITY */
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(10, 15, 25, 0.65), rgba(10, 15, 25, 0.85));
  z-index: -1;
}

/* MAIN CONTENT */
.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 850px;
  gap: 30px;
  width: 100%;
  text-align: center;
}

/* LOGO */
.logo {
  height: 200px;
  width: auto;
}

/* TEXT BLOCK */
.right-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: -30px;
}

.right-panel h2 {
  font-size: 2.2rem;
  margin: 0;
  font-weight: 700;
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(210, 220, 255, 0.9);
  max-width: 600px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 5rem;
  padding: 2rem;
  max-width: 1000px;
  margin: 100px auto;
}

/* Kartica kao column: slika gore, tekst dole */
.tips-card {
  display: flex;
  flex-direction: column; /* vertikalno */
  align-items: center;
  background: rgba(206, 206, 206, 0.35);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(224, 224, 224, 0.3);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;
}

.tips-img {
  width: 100%;
  height: 300px; /* ili auto, ili fixed */
  object-fit: cover;
  flex-shrink: 0;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
}

/* Sadržaj ispod slike */
.tips-content {
  padding: 1.5rem;
  text-align: center;
}

.tips-content h3 {
  margin-bottom: 0.6rem;
  color: #2570ff;
  font-size: 1.2rem;
}

.tips-content p {
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
}

/* Hover efekat */
.tips-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
}

/* Responsive */
@media (max-width: 768px) {
  .tips-card {
    width: 100%;
  }

  .tips-content {
    padding: 1rem;
  }
}

/* BUTTONS */
.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  background-color: rgb(0, 123, 255);
  padding: 0.85rem 1.6rem;
  border-radius: 8px;
  color: #fff;
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
</style>
