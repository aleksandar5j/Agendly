<template>
  <!-- HERO SECTION -->
  <main class="landing-page">
    <video autoplay muted loop class="bg-video">
      <source src="/public/videos/homee.mp4" type="video/mp4" />
    </video>

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

  <!-- SECOND VIDEO -->
  <section class="video-section">
    <div class="aboutus">
      <h1>Organize Your Time. Focus on What Matters.</h1>
      <p>
        In today’s fast-paced world, staying organized is more important than ever. Agenda is a
        simple yet powerful task management platform designed to help you stay in control of your
        daily responsibilities, deadlines, and long-term goals. Whether you are managing work tasks,
        personal projects, or daily routines, Agenda gives you a clear and structured way to keep
        everything organized in one place. With an intuitive interface and powerful features, you
        can focus less on remembering what needs to be done and more on actually getting things
        done. Agenda is built for people who want a smarter way to plan their day, manage
        priorities, and stay productive without unnecessary complexity. more on actually getting
        things done. Agenda is built for people who want a smarter way to plan their day, manage
        priorities, and stay productive without unnecessary complexity.
      </p>
    </div>

    <hr />

    <div class="video-text glass-card">
      <div class="text-row">
        <img src="/src/components/icons/calendar.png" class="video-icon" />
        <h2>Calendar Management</h2>
      </div>
      <p>Add and organize your events with our simple calendar view.</p>
    </div>

    <!-- FEATURE: Tasks -->
    <div class="video-text glass-card">
      <div class="text-row">
        <img src="/src/components/icons/task.png" class="video-icon" />
        <h2>Task Tracking</h2>
      </div>
      <p>Keep track of your tasks and deadlines efficiently.</p>
    </div>

    <!-- FEATURE: Reminders -->
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
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
  filter: blur(1px);
  transform: scale(1);
}

/* DARK OVERLAY FOR READABILITY */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 32, 39, 0.6); /* tamniji overlay za bolju čitljivost */
  z-index: -1;
}

/* MAIN CONTENT */
.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 500px;
  gap: 20px;
  width: 100%;
  text-align: center;
  transform: translateX(-90px); /* pomera ulevo za 50px */

  padding: 40px;
  border-radius: 20px;

  /* glass effect */
  background: rgba(46, 110, 230, 0.07);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(15px);

  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);

  border: 2px solid rgba(59, 138, 241, 0.7);
}

.content-wrapper h2 {
  font-size: 40px;
  font-weight: bold;
}

/* LOGO */
.logo {
  height: 150px;
  width: auto;
  margin-bottom: 20px;
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

.video-text {
  transform: translateX(-150vw); /* startuje skroz levo van ekrana */
  opacity: 0;
  transition:
    transform 1s ease-out,
    opacity 1s ease-out;
}

.video-text.animate {
  transform: translateX(0); /* finalna pozicija */
  opacity: 1;
}

/* VIDEO SECTION */
.video-section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  padding: 40px 0;
  gap: 30px;
  flex-direction: column;
}

.video-section hr {
  border: 1px solid #2570ff;
  width: 70%;
  margin-bottom: 50px;
}

/* VIDEO */
.second-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(4px) brightness(0.5);
  transform: scale(1.1);
  z-index: -2;
}

/* DARK OVERLAY */
.video-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(10, 15, 25, 0.6), rgba(10, 15, 25, 0.85));
  z-index: -1;
}

/* WRAPPER ZA FEATURE CARDS */
.features-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 750px;
}

/* GLASS CARD EFFECT */
.glass-card {
  background: rgba(90, 154, 252, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 25px 35px;
  border: 2px solid rgba(112, 151, 209, 0.7);
  box-shadow: 0 20px 40px rgba(112, 151, 209, 0.35);

  /* UNIFORM HEIGHT & WIDTH */
  width: 35%;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* ICON + TITLE */
.text-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;
}

.video-icon {
  height: 50px;
  opacity: 0.7;
}

.video-text h2 {
  font-size: 2rem;
  margin: 0;
  opacity: 0.8;
  color: #525252;
}

.video-text p {
  font-size: 1.2rem;
  color: rgba(92, 92, 92, 0.9);
  margin: 0;
}

.aboutus {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 62%;
  margin: auto;
  color: black;
  gap: 10px;
  padding: 50px;
}

.aboutus h1 {
  font-weight: bold;
  opacity: 0.8;
  color: #2570ff;
  font-weight: bold;
}

.aboutus p {
  font-size: 20px;
  opacity: 0.7;
  color: #525252;
}
</style>
