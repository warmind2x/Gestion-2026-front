<template>
  <div class="layout-wrapper">
    <header class="layout-header">
      <nav>
        <UIHeader />
      </nav>
    </header>

    <UMain>
      <slot />
    </UMain>

    <footer class="layout-footer">
      <UIFooter />
    </footer>
  </div>
</template>

<script setup lang="ts">
// Add any layout-specific logic here
</script>

<style scoped></style>
