<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

interface ProjectByMonth {
  month: string;
  count: number;
}

const props = defineProps<{
  data: ProjectByMonth[];
  title: string;
}>();

const chartData = computed(() => ({
  labels: props.data.map((p) => p.month),
  datasets: [
    {
      label: "Proyectos",
      data: props.data.map((p) => p.count),
      backgroundColor: "#3b82f6",
      borderRadius: 6,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
          }).format(context.raw);
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: any) {
          return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
            maximumFractionDigits: 0,
          }).format(value);
        },
      },
    },
  },
};
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ props.title || "Crecimiento de Proyectos" }}
      </h3>
    </template>

    <div class="h-48">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </UCard>
</template>
