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
    <DashboardTable
      :projects="projects || []"
      @change-status="openStatusModal"
    />
  </div>
  <UModal v-model="isStatusModalOpen">
    <template #content>
      <div class="p-6 space-y-4">
        <h3 class="text-lg font-semibold">Cambiar estado</h3>

        <p>
          Proyecto:
          <strong>{{ selectedProject?.name }}</strong>
        </p>

        <USelect
          v-model="newStatus"
          :items="[
            { label: 'Abierto', value: 'ABIERTO' },
            { label: 'Cerrado', value: 'CERRADO' },
            { label: 'TECO', value: 'TECO' },
          ]"
        />

        <div class="flex justify-end gap-2 pt-4">
          <UButton
            label="Cancelar"
            variant="ghost"
            @click="isStatusModalOpen = false"
          />
          <UButton label="Guardar" @click="updateProjectStatus" />
        </div>
      </div>
    </template>
  </UModal>
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

type Project = {
  id: string;
  lcpCode: string;
  name: string;
  status: "ABIERTO" | "CERRADO" | "TECO";
};

// MODAL STATE
const isStatusModalOpen = ref(false);
const selectedProject = ref<Project | null>(null);
const newStatus = ref<"ABIERTO" | "CERRADO" | "TECO">("ABIERTO");

const toast = useToast();

function openStatusModal(project: Project) {
  selectedProject.value = project;
  newStatus.value = project.status;
  isStatusModalOpen.value = true;
}

async function updateProjectStatus() {
  if (!selectedProject.value) return;

  try {
    await $fetch(`/api/projects/${selectedProject.value.id}/status`, {
      method: "PATCH",
      body: { status: newStatus.value },
    });

    toast.add({
      title: "Estado actualizado",
      description: `Proyecto cambiado a ${newStatus.value}`,
      color: "success",
    });

    isStatusModalOpen.value = false;

    await refreshProjects();
    await refreshStats();
  } catch (err) {
    toast.add({
      title: "Error",
      description: "No se pudo actualizar el estado",
      color: "error",
    });
  }
}
</script>

<style scoped></style>
