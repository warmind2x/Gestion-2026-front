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
}

const props = defineProps<{
  projects: Project[];
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
      label: "View customer",
    },
    {
      label: "View payment details",
    },
  ];
}

const table = useTemplateRef("table");

const columnFilters = ref([]);
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
