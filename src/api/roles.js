import api from "./axios";

export const getRoles = (skip = 0, limit = 100) =>
  api.get(`/roles/?skip=${skip}&limit=${limit}`).then((r) => r.data);

export const getRole = (id) =>
  api.get(`/roles/${id}`).then((r) => r.data);

export const createRole = (data) =>
  api.post("/roles/", data).then((r) => r.data);

export const updateRole = (id, data) =>
  api.put(`/roles/${id}`, data).then((r) => r.data);

export const deleteRole = (id) =>
  api.delete(`/roles/${id}`).then((r) => r.data);

export const assignPermissionsToRole = (roleId, permissionIds) =>
  api.post(`/roles/${roleId}/permissions`, { permission_ids: permissionIds }).then((r) => r.data);
