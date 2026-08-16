import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import {
  LayoutDashboard,
  Users,
  Table as TableIcon,
  Settings,
  Shield,
  Search,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Users", icon: Users, to: "/users" },
  { label: "Data Table", icon: TableIcon, to: "/table" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold">AIDesk</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2">
        <Button variant="outline" className="w-full justify-start gap-2" size="sm">
          <Search className="h-4 w-4" />
          Search
          <kbd className="ml-auto rounded border bg-muted px-1 text-xs">
            ⌘K
          </kbd>
        </Button>
      </div>
    </div>
  );
}
