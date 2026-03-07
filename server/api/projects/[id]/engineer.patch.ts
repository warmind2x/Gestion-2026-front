export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  return await $fetch(`${config.apiBase}projects/${id}/engineer`, {
    method: "PATCH",
    body,
  });
});
