export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const lcpCode = getRouterParam(event, "lcpCode");

  try {
    const project = await $fetch(`${config.apiBase}projects/gastos/${lcpCode}`);
    return project;
  } catch (error: any) {
    console.error("ERROR REAL DESDE NEST:", error);

    return {
      message: "Error desde backend",
      error,
    };
  }
});
