export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  console.log(`${config.apiBase}projects/dashboard/stats`);

  return await $fetch(`${config.apiBase}projects/dashboard/stats`);
});
