import { useState, useEffect } from "react";
import { Table, Button, Group, Text, Badge, Modal, TextInput, Textarea, Checkbox, ActionIcon, Tooltip, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash, IconPlus, IconShield } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getRoles, createRole, updateRole, deleteRole, assignPermissionsToRole } from "../../api/roles";
import { getPermissions } from "../../api/permissions";
import { usePermission } from "../../hooks/usePermission";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [permOpened, { open: openPerm, close: closePerm }] = useDisclosure(false);
  const [editRole, setEditRole] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [allPermissions, setAllPermissions] = useState([]);
  const [selectedPermIds, setSelectedPermIds] = useState([]);
  const [currentRoleId, setCurrentRoleId] = useState(null);
  const { hasPermission } = usePermission();

  const canCreate = hasPermission("role.create");
  const canEdit = hasPermission("role.update");
  const canDelete = hasPermission("role.delete");
  const canAssign = hasPermission("role.assign_permission");

  const loadRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data.roles);
    } catch {} finally { setLoading(false); }
  };

  const loadPermissions = async () => {
    try {
      const data = await getPermissions();
      setAllPermissions(data.permissions || []);
    } catch {}
  };

  useEffect(() => { loadRoles(); loadPermissions(); }, []);

  const openCreate = () => {
    setEditRole(null);
    setForm({ name: "", description: "" });
    open();
  };

  const openEdit = (role) => {
    setEditRole(role);
    setForm({ name: role.name, description: role.description || "" });
    open();
  };

  const handleSubmit = async () => {
    try {
      if (editRole) {
        await updateRole(editRole.id, form);
        notifications.show({ color: "green", title: "Success", message: "Role updated" });
      } else {
        await createRole(form);
        notifications.show({ color: "green", title: "Success", message: "Role created" });
      }
      close();
      loadRoles();
    } catch (e) {
      notifications.show({ color: "red", title: "Error", message: e.response?.data?.detail || e.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    try {
      await deleteRole(id);
      notifications.show({ color: "green", title: "Success", message: "Role deleted" });
      loadRoles();
    } catch (e) {
      notifications.show({ color: "red", title: "Error", message: e.response?.data?.detail || e.message });
    }
  };

  const openPermModal = (role) => {
    setCurrentRoleId(role.id);
    setSelectedPermIds(role.permissions.map((p) => p.id));
    openPerm();
  };

  const handleAssignPerms = async () => {
    try {
      await assignPermissionsToRole(currentRoleId, selectedPermIds);
      notifications.show({ color: "green", title: "Success", message: "Permissions updated" });
      closePerm();
      loadRoles();
    } catch (e) {
      notifications.show({ color: "red", title: "Error", message: e.response?.data?.detail || e.message });
    }
  };

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Text size="xl" fw={700}>Roles</Text>
          <Text c="dimmed" size="sm">Total: {roles.length} roles</Text>
        </div>
        {canCreate && (
          <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>Add Role</Button>
        )}
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Permissions</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {roles.map((r) => (
            <Table.Tr key={r.id}>
              <Table.Td><Text fw={500}>{r.name}</Text></Table.Td>
              <Table.Td><Text size="sm" c="dimmed">{r.description || "-"}</Text></Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {r.permissions.slice(0, 3).map((p) => (
                    <Badge key={p.id} variant="light" size="sm">{p.code}</Badge>
                  ))}
                  {r.permissions.length > 3 && <Text size="xs" c="dimmed">+{r.permissions.length - 3}</Text>}
                </Group>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  {canAssign && (
                    <Tooltip label="Permissions"><ActionIcon variant="subtle" onClick={() => openPermModal(r)}><IconShield size={16} /></ActionIcon></Tooltip>
                  )}
                  {canEdit && (
                    <Tooltip label="Edit"><ActionIcon variant="subtle" onClick={() => openEdit(r)}><IconEdit size={16} /></ActionIcon></Tooltip>
                  )}
                  {canDelete && (
                    <Tooltip label="Delete"><ActionIcon variant="subtle" color="red" onClick={() => handleDelete(r.id)}><IconTrash size={16} /></ActionIcon></Tooltip>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={close} title={editRole ? "Edit Role" : "Create Role"} size="sm">
        <TextInput label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} mb="sm" />
        <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} mb="sm" />
        <Button fullWidth onClick={handleSubmit} mt="md">{editRole ? "Update" : "Create"}</Button>
      </Modal>

      <Modal opened={permOpened} onClose={closePerm} title="Assign Permissions" size="md">
        <Stack>
          {allPermissions.map((p) => (
            <Checkbox key={p.id} label={`${p.code} - ${p.description}`} checked={selectedPermIds.includes(p.id)} onChange={() => setSelectedPermIds((prev) => prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id])} />
          ))}
        </Stack>
        <Button fullWidth onClick={handleAssignPerms} mt="md">Save</Button>
      </Modal>
    </div>
  );
}
