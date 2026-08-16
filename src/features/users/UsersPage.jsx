import { useState, useEffect } from "react";
import { Table, Button, Group, Text, Badge, Modal, TextInput, PasswordInput, Select, ActionIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getUsers, createUser, updateUser, deleteUser, assignRolesToUser } from "../../api/users";
import { getRoles } from "../../api/roles";
import { usePermission } from "../../hooks/usePermission";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" });
  const [roles, setRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const { hasPermission } = usePermission();

  const canCreate = hasPermission("user.create");
  const canEdit = hasPermission("user.update");
  const canDelete = hasPermission("user.delete");
  const canAssignRole = hasPermission("user.assign_role");

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users);
      setTotal(data.total);
    } catch (e) {
      notifications.show({ color: "red", title: "Error", message: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data.roles);
    } catch {}
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: "", email: "", password: "", role: "staff" });
    setSelectedRoleIds([]);
    open();
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setSelectedRoleIds([]);
    open();
  };

  const handleSubmit = async () => {
    try {
      if (editUser) {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await updateUser(editUser.id, payload);
        notifications.show({ color: "green", title: "Success", message: "User updated" });
      } else {
        await createUser(form);
        notifications.show({ color: "green", title: "Success", message: "User created" });
      }
      if (canAssignRole && selectedRoleIds.length > 0 && editUser) {
        await assignRolesToUser(editUser.id, selectedRoleIds);
      }
      close();
      loadUsers();
    } catch (e) {
      const msg = e.response?.data?.detail || e.message;
      notifications.show({ color: "red", title: "Error", message: msg });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      notifications.show({ color: "green", title: "Success", message: "User deleted" });
      loadUsers();
    } catch (e) {
      notifications.show({ color: "red", title: "Error", message: e.response?.data?.detail || e.message });
    }
  };

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Text size="xl" fw={700}>Users</Text>
          <Text c="dimmed" size="sm">Total: {total} users</Text>
        </div>
        {canCreate && (
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>Add User</Button>
        )}
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((u) => (
            <Table.Tr key={u.id}>
              <Table.Td><Text fw={500}>{u.name}</Text></Table.Td>
              <Table.Td>{u.email}</Table.Td>
              <Table.Td><Badge variant="light">{u.role}</Badge></Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {canEdit && (
                    <Tooltip label="Edit"><ActionIcon variant="subtle" onClick={() => openEdit(u)}><IconEdit size={16} /></ActionIcon></Tooltip>
                  )}
                  {canDelete && (
                    <Tooltip label="Delete"><ActionIcon variant="subtle" color="red" onClick={() => handleDelete(u.id)}><IconTrash size={16} /></ActionIcon></Tooltip>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editUser ? "Edit User" : "Create User"} size="md">
        <TextInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} mb="sm" />
        <TextInput label="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} mb="sm" />
        <PasswordInput label={editUser ? "Password (leave empty to keep)" : "Password"} required={!editUser} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} mb="sm" />
        <Select label="Role" data={["admin", "staff"]} value={form.role} onChange={(v) => setForm({ ...form, role: v })} mb="sm" />
        {canAssignRole && editUser && (
          <Select label="Assign Roles" data={roles.map((r) => ({ value: String(r.id), label: r.name }))} value={selectedRoleIds.map(String)} onChange={(vals) => setSelectedRoleIds((vals || []).map(Number))} searchable multiple mb="sm" />
        )}
        <Button fullWidth onClick={handleSubmit} mt="md">{editUser ? "Update" : "Create"}</Button>
      </Modal>
    </div>
  );
}
