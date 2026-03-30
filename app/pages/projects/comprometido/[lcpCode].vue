<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { Row } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
const UButton = resolveComponent("UButton");

const UDropdownMenu = resolveComponent("UDropdownMenu");

const route = useRoute();

const lcpCode = route.params.lcpCode as string;

/**
 *    ______                _   _                 
 *    |  ___|              | | (_)                
 *    | |_ _   _ _ __   ___| |_ _  ___  _ __  ___ 
 *    |  _| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 *    | | | |_| | | | | (__| |_| | (_) | | | \__ \
 *    \_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
 *                                                
 *                                                
 */

 
// Formateador de moneda (si tienes la moneda, úsala en currency)
const nf = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

// 🔢 Suma de porcentajes
const percentTotal = computed(() => {
  return milestones.value.reduce((s, m) => s + (Number(m.percent) || 0), 0)
})

// ✅ ¿Suma de % == 100?
const percentOk = computed(() => Math.abs(percentTotal.value - 100) < 0.01)

// ❗ % válidos (0..100 por hito)
const percentsValid = computed(() => milestones.value.every(m => {
  const p = Number(m.percent)
  return !Number.isNaN(p) && p >= 0 && p <= 100
}))

// 🗓️ Mes válido (YYYY-MM)
const monthsValid = computed(() =>
  milestones.value.every(m => /^\d{4}-\d{2}$/.test(m.month))
)

// 📝 Descripciones no vacías
const descriptionsValid = computed(() =>
  milestones.value.every(m => (m.description ?? '').trim().length > 0)
)

// 💡 Monto por hito (con último absorbiendo diferencia por redondeo)
const milestoneAmounts = computed(() => {
  const total = Number(comprometido.value) || 0
  const amounts = milestones.value.map((m) => {
    const pct = Number(m.percent) || 0
    const val = Math.round((total * (pct / 100)) * 100) / 100 // 2 decimales
    return val
  })
  // Ajuste de redondeo: último absorbe diferencia
  const diff = Math.round((total - amounts.reduce((s, x) => s + x, 0)) * 100) / 100
  if (amounts.length > 0 && Math.abs(diff) >= 0.01) {
    amounts[amounts.length - 1] = Math.round((amounts[amounts.length - 1] + diff) * 100) / 100
  }
  return amounts
})

// Totales (visual)
const totalAmount = computed(() => milestoneAmounts.value.reduce((s, x) => s + x, 0))




interface PaymentSchedule {
  id: string;
  comprometidoId: string;
  descripcion: string | null;
  amount: number;
  currency: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Comprometido {
  id: string;
  projectId: string;
  descripcion: string | null;
  refDoc: string;
  amount: number;
  currency: string;
  docDate: string | null;
  projectedExpenseDate: string | null;
  createdAt: string;
  updatedAt: string;
}

type Milestone = {
  description: string;
  percent: string | number;
  month: string;
};

const milestones = ref<Milestone[]>([
  { description: "", percent: "", month: "" }, // primer hito por defecto
]);

const addMilestone = () => {
  milestones.value.push({ description: "", percent: "", month: "" });
};

const removeMilestone = (index: number) => {
  milestones.value.splice(index, 1);
  if (milestones.value.length === 0) {
    milestones.value.push({ description: "", percent: "", month: "" });
  }
};

const isForecastModalOpen = ref(false);

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

function getRowItems(row: Row<Comprometido>) {
  return [
    {
      type: "label",
      label: "Acciones",
    },
    {
      label: "Cargar Forecast",
      onSelect() {
        openForecast(row.original);
      },
    },
  ];
}

function openForecast(comprometido: Comprometido) {
  isForecastModalOpen.value = true;
  console.log(comprometido);
}
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
  <UModal v-model:open="isForecastModalOpen" title="Cargar Forecast">
    <template #body>
      <div
        class="w-full max-w-[min(90vw,48rem)] max-h-[80vh] overflow-y-auto p-6"
      >
        <!-- Lista de hitos -->
        <div class="space-y-6">
          <div
            v-for="(m, idx) in milestones"
            :key="idx"
            class="rounded-lg border border-gray-700/40 p-4"
          >
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-gray-300">
                Hito {{ idx + 1 }}
              </h4>
              <UButton
                v-if="milestones.length > 1"
                color="red"
                variant="soft"
                icon="i-heroicons-trash"
                @click="removeMilestone(idx)"
              >
                Eliminar
              </UButton>
            </div>

            <div class="grid grid-cols-8.0 gap-4">
              <UFormField
                class="col-span-12 md:col-span-5"
                label="Hito del Forecast"
              >
                <UInput
                  v-model="m.description"
                  placeholder="Anticipo / Movimiento de tierra..."
                />
              </UFormField>

              <UFormField
                class="col-span-6 md:col-span-3"
                label="% Comprometido"
              >
                <UInput
                  v-model="m.percent"
                  placeholder="20"
                  type="number"
                  inputmode="decimal"
                />
              </UFormField>

              <UFormField
                class="col-span-6 md:col-span-4"
                label="Fecha comprometida"
              >
                <UInput v-model="m.month" type="month" />
              </UFormField>
            </div>
          </div>

          <!-- Botón para agregar otro set -->
          <div class="flex justify-start">
            <UButton
              color="gray"
              variant="soft"
              icon="i-heroicons-plus"
              @click="addMilestone"
            >
              Agregar hito
            </UButton>
          </div>

          <!-- Sección de monto (visual) -->
          <div
            class="flex items-center justify-between rounded-md border border-gray-700/50 p-4"
          >
            <span class="text-sm text-gray-400">Monto total (visual)</span>
            <span class="text-base font-semibold">$ —</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-2 mt-6">
          <UButton
            color="neutral"
            variant="soft"
            @click="isForecastModalOpen = false"
          >
            Cancelar
          </UButton>
          <UButton color="primary"> Guardar </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
