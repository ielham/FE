import { useState, useEffect } from "react";
import { SimpleGrid, Paper, Text, Group, RingProgress } from "@mantine/core";
import { IconUsers, IconShield, IconKey } from "@tabler/icons-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getUsers } from "../../api/users";
import { getRoles } from "../../api/roles";
import { getPermissions } from "../../api/permissions";

export default function DashboardHome() {
  const [stats, setStats] = useState({ users: 0, roles: 0, permissions: 0 });
  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersData, rolesData, permsData] = await Promise.all([
          getUsers(),
          getRoles(),
          getPermissions(),
        ]);
        setStats({
          users: usersData.total,
          roles: rolesData.total,
          permissions: permsData.permissions ? permsData.permissions.length : permsData.length || 0,
        });
        setRoleData(
          rolesData.roles.map((r) => ({
            name: r.name,
            permissions: r.permissions.length,
          }))
        );
      } catch {}
    };
    load();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, icon: IconUsers, color: "blue" },
    { label: "Total Roles", value: stats.roles, icon: IconShield, color: "violet" },
    { label: "Permissions", value: stats.permissions, icon: IconKey, color: "teal" },
  ];

  return (
    <div>
      <Text size="xl" fw={700} mb="lg">Dashboard</Text>

      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
        {cards.map((card) => (
          <Paper key={card.label} withBorder p="md" radius="md">
            <Group>
              <RingProgress
                size={80}
                thickness={8}
                sections={[{ value: 100, color: card.color }]}
                label={<card.icon size={20} />}
              />
              <div>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                  {card.label}
                </Text>
                <Text fw={700} size="xl">
                  {card.value}
                </Text>
              </div>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      {roleData.length > 0 && (
        <Paper withBorder p="md" radius="md">
          <Text size="sm" fw={600} mb="md">Permissions per Role</Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip />
              <Bar dataKey="permissions" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </div>
  );
}
