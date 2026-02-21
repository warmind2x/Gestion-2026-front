<script setup lang="ts">
import { h, resolveComponent } from "vue";
const UButton = resolveComponent("UButton");

const route = useRoute();

const lcpCode = route.params.lcpCode as string;

const {
  data: project,
  pending,
  error,
} = await useFetch(`/api/projects/comprometido/${lcpCode}`);

const colums = [
  { accessorKey: "descripcion", header: "Descripcion" },
  {
    accessorKey: "refDoc",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Orden de Compra",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Monto",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: (info) =>
      new Intl.NumberFormat("es-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(info.getValue() as number),
  },
  { accessorKey: "currency", header: "Moneda" },
  {
    accessorKey: "docDate",
    header: "Fecha",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleDateString("es-CL", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
];
</script>

<template>
  <UCard class="mb-6">
    <template #header>
      <h2 class="text-lg font-semibold">
        Gastos Comprometidos - {{ project?.name }}
      </h2>
      <UButton
        color="neutral"
        variant="ghost"
        label="Volver a Proyectos"
        icon="i-lucide-arrow-left"
        class="ml-auto"
        @click="$router.back()"
      />
    </template>
    <div v-if="pending" class="p-4">Cargando...</div>
    <div v-else-if="error" class="p-4 text-red-500">Error cargando datos</div>
    <div v-else class="p-4">
      <UTable :data="project?.comprometidos" :columns="colums" />
    </div>
  </UCard>
</template>
