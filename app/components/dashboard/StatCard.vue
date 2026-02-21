<script setup lang="ts">
interface Props {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
});
</script>

<template>
  <UCard class="hover:shadow-lg transition duration-200">
    <div class="flex justify-between items-center">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ props.title }}
        </p>
        <p class="text-3xl font-bold">
          {{ props.value }}
        </p>
      </div>

      <UIcon
        :name="props.icon"
        class="text-3xl"
        :class="`text-${props.color}-500`"
      />
    </div>
  </UCard>
</template>
