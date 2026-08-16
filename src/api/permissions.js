import api from "./axios";

export const getPermissions = () =>
  api.get("/permissions/").then((r) => r.data);

export const createPermission = (data) =>
  api.post("/permissions/", data).then((r) => r.data);

export const deletePermission = (id) =>
  api.delete(`/permissions/${id}`).then((r) => r.data);
