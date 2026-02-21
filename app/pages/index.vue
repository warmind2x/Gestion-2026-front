<template>
  <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4 p-2">
    <DashboardStatCard
      title="Total Proyectos"
      value="1,234"
      icon="i-heroicons-folder-solid"
      color="blue"
    />
    <DashboardStatCard
      title="Proyectos Activos"
      value="12"
      icon="i-heroicons-check-circle-solid"
      color="green"
    />
    <DashboardStatCard
      title="Gastos Reales"
      value="1,234"
      icon="i-heroicons-currency-dollar-solid"
      color="blue"
    />
    <DashboardStatCard
      title="Gastos Comprometidos"
      value="1,234"
      icon="i-heroicons-currency-dollar-solid"
      color="blue"
    />
  </div>
  <div class="p-2">
    <DashboardUChart
      :data="[
        { month: 'Ene', count: 10 },
        { month: 'Feb', count: 20 },
        { month: 'Mar', count: 15 },
        { month: 'Abr', count: 25 },
        { month: 'May', count: 30 },
        { month: 'Jun', count: 28 },
      ]"
      title="Gasto Proyectado"
    />
  </div>
  <div class="p-2">
    <DashboardTable :projects="projects || []" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { data: projects } = await useFetch("/api/projects", {
  method: "GET",
});
</script>

<style scoped></style>
