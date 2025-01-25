<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light" role="navigation" aria-label="Main navigation">
        <!-- Navigation content will go here -->
      </nav>
    </header>

    <main class="flex-grow-1" role="main">
      <router-view></router-view>
    </main>

    <footer class="footer mt-auto py-3 bg-light" role="contentinfo">
      <div class="container">
        <span class="text-muted">© 2024 Chako. All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Component logic will go here
</script>

<style lang="scss">
// Global styles will be imported from assets/styles/main.scss
</style>
