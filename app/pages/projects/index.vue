<template>
  <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4 p-2">
    <DashboardStatCard
      title="Total Proyectos"
      :value="stats?.totalProjects || '0'"
      icon="i-heroicons-folder-solid"
      color="blue"
    />

    <DashboardStatCard
      title="Proyectos Activos"
      :value="stats?.totalAbiertos || '0'"
      icon="i-heroicons-check-circle-solid"
      color="green"
    />
    <DashboardStatCard
      title="Gastos Reales"
      :value="
        stats?.totalGastos
          ? new Intl.NumberFormat('es-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(stats.totalGastos)
          : '0'
      "
      icon="i-heroicons-currency-dollar-solid"
      color="blue"
    />
    <DashboardStatCard
      title="Gastos Comprometidos"
      :value="
        stats?.totalComprometidos
          ? new Intl.NumberFormat('es-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(stats.totalComprometidos)
          : '0'
      "
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
const { data: stats } = await useFetch("/api/projects/projectsStats", {
  method: "GET",
});
</script>

<style scoped></style>
