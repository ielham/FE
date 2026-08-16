import {
  AppShell,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  Box,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconDashboard,
  IconUsers,
  IconShield,
  IconLogout,
  IconMoon,
  IconSun,
  IconMap,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { usePermission } from "../hooks/usePermission";

const allMenuItems = [
  { label: "Dashboard", icon: IconDashboard, path: "/", perm: null },
  { label: "Users", icon: IconUsers, path: "/users", perm: "user.read" },
  { label: "Roles", icon: IconShield, path: "/roles", perm: "role.read" },
  { label: "Map", icon: IconMap, path: "/map", perm: null },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermission();
  const menuItems = allMenuItems.filter(
    (item) => !item.perm || hasPermission(item.perm)
  );
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dark = colorScheme === "dark";

  return (
    <AppShell
      navbar={{ width: 240, breakpoint: 0 }}
      header={{ height: 56 }}
      padding="md"
    >
      {/* HEADER */}
      <AppShell.Header
        style={{
          borderBottom: dark ? "1px solid #27272a" : "1px solid #e4e4e7",
          background: dark ? "#09090b" : "#ffffff",
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Text fw={700} size="lg">
            Dashboard
          </Text>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              size="lg"
              onClick={() => toggleColorScheme()}
              aria-label="Toggle color scheme"
            >
              {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            <Group gap="xs" ml="sm">
              <Text size="sm" fw={500}>
                {user?.name || user?.email || "User"}
              </Text>
              <ActionIcon
                variant="subtle"
                size="lg"
                color="red"
                onClick={logout}
                aria-label="Logout"
              >
                <IconLogout size={18} />
              </ActionIcon>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      {/* SIDEBAR */}
      <AppShell.Navbar
        p="xs"
        style={{
          background: dark ? "#09090b" : "#fafafa",
          borderRight: dark ? "1px solid #27272a" : "1px solid #e4e4e7",
        }}
      >
        <Box py="md">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <UnstyledButton
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  marginBottom: 4,
                  backgroundColor: active
                    ? dark
                      ? "#27272a"
                      : "#e4e4e7"
                    : "transparent",
                  color: active
                    ? dark
                      ? "#fafafa"
                      : "#09090b"
                    : dark
                      ? "#a1a1aa"
                      : "#71717a",
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s ease",
                }}
              >
                <ThemeIcon variant="light" size="sm">
                  <item.icon size={16} />
                </ThemeIcon>
                <Text size="sm">{item.label}</Text>
              </UnstyledButton>
            );
          })}
        </Box>
      </AppShell.Navbar>

      {/* CONTENT */}
      <AppShell.Main
        style={{
          background: dark ? "#09090b" : "#fafafa",
          minHeight: "100vh",
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
