export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  try {
    const projects = await $fetch(`${config.apiBase}projects`);
    return projects;
  } catch (error: any) {
    console.error("ERROR REAL DESDE NEST:", error);

    return {
      message: "Error desde backend",
      error,
    };
  }
});
