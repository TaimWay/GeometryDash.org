<template>
  <nav class="glass-navbar text-no-select">
    <div class="nav-container">
      <div class="nav-logo">
        <h2>Geometry Dash</h2>
      </div>
      
      <ul class="nav-menu">
        <li class="nav-item">
          <a href="/" class="nav-link">Home</a>
        </li>
        <li class="nav-item">
          <a href="/about" class="nav-link">About</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'GlassNavbar',
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const navbar = document.querySelector('.glass-navbar');
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }
  }
}
</script>

<style scoped>
.glass-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--header-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--header-border);
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
}

.nav-logo h2 {
  color: var(--theme-primary);
  text-shadow: 0 0 10px var(--theme-glow);
  font-weight: 700;
  margin: 0;
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  background: transparent;
  position: relative;
  z-index: 1;
}

.nav-link:hover {
  color: var(--theme-hover);
  text-shadow: 0 0 10px var(--theme-glow);
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.nav-link:hover::before {
  opacity: 1;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    padding: 1rem;
  }
  
  .nav-menu {
    margin-top: 1rem;
    gap: 1rem;
  } 
  
  .nav-logo h2 {
    font-size: 1.3rem;
  }
}
</style>