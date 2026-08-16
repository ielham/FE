import api from "./axios";

export const getUsers = (skip = 0, limit = 100) =>
  api.get(`/users/?skip=${skip}&limit=${limit}`).then((r) => r.data);

export const getUser = (id) =>
  api.get(`/users/${id}`).then((r) => r.data);

export const createUser = (data) =>
  api.post("/users/", data).then((r) => r.data);

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data).then((r) => r.data);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`).then((r) => r.data);

export const assignRolesToUser = (userId, roleIds) =>
  api.post(`/users/${userId}/roles`, { role_ids: roleIds }).then((r) => r.data);
