<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Row } from "@tanstack/vue-table";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

interface Project {
  id: string;
  lcpCode: string;
  name: string;
  capTotal: number;
  expTotal: number;
  amount: number;
  createdAt: string;
  status: "ABIERTO" | "CERRADO" | "TECO";
}

// MODAL
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

    await refreshNuxtData();
  } catch (err) {
    toast.add({
      title: "Error",
      description: "No se pudo actualizar el estado",
      color: "error",
    });
  }
}

const props = defineProps<{
  projects: Project[];
}>();

const emit = defineEmits<{
  (e: "change-status", project: Project): void;
}>();

const columns: TableColumn<Project>[] = [
  { accessorKey: "lcpCode", header: "LCP Code" },
  { accessorKey: "name", header: "Project Name" },
  {
    accessorKey: "capTotal",
    header: "Capital Total",
    cell: (info) =>
      new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }).format(info.getValue() as number),
  },
  {
    accessorKey: "expTotal",
    header: "Expense Total",
    cell: (info) =>
      new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }).format(info.getValue() as number),
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleDateString("es-CL", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
  {
    id: "actions",
    meta: {
      class: {
        td: "text-right",
      },
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          content: {
            align: "end",
          },
          items: getRowItems(row),
          "aria-label": "Actions dropdown",
        },
        () =>
          h(UButton, {
            icon: "i-lucide-ellipsis-vertical",
            color: "neutral",
            variant: "ghost",
            "aria-label": "Actions dropdown",
          }),
      );
    },
  },
];

function getRowItems(row: Row<Project>) {
  return [
    {
      type: "label",
      label: "Acciones",
    },
    {
      label: "Ver Gastos",
      onSelect() {
        navigateTo(`/projects/gastos/${row.original.lcpCode}`);
      },
    },
    {
      label: "Ver Comprometido",
      onSelect() {
        navigateTo(`/projects/comprometido/${row.original.lcpCode}`);
      },
    },
    {
      type: "separator",
    },
    {
      label: "Cambiar Estado",
      onSelect() {
        emit("change-status", row.original);
      },
    },
    {
      label: "View payment details",
    },
  ];
}

const table = useTemplateRef("table");

const columnFilters = ref([]);
watch(isStatusModalOpen, (val) => {
  console.log("Modal:", val);
});
</script>

<template>
  <UCard class="mb-6">
    <template #header>
      <h3 class="text-lg font-semibold">Proyectos</h3>
      <div class="flex flex-col flex-1 w-full">
        <div class="flex px-4 py-3.5 border-b border-accented">
          <UInput
            :model-value="
              table?.tableApi?.getColumn('lcpCode')?.getFilterValue() as string
            "
            class="max-w-sm"
            placeholder="Filter LCP codes..."
            @update:model-value="
              table?.tableApi?.getColumn('lcpCode')?.setFilterValue($event)
            "
          />
          <UInput
            :model-value="
              table?.tableApi?.getColumn('name')?.getFilterValue() as string
            "
            class="max-w-sm pl-4"
            placeholder="Filter Project Names..."
            @update:model-value="
              table?.tableApi?.getColumn('name')?.setFilterValue($event)
            "
          />
        </div>

        <UTable
          ref="table"
          v-model:column-filters="columnFilters"
          :data="projects"
          :columns="columns"
        />
      </div>
    </template>
  </UCard>
</template>
